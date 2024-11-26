<template>
  <div class="report-share-container">
    <!-- 顶部按钮区 -->
    <div class="header">
      <span @click="cancel" class="button-text">取消</span>
      <span class="share-title">打卡分享</span>
      <span @click="submit" class="button-text">发布</span>
    </div>

    <!-- 标题部分 -->
    <div class="title-input">
      <input v-model="title" placeholder="输入标题..." class="title-placeholder">
    </div>

    <!-- 分割线 -->
    <div class="divider"></div>

    <!-- 内容部分 -->
    <div class="content-input">
      <textarea v-model="content" placeholder="开始编辑内容..." class="content-textarea" maxlength="-1"></textarea>
    </div>

    <!-- 图片上传区 -->
    <div class="image-upload">
      <div v-for="(image, index) in images" :key="index" class="uploaded-image">
        <img :src="image.url" :alt="'Uploaded image ' + index" />
        <button @click="removeImage(index)" class="remove-button">&times;</button>
      </div>
      <div v-if="images.length < 3" class="upload-btn" @click="chooseImage">
        <img src="/static/addimg.png" alt="Add Image" class="upload-icon" />
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="upload-tips">
      <p class="max-images">最多上传三张图片哦><</p>
      <p class="share-success">分享成功 FUB+5</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      content: '',
      images: []  // 用于存储上传的图片信息
    };
  },
  methods: {
    // 取消发布，返回上一页或清空内容
    cancel() {
      uni.navigateBack();
    },

    // 选择图片
    chooseImage() {
      const maxCount = 3 - this.images.length;
      uni.chooseImage({
        count: maxCount,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          const tempFilePaths = res.tempFilePaths;
          for (let i = 0; i < tempFilePaths.length; i++) {
            const filePath = tempFilePaths[i];
            try {
              const cloudPath = `study_report/${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
              const uploadResult = await uniCloud.uploadFile({
                filePath: filePath,
                cloudPath: cloudPath,
              });
              console.log('上传成功：', uploadResult);

              const fileID = uploadResult.fileID;

              // 获取临时 URL
              const tempFileURLResult = await uniCloud.getTempFileURL({
                fileList: [fileID],
              });
              const tempFileURL = tempFileURLResult.fileList[0].tempFileURL;

              // 将图片信息添加到 images 数组
              this.images.push({
                url: tempFileURL,  // 用于显示图片
                fileID: fileID,    // 用于提交到数据库
              });
            } catch (error) {
              console.error('上传失败：', error);
              uni.showToast({
                title: '图片上传失败',
                icon: 'none',
              });
            }
          }
        },
        fail: (error) => {
          console.error('选择图片失败：', error);
        },
      });
    },

    // 移除图片
    removeImage(index) {
      this.images.splice(index, 1);
    },

    // 提交发布
    async submit() {
      if (!this.title.trim()) {
        uni.showToast({
          title: '标题不能为空',
          icon: 'none',
        });
        return;
      }
      if (!this.content.trim()) {
        uni.showToast({
          title: '内容不能为空',
          icon: 'none',
        });
        return;
      }

      // 获取当前用户的 user_id
      const userId = uni.getStorageSync('user_id');
      if (!userId) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        return;
      }

      // 获取今天的日期，格式为 'YYYY-MM-DD'
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      // 组装帖子数据
      const postData = {
        user_id: userId,
        title: this.title,
        content: this.content,
        images: this.images.map(image => image.fileID),  // 存储 fileID
        createTime: Date.now(), // 时间戳
        date: todayStr, // 添加日期字段
      };

      // 将帖子数据存储到数据库
      try {
        const res = await uniCloud.callFunction({
          name: 'addStudyReport',
          data: postData,
        });
        if (res.result && res.result.code === 0) {
          uni.showToast({
            title: '发布成功',
            icon: 'success',
          });
          // 发布成功后，可以清空表单或返回上一页
          this.title = '';
          this.content = '';
          this.images = [];
          uni.switchTab({
            url: '/pages/study_soul/study_soul'
          });
        } else {
          uni.showToast({
            title: res.result.msg || '发布失败',
            icon: 'none',
          });
        }
      } catch (error) {
        console.error('发布失败：', error);
        uni.showToast({
          title: '发布失败，请重试',
          icon: 'none',
        });
      }
    },
  },
};
</script>

<style scoped>
/* 样式部分 */
.report-share-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.share-title {
  font-size: 18px;
  font-weight: bold;
}

.button-text {
  color: #BD3124;
  font-weight: bold;
}

.title-input {
  margin-bottom: 10px;
}

.title-placeholder {
  font-size: 18px;
  font-weight: bold;
  padding: 5px;
  width: 100%;
  border: none;
  outline: none;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #ccc;
}

.content-input {
  margin-top: 10px;
}

.content-textarea {
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  min-height: 100px;
  resize: vertical; /* 允许垂直缩放 */
}

.image-upload {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.upload-tips {
  margin-top: 10px;
}

.max-images {
  color: #A9A9A9; /* 灰色 */
  font-size: 12px;
  margin: 0;
}

.share-success {
  color: #BD3124; /* 红色 */
  font-size: 12px;
  margin: 5px 0 0 0;
  font-weight: bold;
}

.uploaded-image {
  position: relative;
}

.uploaded-image img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.remove-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  line-height: 18px;
  text-align: center;
  cursor: pointer;
}

.upload-btn {
  width: 100px;
  height: 100px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.upload-icon {
  width: 40px;
  height: 40px;
}
</style>
