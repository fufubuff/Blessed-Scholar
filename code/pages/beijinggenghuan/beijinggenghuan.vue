<template>
  <view class="container">
    <!-- 更换背景按钮 -->
    <button class="change-background-button" @click="chooseImage">
      <text class="button-text">更换背景</text>
      <image class="icon" src="/static/zhaopian.png" mode="aspectFit"></image>
    </button>

    <!-- 显示背景图片 -->
    <view class="background-container">
      <image class="background-image" :src="backgroundImage" mode="aspectFit"></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      backgroundImage: '/static/background.png' // 默认背景图片
    };
  },
  methods: {
    async chooseImage() {
      try {
        const { tempFilePaths } = await uni.chooseImage({
          count: 1, // 限制选择一张图片
          sourceType: ['album', 'camera'] // 可以选择相册或相机
        });
    
        if (!tempFilePaths.length) {
          throw new Error('未选择图片');
        }
    
        const filePath = tempFilePaths[0];
        const cloudPath = `backgrounds/${Date.now()}-${filePath.split('/').pop()}`;
    
        const uploadRes = await uniCloud.uploadFile({
          cloudPath,
          filePath
        });
    
        if (!uploadRes.fileID) {
          throw new Error('文件上传失败，未获取到 fileID');
        }
    
        // 将上传后的文件路径设置为新背景图
        this.backgroundImage = uploadRes.fileID;
        uni.setStorageSync('backgroundImage', uploadRes.fileID);

        uni.showToast({
          title: '背景更新成功',
          icon: 'success'
        });
      } catch (error) {
        uni.showToast({
          title: error.message || '上传失败，请重试',
          icon: 'none'
        });
      }
    }
  },
  mounted() {
    // 加载页面时从本地存储读取背景图片（如有保存）
    const storedBackground = uni.getStorageSync('backgroundImage');
    if (storedBackground) {
      this.backgroundImage = storedBackground;
    }
  }
};
</script>

<style>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: black;
}

.background-container {
  position: absolute;
  top: -100px;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.change-background-button {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 15px;
  cursor: pointer;
  width: 200px;
  height: 50px;
  margin-top: 190px;
}

.icon {
  width: 20px;
  height: 20px;
  margin-left: 75px;
}

.button-text {
  font-size: 16px;
  color: #000;
  font-weight: bold;
}
</style>
