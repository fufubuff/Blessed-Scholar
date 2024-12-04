<template>
  <view class="container">
    <view style="height: 20px;"></view>
    <!-- Header with title and search button -->
    <view class="header">
      <text class="title">小研圈</text>
      <icon type="search" size="24" class="search-icon" />
    </view>

    <!-- Tab Navigation -->
    <view class="tab-bar">
      <view class="tab-container" @click="setActiveTab('求解答')">
        <text class="tab" :class="{ active: activeTab === '求解答' }">求解答</text>
        <view v-if="activeTab === '求解答'" class="underline"></view>
      </view>
      <view class="tab-container" @click="setActiveTab('加油站')">
        <text class="tab" :class="{ active: activeTab === '加油站' }">加油站</text>
        <view v-if="activeTab === '加油站'" class="underline"></view>
      </view>
      <view class="tab-container" @click="setActiveTab('关注')">
        <text class="tab" :class="{ active: activeTab === '关注' }">关注</text>
        <view v-if="activeTab === '关注'" class="underline"></view>
      </view>
    </view>

    <!-- 错误信息显示 -->
    <view v-if="loadError" class="error-message">
      <text>{{ loadError }}</text>
    </view>

    <!-- 加油站内容 -->
    <view v-if="activeTab === '加油站'">
      <scroll-view :scroll-y="true" style="height: calc(100vh - 180px);">
        <!-- 横幅区域 -->
        <view class="banner" @click="navigateToActivityDetail">

          <view class="banner-title">21天高数模拟卷打卡活动招募令</view>
          <view class="banner-subtitle">每日一模拟，不模拟就淘汰～</view>
          <view class="banner-bottom">
            <view class="banner-subtitle_min">来吧，一起坚持21天，做行动派！</view>
            <view class="banner-btn">
              <!-- 可以添加按钮或其他内容 -->
            </view>
          </view>
        </view>

        <!-- 帖子列表 -->
        <view class="jyz_li_box">
          <view class="jyz_li" v-for="(item, index) in jyzs" :key="item._id" @click="goToPostDetail(item._id)">
            <view class="jyz_li_left">
              <image :src="item.data.user_pho" class="user-avatar"></image>
            </view>
            <view class="jyz_li_right">
              <view class="jyz_li_userAndtime">
                <view class="user-name">{{ item.data.nickname }}</view>
                <view class="date">{{ item.data.chat_time }}</view>
              </view>
              <view class="post-title">{{ item.data.title }}</view> <!-- 显示标题 -->

              <view class="jyz_li_images">
                <image v-for="(jitem, jindex) in item.data.user_chat_pho" :src="jitem" mode="aspectFill" :key="jindex" class="post-image"></image>
              </view>
              <view class="jyz_li_buts">
                <!-- 点赞按钮 -->
                <view class="jyz_li_buts_item" @click="likePost(item)">
                  <image :src="item.isLiked ? '../../static/heart-filled.png' : '../../static/heart.png'" class="jyz_li_buts_action-icon" />
                  <text class="jyz_li_action-text">{{ item.data.user_liked }}</text>
                </view>

                <!-- 收藏按钮 -->
                <view class="jyz_li_buts_item" @click="collectPost(item)">
                  <image :src="item.isCollected ? '../../static/star-filled.png' : '../../static/star.png'" class="jyz_li_buts_action-icon" />
                  <text class="jyz_li_action-text">{{ item.data.user_collected }}</text>
                </view>

                <!-- 评论按钮 -->
                <view class="jyz_li_buts_item">
                  <image src="../../static/chat.png" class="jyz_li_buts_action-icon" />
                  <text class="jyz_li_action-text">{{ item.data.user_comment }}</text>
                </view>
              </view>

              <view class="jyz_li_post">hot</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>


        <!-- 悬浮发布按钮 -->
        <view class="floating-button" @click="navigateToPublish">
          <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M14.5 6l3 3L8.4 18.6a0.8 0.8 0 01-.35.2l-3.2 0.8a0.8 0.8 0 01-.95-.95l0.8-3.2a0.8 0.8 0 01.2-.35L14.5 6zm1.2-1.2l1.2-1.2a0.8 0.8 0 011.1 0l1.5 1.5a0.8 0.8 0 010 1.1l-1.2 1.2-2.6-2.6z"
          fill="#D32F2F"
        />
      </svg>
    </view>
  </view>


