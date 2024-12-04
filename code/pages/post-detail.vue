<template>
  <div class="post-container" v-if="post">
    <!-- Header -->
    <div class="header">
      <div class="left">
        <!-- 动态绑定用户头像 -->
        <img
          class="user-avatar"
          :src="post.data.user_pho"
          alt="用户头像"
        />
        <div>
          <h3 class="username">{{ post.data.nickname }}</h3>
          <p class="date">{{ post.data.chat_time }}</p>
        </div>
      </div>
      <button class="follow-btn" @click="toggleFollow">
        {{ isFollowed ? '已关注' : '+ 关注' }}
      </button>
    </div>

    <!-- Content -->
    <div class="content">
      <p>{{ post.data.user_chat }}</p>
      <div v-if="post.data.user_chat_pho.length" class="post-images">
    <img
      v-for="(img, index) in post.data.user_chat_pho"
      :key="index"
      class="post-image"
      :src="img"
      alt="内容图片"
    />
  </div>
    </div>

    <!-- Actions -->
    <div class="actions">
      <div class="action-item" @click="likePost">
        <img
          :src="isLiked ? '../../static/heart-filled.png' : '../../static/heart.png'"
          class="action-icon"
          alt="点赞"
        />
        <span>{{ post.data.user_liked }}</span>
      </div>

      <!-- 收藏按钮 -->
      <div class="action-item" @click="collectPost">
        <img
          :src="isCollected ? '../../static/star-filled.png' : '../../static/star.png'"
          class="action-icon"
          alt="收藏"
        />
        <span>{{ post.data.user_collected }}</span>
      </div>

      <div class="action-item">
        <img src="../../static/chat.png" class="action-icon" alt="评论" />
        <span>{{ post.data.user_comment }}</span>
      </div>
    </div>

    <!-- Comments -->
    <div class="comments">
      <h4>评论</h4>
      <div v-for="comment in post.data.comments" :key="comment.commentId" class="comment">
        <img
          class="comment-avatar"
          :src="comment.avatar"
          alt="评论头像"
        />
        <div>
          <p class="comment-username">{{ comment.nickname }}</p>
          <p class="comment-text">{{ comment.text }}</p>
          <div class="comment-footer">
            <span class="comment-date">{{ comment.date }}</span>
            <!-- 删除按钮，仅当用户是帖子作者或评论作者时显示 -->
          </div>
        </div>
      </div>
    </div>

    <!-- 添加评论区域 -->
    <div class="add-comment">
      <input v-model="newComment" placeholder="写下你的评论..." />
      <button @click="addComment">发布</button>
    </div>
  </div>
  <!-- 数据加载中或错误提示 -->
  <div v-else>
    <span>加载中...</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: null,
      currentUserId: '',
      isLiked: false,
      isCollected: false,
      isFollowed: false,
      newComment: '',
    };
  },
  computed: {
    
    isAuthor() {
      return this.post && String(this.post.data.user_id) === String(this.currentUserId);
    },
  },
  isLiked() {
      return Array.isArray(this.post.data.liked_users)
        ? this.post.data.liked_users.includes(this.currentUserId)
        : false;
    },
  async onLoad(options) {
    const postId = options.id;
    console.log('接收到的帖子ID:', postId);
    if (!postId) {
      uni.showToast({ title: '帖子ID缺失', icon: 'none' });
      return;
    }

    try {
      const user = uni.getStorageSync('currentUser');
      console.log('获取到的 currentUser:', user); // 调试信息

      if (user && user.user_id) {
        this.currentUserId = user.user_id;
        console.log('已获取用户信息:', user);

      } else {
        // 未登录，跳转到登录页面
        uni.showToast({ title: '请先登录', icon: 'none' });
        uni.navigateTo({ url: '/pages/login/login' });
        return;
      }

      console.log('当前用户ID:', this.currentUserId);
      
      // 调用云函数获取帖子详情
      console.log('调用云函数 getPostDetail...');
      const res = await uniCloud.callFunction({
        name: 'getPostDetail',
        data: { postId },
      });
      console.log('云函数返回:', JSON.stringify(res));

      if (res.result && res.result.success && res.result.data) {
        this.post = res.result.data;


        const followRes = await uniCloud.callFunction({
          name: 'checkFollow',
          data: {
            followerId: this.currentUserId,
            followeeId: this.post.data.user_id,
          },
        });
        if (followRes.result && followRes.result.isFollowed) {
          this.isFollowed = true;
        } else {
          this.isFollowed = false;
        }

        // 处理评论数据
        if (Array.isArray(this.post.data.comments)) {
          // 评论中已经包含 nickname 和 avatar
        } else {
          this.post.data.comments = [];
        }

        // 判断是否已点赞和已收藏
        this.isLiked = Array.isArray(this.post.data.liked_users)
          ? this.post.data.liked_users.includes(this.currentUserId)
          : false;
        this.isCollected = Array.isArray(this.post.data.collected_users)
          ? this.post.data.collected_users.includes(this.currentUserId)
          : false;

        console.log('帖子数据:', JSON.stringify(this.post));
      } else if (res.result && res.result.error) {
        console.error('云函数错误:', res.result.error);
        uni.showToast({
          title: res.result.error || '加载帖子失败',
          icon: 'none',
        });
      } else {
        console.error('未返回有效的数据');
        uni.showToast({
          title: '未返回有效的数据',
          icon: 'none',
        });
      }
    } catch (error) {
      console.error('加载帖子失败:', error);
      uni.showToast({
        title: error.message || '加载帖子失败',
        icon: 'none',
      });
    }
  },


  methods: {
    isCommentAuthor(comment) {
      return String(comment.userId) === String(this.currentUserId);
    },
    
    async toggleFollow() {
      try {
        const action = this.isFollowed ? 'unfollow' : 'follow';
        console.log(`调用关注云函数，用户ID: ${this.currentUserId}, 动作: ${action}, 被关注用户ID: ${this.post.data.user_id}`);

        const res = await uniCloud.callFunction({
          name: 'updateFollow',
          data: {
            followerId: this.currentUserId,
            followeeId: this.post.data.user_id,
            action: action,
          },
        });

        console.log('关注云函数返回:', res);

        if (res.result && res.result.success) {
          this.isFollowed = !this.isFollowed;
          uni.showToast({
            title: this.isFollowed ? '已关注' : '已取消关注',
            icon: 'success',
          });
        } else {
          uni.showToast({
            title: '操作失败',
            icon: 'none',
          });
        }
      } catch (error) {
        console.error('关注操作失败', error);
        uni.showToast({
          title: '操作失败',
          icon: 'none',
        });
      }
    },





    async likePost() {
      try {
        // 判断当前状态，决定是点赞还是取消点赞
        const action = this.isLiked ? 'unlike' : 'like';
        console.log(`调用点赞云函数，帖子ID: ${this.post._id}, 动作: ${action}`);


        const res = await uniCloud.callFunction({
          name: 'updateLike',
          data: {
            postId: this.post._id,
            userId: this.currentUserId,
            action: action,
          },
        });
        console.log('点赞云函数返回:', res);

        if (res.result && res.result.success && res.result.updated) {

        // 更新本地 liked_users 数组
        if (action === 'like') {
          this.post.data.liked_users.push(this.currentUserId);
          this.post.data.user_liked += 1;
          this.isLiked = true; // 更新 isLiked 状态
          uni.showToast({
            title: '点赞成功',
            icon: 'success'
          });
        } else {
          const index = this.post.data.liked_users.indexOf(this.currentUserId);
          if (index > -1) {
            this.post.data.liked_users.splice(index, 1);
            this.post.data.user_liked -= 1;
          }
          this.isLiked = false; // 更新 isLiked 状态

          uni.showToast({
            title: '取消点赞',
            icon: 'success'
          });
        }
          
      // 触发事件以同步其他页面
      uni.$emit('updatePost', this.post._id, {
        user_liked: this.post.data.user_liked,
        liked_users: this.post.data.liked_users,
        isLiked: this.isLiked
      });

          
        } else {
          uni.showToast({
            title: res.result.message || '操作失败',
            icon: 'none'
          });
          console.error('云函数返回错误:', res.result.message);
        }
      } catch (error) {
        console.error('点赞操作失败', error);
        uni.showToast({
          title: '操作失败',
          icon: 'none',
        });
      }
    },
    
    async collectPost() {
      try {
        // 判断当前状态，决定是收藏还是取消收藏
        const action = this.isCollected ? 'uncollect' : 'collect';
        console.log(`调用收藏云函数，帖子ID: ${this.post._id}, 动作: ${action}`);

        const res = await uniCloud.callFunction({
          name: 'updateCollect',
          data: {
            postId: this.post._id,
            userId: this.currentUserId,
            action: action,
          },
        });
        console.log('收藏云函数返回:', res);
        console.log('云函数返回结构:', JSON.stringify(res));

        if (res.result && res.result.updated) {


          if (action === 'collect') {
            this.post.data.user_collected += 1;
            this.isCollected = true;
            this.post.data.collected_users.push(this.currentUserId);
            uni.showToast({
              title: '收藏成功',
              icon: 'success',
            });
          } else {

            const index = this.post.data.collected_users.indexOf(this.currentUserId);
            if (index > -1){
              this.post.data.collected_users.splice(index, 1);
              this.post.data.user_collected -= 1;
            }
            this.isCollected = false;

            uni.showToast({
              title: '已取消收藏',
              icon: 'none',
            });
          }
          uni.$emit('updatePost', this.post._id, {
            user_collected: this.post.data.user_collected,
            collected_users: this.post.data.collected_users,
            isCollected: this.isCollected
          });

        } else if (res.result && res.result.message) {
          uni.showToast({
            title: res.result.message,
            icon: 'none',
          });
        } else {
          uni.showToast({
            title: '操作失败',
            icon: 'none',
          });
        }
      } catch (error) {
        console.error('收藏操作失败', error);
        uni.showToast({
          title: '操作失败',
          icon: 'none',
        });
      }
    },
    
    async deleteComment(commentId) {
      console.log(`尝试删除评论ID: ${commentId}，用户ID: ${this.currentUserId}`);
      try {
        const res = await uniCloud.callFunction({
          name: 'deleteComment',
          data: {
            postId: this.post._id,
            commentId: commentId,
            userId: this.currentUserId,
          },
        });

        console.log('deleteComment 云函数返回:', res);

        if (res.result && res.result.success) {
          const index = this.post.data.comments.findIndex(c => c.commentId === commentId);
          if (index > -1) {
            this.post.data.comments.splice(index, 1);
            this.post.data.user_comment -= 1;
            uni.showToast({
              title: '删除评论成功',
              icon: 'success',
            });
          }
        } else {
          uni.showToast({
            title: res.result.error || '删除评论失败',
            icon: 'none',
          });
          console.error('云函数返回错误:', res.result.error);
        }
      } catch (error) {
        console.error('删除评论失败:', error);
        uni.showToast({
          title: '删除评论失败',
          icon: 'none',
        });
      }
    },

    async addComment() {
  if (!this.newComment.trim()) {
    uni.showToast({ title: '评论内容不能为空', icon: 'none' });
    return;
  }
  const comment = {
    userId: this.currentUserId,
    text: this.newComment,
    date: new Date().toLocaleString(),
    commentId: Date.now().toString(),
  };
  console.log('准备发送的评论数据:', comment); // 调试信息

  try {
    const res = await uniCloud.callFunction({
      name: 'addComment',
      data: {
        postId: this.post._id, // 确保传递 postId
        comment: comment,
      },
    });
    console.log('addComment 云函数返回:', res);
    console.log('当前帖子 ID:', this.post._id);
    if (res.result && res.result.success) {
      this.post.data.comments.push(res.result.data);
      this.post.data.user_comment += 1;
      this.newComment = '';

          // 触发事件以同步其他页面
          uni.$emit('updatePost', this.post._id, {
            comments: this.post.comments,
            user_comment: this.post.user_comment
          });


      uni.showToast({ title: '评论成功', icon: 'success' });
    } else {
      uni.showToast({ title: res.result.error || '评论失败', icon: 'none' });
      console.error('云函数返回错误:', res.result.error);
    }
  } catch (error) {
    console.error('添加评论失败:', error);
    uni.showToast({ title: '评论失败', icon: 'none' });
  }
}
  },

  mounted() {
  uni.$on('updatePost', (postId, updates) => {
    if (this.post && this.post._id === postId) {
      if (updates.user_liked !== undefined) {
        this.post.data.user_liked = updates.user_liked;
      }
      if (updates.liked_users !== undefined) {
        this.post.data.liked_users = updates.liked_users;
      }
      if (updates.isLiked !== undefined) {
        this.isLiked = updates.isLiked;
      }
        // 更新收藏信息
        if (updates.user_collected !== undefined) {
          this.post.data.user_collected = updates.user_collected;
        }
        if (updates.collected_users !== undefined) {
          this.post.data.collected_users = updates.collected_users;
          this.isCollected = this.post.data.collected_users.includes(this.currentUserId);
        }
        if (updates.user_comment !== undefined) {
          this.post.data.user_comment = updates.user_comment;
        }
        console.log('更新后的帖子:', this.post);

    }
  });
},
  beforeDestroy() {
    uni.$off('updatePost');
  },







};
</script>


