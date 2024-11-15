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
      <span v-if="title" class="title-text">{{ title }}</span>
      <input v-else v-model="title" placeholder="输入标题..." class="title-placeholder">
    </div>

    <!-- 分割线 -->
    <div class="divider"></div>

    <!-- 内容部分 -->
    <div class="content-input">
      <textarea v-model="content" placeholder="开始编辑内容..." class="content-textarea"></textarea>
    </div>

    <!-- 图片上传区 -->
    <div class="image-upload">
      <div v-for="(image, index) in images" :key="index" class="uploaded-image">
        <img :src="image.url" :alt="'Uploaded image ' + index" v-if="image.url" />
        <button @click="removeImage(index)">移除</button>
      </div>
      <label v-if="images.length < 3" class="upload-btn">
        <input type="file" accept="image/*" @change="chooseImage" />
        <img src="/static/addimg.png" alt="Add Image" class="upload-icon" />
      </label>
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
    cancel() {
      console.log("取消按钮被点击");
      this.$router.go(-1);  // 返回上一页
    },
    submit() {
      console.log("发布按钮被点击");
      this.uploadPost();  // 调用上传帖子函数
    },
    // 图片上传功能：选择文件并上传到云存储
    async chooseImage(event) {
      const file = event.target.files[0];  // 获取选中的文件
      if (file) {
        try {
          const filePath = file.path || file.webkitRelativePath || file.name;  // 获取文件路径
          if (!filePath) {
            throw new Error('未获取到文件路径');
          }
          
          const cloudPath = `study_images/${Date.now()}-${file.name}`;  // 创建云端文件路径

          // 上传文件到云存储
          const uploadRes = await uniCloud.uploadFile({
            cloudPath,
            filePath: file // 使用本地文件路径
          });

          if (!uploadRes.fileID) {
            throw new Error('文件上传失败，未获取到 fileID');
          }

          // 获取文件的临时 URL
          const fileUrlRes = await uniCloud.getTempFileURL({
            fileList: [uploadRes.fileID]
          });

          if (fileUrlRes.fileList.length > 0 && fileUrlRes.fileList[0].tempFileURL) {
            const imageUrl = fileUrlRes.fileList[0].tempFileURL;
            this.images.push({ url: imageUrl });  // 将云存储图片URL添加到 images 数组
            console.log('上传图片 URL:', imageUrl);
          } else {
            throw new Error('获取文件 URL 失败');
          }

        } catch (error) {
          uni.showToast({
            title: error.message || '上传失败，请重试',
            icon: 'none'
          });
        }
      }
    },

    // 移除上传的图片
    removeImage(index) {
      console.log("移除图片，索引：", index);
      this.images.splice(index, 1);  // 删除指定索引的图片
      console.log("当前图片数组：", this.images);
    },

    // 发布帖子
    uploadPost() {
      console.log("正在上传帖子...");
      // 这里只是模拟发布，实际发布内容可以通过 API 请求到服务器
      console.log({
        title: this.title,
        content: this.content,
        images: this.images.map(image => image.url)  // 将图片的 URL 传递给服务器
      });
      this.resetForm();  // 清空表单
    },

    // 重置表单
    resetForm() {
      this.title = '';
      this.content = '';
      this.images = [];
    }
  }
}
</script>

<style scoped>
/* 样式部分不变 */
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

.title-input {
  margin-bottom: 10px;
}

.title-placeholder {
  font-size: 18px;
  padding: 5px;
  width: 100%;
  border: none;
  outline: none;
}

.title-text {
  font-size: 18px;
  font-weight: bold;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
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
}

.image-upload {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;
}

.uploaded-image {
  position: relative;
  display: inline-block;
}

.uploaded-image img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 10px;
}

.uploaded-image button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: red;
  color: white;
  padding: 5px;
  border: none;
  border-radius: 5px;
}

.uploaded-image button:hover {
  cursor: pointer;
}

.upload-btn input {
  display: block;
  opacity: 0;  /* 隐藏input，但仍然可点击 */
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
}

.upload-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.upload-icon:hover {
  transform: scale(1.1);
}
</style>