</template>

<script>
export default {
  data() {
    return {
      jyzs: [],
      activeTab: '加油站', // 当前激活的标签
      currentUserId: '', // 动态获取的当前用户ID
      loadError: '' // 用于显示加载错误
    };
  },
  async onLoad() {
    console.log('onLoad 钩子被调用');
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

      // 调用云函数获取数据
      console.log('调用云函数 getPost_CARD...');
      const res = await uniCloud.callFunction({
        name: "getPost_CARD"
      });
      console.log('云函数返回:', res);
      // 调用云函数后，打印返回的完整结果
      console.log('云函数返回:', JSON.stringify(res));
      console.log('获取到的帖子数据:', res.result.data);

      if (res.result && res.result.success && res.result.data) {
        this.jyzs = res.result.data; // 设置帖子数据

        this.jyzs = res.result.data.map(item => ({
          ...item,
          isLiked: Array.isArray(item.data.liked_users)
            ? item.data.liked_users.includes(this.currentUserId)
            : false,
          isCollected: Array.isArray(item.data.collected_users)
            ? item.data.collected_users.includes(this.currentUserId)
            : false,
        }));
        console.log('帖子数据:', this.jyzs);
      } else if (res.result && res.result.error) {
        console.error('云函数错误:', res.result.error);
        this.loadError = res.result.error;
        throw new Error(res.result.error);
      } else {
        console.error('未返回有效的数据');
        this.loadError = '未返回有效的数据';
        throw new Error('未返回有效的数据');
      }
    } catch (error) {
      console.error('数据加载失败:', error);
      this.loadError = error.message || '数据加载失败';
      uni.showToast({
        title: '数据加载失败',
        icon: 'none'
      });
    }
  },
  async onShow() {
    // 每次页面显示时，重新获取帖子数据
    await this.fetchPosts();
  },

  methods: {

    navigateToPublish() {
      uni.navigateTo({
        url: '/pages/publish-post/publish-post'
      });
    },




    async fetchPosts() {
      try {
        const res = await uniCloud.callFunction({
          name: "getPost_CARD"
        });
        console.log('fetchPosts 云函数返回:', res);

        if (res.result && res.result.success && res.result.data) {
          this.jyzs = res.result.data; // 设置帖子数据

          this.jyzs = res.result.data.map(item => ({
            ...item,
            isLiked: Array.isArray(item.data.liked_users)
              ? item.data.liked_users.includes(this.currentUserId)
              : false,
            isCollected: Array.isArray(item.data.collected_users)
              ? item.data.collected_users.includes(this.currentUserId)
              : false,
          }));
        } else if (res.result && res.result.error) {
          this.loadError = res.result.error;
        } else {
          this.loadError = '未返回有效的数据';
        }
      } catch (error) {
        this.loadError = '数据加载失败';
      }
    },


        goToPostDetail(postId) {
      uni.navigateTo({
        url: `/pages/post-detail/post-detail?id=${postId}`
      });
    },
    navigateToActivityDetail() {
      uni.navigateTo({
        url: '/pages/activity-detail/activity-detail'
      });
    },

    // 点赞功能
// 点赞功能
async likePost(postId) {
    try {
      // 找到对应的帖子
      const post = this.jyzs.find(jyz => jyz._id === postId);
      if (!post) {
        throw new Error(`未找到 ID 为 ${postId} 的帖子`);
      }

      // 更新本地状态
      post.isLiked = !post.isLiked;
      post.likeCount += post.isLiked ? 1 : -1;
      if (post.isLiked) {
        post.data.liked_users.push(this.currentUserId);
        post.data.user_liked = 1;
      } else {
        post.data.liked_users = post.data.liked_users.filter(id => id !== this.currentUserId);
        post.data.user_liked = 0;
      }

      // 调用云函数更新服务器状态
      await uniCloud.callFunction({
        name: 'updateLike',
        data: {
          postId,
          userId: this.currentUserId,
          action: post.isLiked ? 'like' : 'unlike'
        }
      });

      // 显示提示
      uni.showToast({
        title: post.isLiked ? '点赞成功' : '取消点赞',
        icon: 'success'
      });
    } catch (error) {
      console.error('点赞操作失败', error);
      uni.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  async collectPost(postId) {
    try {
      // 找到对应的帖子
      const post = this.jyzs.find(jyz => jyz._id === postId);
      if (!post) {
        throw new Error(`未找到 ID 为 ${postId} 的帖子`);
      }

      // 更新本地状态
      post.isCollected = !post.isCollected;
      post.collectCount += post.isCollected ? 1 : -1;
      if (post.isCollected) {
        post.data.collected_users.push(this.currentUserId);
        post.data.user_collected = 1;
      } else {
        post.data.collected_users = post.data.collected_users.filter(id => id !== this.currentUserId);
        post.data.user_collected = 0;
      }

      // 调用云函数更新服务器状态
      await uniCloud.callFunction({
        name: 'updateCollect',
        data: {
          postId,
          userId: this.currentUserId,
          action: post.isCollected ? 'collect' : 'uncollect'
        }
      });

      // 显示提示
      uni.showToast({
        title: post.isCollected ? '收藏成功' : '取消收藏',
        icon: 'success'
      });
    } catch (error) {
      console.error('收藏操作失败', error);
      uni.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },
    // 设置激活的标签
    setActiveTab(tab) {
    if (tab === '加油站') {
      this.activeTab = tab;
      console.log('切换到标签:', tab);
    }
    if (tab === '求解答') {
      // 不修改 activeTab，直接跳转到 attention 页面
      uni.navigateTo({
        url: '/pages/qiujieda/qiujieda'
      });
    }
    if (tab === '关注') {
      // 不修改 activeTab，直接跳转到 attention 页面
      uni.navigateTo({
        url: '/pages/attention/attention'
      });
    }
  },

    // 统一跳转方法
    navigateTo(page) {
      console.log('跳转到页面:', page);
      const pageMap = {
        'attention': '/pages/attention/attention',
        'qiujieda': '/pages/qiujieda/qiujieda',
        'guanzhu': '/pages/guanzhu/guanzhu',
        'fensi': '/pages/fensi/fensi',
        'bianjiziliao': '/pages/bianjiziliao/bianjiziliao',
        'index': '/pages/index/index',
        'dakajilu': '/pages/dakajilu/dakajilu',
        'aihelper': '/pages/aihelper/aihelper', // 新增 aihelper 页面映射
        // 根据需要添加更多映射
      };
      const targetUrl = pageMap[page] || `/pages/${page}/${page}`;  // 如果没有在 pageMap 中找到，则默认跳转
      console.log('跳转到页面 URL:', targetUrl);
      uni.navigateTo({
        url: targetUrl
      });
    },

    toggleLike(post) {
      post.liked = !post.liked;
    },
    toggleStar(post) {
      post.starred = !post.starred;
    },
    answerQuestion(question) {
      // 回答问题的逻辑
    }
  },
  mounted() {
    // 监听来自其他页面的更新事件
    uni.$on('updatePost', (postId, updates) => {
      const post = this.jyzs.find(p => p._id === postId);
      if (post) {
        console.log(`接收到 updatePost 事件，postId: ${postId}, updates:`, updates);
        // 更新 liked_users 和 isLiked
        if (updates.liked_users !== undefined) {
          post.data.liked_users = updates.liked_users;
        }
        if (updates.isLiked !== undefined) {
          post.isLiked = updates.isLiked;
        }
        // 更新收藏相关字段
        if (updates.user_collected !== undefined) {
          post.data.user_collected = updates.user_collected;
        }
        if (updates.isCollected !== undefined) {
          post.isCollected = updates.isCollected;
        }
        console.log('更新后的帖子:', post);
      } else {
        console.warn(`未找到 ID 为 ${postId} 的帖子`);
      }
    });
  },
  beforeDestroy() {
    // 移除事件监听
    uni.$off('updatePost');
  },

};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #F8F8F8;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  background-color: white;
  align-items: center;
}
.post-title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  color: #333;
}
/* 其他样式保持不变 */
.title {
  font-size: 20px;
  font-weight: bold;
}
.search-icon {
  font-size: 13px;
  color: #666;
}
.tab-bar {
  display: flex;
  flex-direction: row;
  font-weight: bold;
  justify-content: space-around;
  background-color: #f8f8f8;
  padding: 10px 0;
  position: relative;
}
.tab-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tab {
  color: #666;
  font-size: 15px;
  position: relative;
}
.tab.active {
  color: red;
}
.underline {
  width: 100%;
  height: 2px;
  background-color: red;
  margin-top: 5px;
}
.error-message {
  color: red;
  text-align: center;
  margin: 10px 0;
}
.banner {
  background-color: #636363;
  padding: 40rpx 30rpx 20rpx 20rpx;
  color: white;
  background-image: url("../../static/activitybg.jpg");
  background-size: cover;
  cursor: pointer; /* 添加鼠标指针样式 */
}
.banner-title {
  font-size: 34rpx;
  font-weight: bold;
}
.banner-subtitle {
  margin-top: 45rpx;
}
.banner-bottom {
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
}
.banner-btn {
  font-size: 24rpx;
  background-color: #914235;
  padding: 12rpx;
  border-radius: 30rpx;
}
.jyz_li_box {
  padding: 20rpx;
}
.jyz_li {
  background-color: white;
  padding: 30rpx;
  display: flex;
  position: relative;
  margin-bottom: 20rpx;
}
.jyz_li_post {
  position: absolute;
  right: 0rpx;
  top: 0rpx;
  background-color: #D47970;
  color: white; 
  padding: 10rpx;
  border-top-right-radius: 20rpx;
  border-bottom-left-radius: 20rpx;
}
.jyz_li_left image {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}
.jyz_li_left {
  flex-shrink: 0;
}
.jyz_li_right {
  flex: 1;
  padding-left: 30rpx;
}
.jyz_li_userAndtime {
  display: flex;
}
.jyz_li_userAndtime > view:nth-child(1) {
  font-weight: bold;
  font-size: 30rpx;
}
.jyz_li_userAndtime > view:nth-child(2) {
  font-size: 28rpx;
  margin-left: 20rpx;
  color: #CFCFCF;
} 
.jyz_li_desc {
  margin-top: 30rpx;
  margin-bottom: 30rpx;
  font-size: 26rpx;
  color: #6B6B6A;
  padding-right: 10rpx;
}
.jyz_li_images {
  display: flex;
  flex-wrap: wrap;
}
.jyz_li_images image {
  width: 200rpx;
  height: 200rpx;
  margin-right: 12rpx;
  margin-bottom: 12rpx;
}
.jyz_li_buts {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
}
.jyz_li_buts image {
  width: 40rpx;
  height: 40rpx;
}
.jyz_li_buts_item {
  display: flex;
  align-items: center;
}
.jyz_li_action-text {
  margin-left: 10rpx;
  color: #5B6B73;
}
.post-image {
  width: 70px;
  height: 70px;
  margin-right: 5px;
  border-radius: 4px;
}



.floating-button {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 45px;
  height: 45px; /* 添加正确的高度值 */
  background-color: #f19d8c;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 1000;
}
.floating-button:hover {
  background-color: #e64a19;
}
.floating-icon {
  width: 30px;
  height: 30px;
}
</style>