<style scoped>
.post-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.left {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover; /* 确保图片按比例填充 */
}

.username {
  font-size: 16px;
  font-weight: bold;
}

.date {
  font-size: 12px;
  color: #888;
}

.follow-btn {
  background: #db0c0c; /* 按钮背景颜色 */
  color: #fff;          /* 按钮文字颜色 */
  border: none;         /* 无边框 */
  border-radius: 16px;  /* 圆角 */
  padding: 4px 10px;    /* 内边距 */
  cursor: pointer;      /* 鼠标指针样式 */
  font-size: 14px;      /* 字体大小 */
  transition: background 0.3s ease; /* 背景色过渡效果 */
  margin-right: 16px; /* 添加右边距 */
}

.follow-btn:hover {
  background: #b30000; /* 悬停时的背景颜色 */
}

.content {
  margin-bottom: 16px;
}

.post-image {
  width: 100%;
  border-radius: 8px;
  margin-top: 10px;
  object-fit: cover;
}

.actions {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.action-icon {
  width: 24px;
  height: 24px;
  margin-right: 5px;
}

.actions span {
  font-size: 14px;
  color: #555;
}

.comments {
  border-top: 1px solid #ddd;
  padding-top: 16px;
}

.comment {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.comment-username {
  font-size: 14px;
  font-weight: bold;
}

.comment-text {
  font-size: 14px;
  margin: 4px 0;
}

.comment-footer {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 12px;
}

.delete-btn {
  background: #f00;            /* 红色背景 */
  color: #fff;                 /* 白色文字 */
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: 10px;           /* 添加左边距 */
}

.delete-btn:hover {
  background: #c00;             /* 悬停时更深的红色 */
}

.add-comment {
  display: flex;
  margin-top: 16px;
}

.add-comment input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-comment button {
  margin-left: 8px;
  padding: 5px 10px; /* 增加内边距，使按钮更大 */
  background: #ff6666;
  color: #fff;
  border: none;
  border-radius: 6px; /* 增加圆角 */
  cursor: pointer;
  font-size: 14px; /* 设置字体大小 */
  font-weight: bold;
  transition: background 0.3s ease, transform 0.2s ease; /* 添加过渡效果 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.add-comment button:hover {
  background: #ff4d4d;
  transform: translateY(-2px); /* 添加轻微上移效果 */
}

.debug-section {
  border: 1px solid #f00;
  padding: 10px;
  margin-bottom: 20px;
}
</style>