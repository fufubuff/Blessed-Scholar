<template>
  <view class="container">
    <!-- 更换背景按钮 -->
    <button class="change-background-button" @click="chooseImage">
      <text class="button-text">更换背景</text>
      <image class="icon" src="/static/zhaopian.png" mode="aspectFit"></image>
    </button>

    <!-- 显示背景图片 -->
    <view class="background-container" v-if="backgroundImage">
      <image
        class="background-image"
        :src="backgroundImage"
        mode="aspectFit"
        @error="onImageError"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      backgroundImage: '', // 初始为空，默认没有背景
      userId: '', // 当前用户的 user_id
    };
  },
  methods: {
    // 上传图片并更新背景
    async chooseImage() {
      try {
        // 用户选择图片
        const { tempFilePaths } = await uni.chooseImage({
          count: 1,
          sourceType: ['album', 'camera'],
        });

        if (!tempFilePaths.length) {
          throw new Error('未选择图片');
        }

        const filePath = tempFilePaths[0];
        const cloudPath = `backgrounds/${Date.now()}-${filePath.split('/').pop()}`;

        // 上传图片到 UniCloud
        const uploadRes = await uniCloud.uploadFile({
          cloudPath,
          filePath,
        });

        if (!uploadRes.fileID) {
          throw new Error('文件上传失败');
        }

        console.log('上传成功，文件 ID:', uploadRes.fileID);

        // 将 cloud:// 路径转换为 HTTPS URL
        const { fileList } = await uniCloud.getTempFileURL({
          fileList: [uploadRes.fileID],
        });

        if (fileList && fileList[0] && fileList[0].tempFileURL) {
          const tempFileURL = fileList[0].tempFileURL;
          this.backgroundImage = tempFileURL; // 更新页面背景图
          console.log('新背景图片 URL:', this.backgroundImage);

          // 存储到数据库
          await this.updateBackgroundInDatabase(tempFileURL);

          uni.showToast({
            title: '背景更新成功',
            icon: 'success',
          });
        } else {
          throw new Error('获取图片临时链接失败');
        }
      } catch (error) {
        console.error('选择或上传图片失败:', error);
        uni.showToast({
          title: error.message || '上传失败，请重试',
          icon: 'none',
        });
      }
    },

    // 调用云函数更新背景图路径
    async updateBackgroundInDatabase(tempFileURL) {
      try {
        const userId = this.userId || uni.getStorageSync('user_id');
        if (!userId) {
          throw new Error('用户未登录，请重新登录');
        }

        const res = await uniCloud.callFunction({
          name: 'updateBackgroundUrl', // 云函数名
          data: {
            user_id: userId,
            backgroundUrl: tempFileURL,
          },
        });

        if (res.result && res.result.success) {
          console.log('数据库更新成功');
        } else {
          console.error('数据库更新失败:', res.result);
          throw new Error(res.result.message || '更新背景失败');
        }
      } catch (error) {
        console.error('更新背景图到数据库失败:', error);
        uni.showToast({
          title: '数据库更新失败',
          icon: 'none',
        });
      }
    },

    // 页面加载时从数据库读取背景图片
    async loadBackgroundImage() {
      try {
        const userId = uni.getStorageSync('user_id');
        if (!userId) {
          throw new Error('用户未登录');
        }

        this.userId = userId;

        const res = await uniCloud.callFunction({
          name: 'getUserInfo', // 获取用户信息的云函数
          data: { user_id: userId },
        });

        if (res.result && res.result.data && res.result.data.backgroundUrl) {
          this.backgroundImage = res.result.data.backgroundUrl; // 设置背景图片
          console.log('加载到的背景图片 URL:', this.backgroundImage);
        } else {
          console.log('未找到背景图片');
          this.backgroundImage = ''; // 如果没有背景图片，保持为空
        }
      } catch (error) {
        console.error('加载背景图片失败:', error);
        this.backgroundImage = ''; // 出错时保持为空
      }
    },

    onImageError(event) {
      console.error('背景图片加载失败:', event);
      uni.showToast({
        title: '图片加载失败',
        icon: 'none',
      });
    },
  },
  mounted() {
    // 页面加载时从数据库读取背景图片
    this.loadBackgroundImage();
  },
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
  z-index: 100;
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
