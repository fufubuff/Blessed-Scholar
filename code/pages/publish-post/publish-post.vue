<template>
  <div class="post-page">
    <!-- 顶部导航 -->
    <div class="header">
      <button class="back-button" @click="switchToJiayouzhan">X</button>
      <h2 class="title">发帖打气</h2>
      <button class="publish-button" @click="publishPost">发布</button>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 标题输入框 -->
      <input type="text" class="title-input" v-model="postTitle" placeholder="请输入标题" />

      <!-- 红色横线分隔 -->
      <div class="divider"></div>

      <!-- 内容输入框 -->
      <textarea class="text-input" v-model="postContent" placeholder="请输入内容"></textarea>

<!-- 图片预览区域 -->
<view class="image-preview">
  <image
    v-for="(img, index) in selectedImages"
    :key="index"
    :src="img"
    mode="aspectFill"
  />
</view>


      <!-- 添加图片区域 -->
      <div class="add-image" @click="addImage">
        <div class="add-image-box">
          <p>添加图片</p>
          <small>最多可添加3张图片</small>
          
        </div>
      </div>



      <!-- 添加话题区域 -->
      <div class="add-topic">
        <span class="topic-text">#添加话题</span>
      </div>
      <!-- 示例话题列表 -->
      <div class="topic-list">
        <span class="topic-item" @click="selectTopic('#21天高数打卡')">#21天高数打卡</span>
        <span class="topic-item" @click="selectTopic('#编程学习')">#编程学习</span>
        <span class="topic-item" @click="selectTopic('#每日健身')">#每日健身</span>
        <!-- 可根据需要添加更多示例话题 -->
      </div>

      <!-- 已添加的话题显示 -->
      <div class="selected-topics" v-if="selectedTopics.length">
        <span v-for="(topic, index) in selectedTopics" :key="index" class="selected-topic">
          {{ topic }}
          <i class="remove-icon" @click="removeTopic(index)">✕</i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      postTitle: '',
      postContent: '',
      selectedTopics: [], // 已选择的话题
      selectedImages: [], // 已选择的图片路径
      userInfo: null
      // 其他数据属性...
    };
  },





  onLoad() {
  const user = uni.getStorageSync('currentUser');
  if (user && user.user_id) {
    this.userInfo = user; // 赋值给 userInfo
    console.log('已获取用户信息:', this.userInfo);
  } else {
    // 未登录，跳转到登录页面或提示
    uni.showToast({ title: '请先登录', icon: 'none' });
    // 可选：自动跳转到登录页面
    // uni.navigateTo({ url: '/pages/login/login' });
    return;
  }
},
  




methods: {    
    switchToJiayouzhan() {
      uni.switchTab({
        url: '/pages/jiayouzhan/jiayouzhan'
      });
    },

    // 发布帖子方法
    async publishPost() {

      if (!this.userInfo) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }
      if (this.postTitle.trim() === '' || this.postContent.trim() === '') {
        uni.showToast({
          title: '标题和内容不能为空',
          icon: 'none',
        });
        return;
      }

      // 上传图片并获取URL
      let uploadedImageUrls = [];
      if (this.selectedImages.length > 0) {
        try {
          const uploadPromises = this.selectedImages.map((imagePath) => this.uploadImage(imagePath));
          uploadedImageUrls = await Promise.all(uploadPromises);
        } catch (uploadError) {
          console.error('图片上传失败:', uploadError);
          uni.showToast({
            title: '图片上传失败',
            icon: 'none',
          });
          return;
        }
      }

      const finalContent = this.postContent + ' ' + this.selectedTopics.join(' ');

      try {
                    const res = await uniCloud.callFunction({
              name: 'publishPost',
              data: {
                title: this.postTitle,
                content: finalContent, // 包含话题的内容
                images: uploadedImageUrls, // 上传后的图片URL数组
                user_id: this.userInfo.user_id // 传递 user_id
              },
              config: {
                env: 'env-00jxhjmdvord' // 替换为您的环境ID
              }
            });
        console.log('发布帖子响应:', res);

        if (res.result && res.result.success&& res.result.data) {
          uni.showToast({
            title: '发布成功',
            icon: 'success',
          });
          uni.redirectTo({
    url: `/pages/post-detail/post-detail?id=${res.result.data._id}`,
  });
        } else {
          uni.showToast({
            title: res.result.message || '发布失败',
            icon: 'none',
          });
        }
      } catch (error) {
        console.error('发布帖子失败:', error);
        uni.showToast({
          title: '发布失败',
          icon: 'none',
        });
      }
    },

    // 上传图片到云存储并返回URL
    async uploadImage(filePath) {
  try {
    const cloudPath = `post-images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;

    const uploadRes = await uniCloud.uploadFile({
      cloudPath,
      filePath,
    });

    const { fileList } = await uniCloud.getTempFileURL({
      fileList: [uploadRes.fileID],
    });

    return fileList[0].tempFileURL;
  } catch (error) {
    throw error;
  }
},

    // 选择图片方法
    addImage() {
    uni.chooseImage({
      count: 3, // 最多选择3张图片
      success: (res) => {
        this.selectedImages = this.selectedImages.concat(res.tempFilePaths);
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
      },
    });
  },

    // 添加话题方法
    addTopic() {
      uni.navigateTo({
        url: '/pages/add-topic/add-topic',
      });
    },

    // 选择话题
    selectTopic(topic) {
      if (!this.selectedTopics.includes(topic)) {
        this.selectedTopics.push(topic);
        this.postContent += ' ' + topic; // 将话题添加到内容中
        this.highlightTopics(); // 高亮显示话题
      }
    },

    // 移除话题
    removeTopic(index) {
      const removed = this.selectedTopics.splice(index, 1);
      // 从内容中移除话题
      this.postContent = this.postContent.replace(new RegExp(`\\s*${removed}`, 'g'), '');
    },

    highlightTopics() {
      // 这里可以实现高亮逻辑，如果使用富文本编辑器则更简单
      // 由于 textarea 不支持富文本，建议在预览或发布后处理高亮
    },
  },
};
</script>

<style scoped>
/* 页面整体样式 */
.post-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 顶部导航样式 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 子元素左右分布 */
  padding: 10px 16px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

/* 返回按钮样式 */
.back-button {
  font-size: 14px;
  cursor: pointer;
}

.back-button:hover {
  color: #ff5722;
}

/* 标题样式 */
.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  flex: 1;
  text-align: center;
}

/* 发布按钮样式 */
.publish-button {
  padding: 6px 16px;
  font-size: 12px;
  color: white;
  background-color: #ff5722;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.publish-button:hover {
  background-color: #e64a19;
}

/* 内容区域样式 */
.content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

/* 标题输入框样式 */
.title-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
}

.divider {
  height: 2px;
  background-color: red;
  margin: 0 0 10px 0; /* 上下间距 */
}

/* 文本输入框样式 */
.text-input {
  width: 100%;
  height: 150px;
  padding: 10px;
  font-size: 16px;
  resize: none;
  margin-bottom: 10px;
}

/* 添加图片区域样式 */
.add-image {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

.add-image-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-image-box p {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.add-image-box small {
  color: #999;
  font-size: 12px;
}

/* 添加话题样式 */
.add-topic {
  margin-bottom: 10px; /* 添加下边距以分隔文本和列表 */
}

.add-topic:hover {
  color: #ff5722;
}

.topic-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 0; /* 移除下边距 */
}

/* 示例话题列表 */
.topic-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.topic-item {
  background-color: #f0f0f0;
  color: #ff5722;
  padding: 5px 10px;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.topic-item:hover {
  background-color: #ff5722;
  color: #fff;
}

/* 已选择的话题显示 */
.selected-topics {
  margin-top: 20px;
}

.selected-topic {
  display: inline-flex;
  align-items: center;
  background-color: #ff5722;
  color: #fff;
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.remove-icon {
  margin-left: 5px;
  cursor: pointer;
  font-weight: bold;
}
</style>