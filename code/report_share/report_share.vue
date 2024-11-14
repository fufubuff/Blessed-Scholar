<template>
  <div class="report-share-container">
    <!-- 顶部按钮区 -->
    <div class="top-buttons">
      <button @click="cancel">取消</button>
      <button @click="submit">发布</button>
    </div>

    <!-- 标题输入 -->
    <div class="title-input">
      <input v-model="title" placeholder="输入标题...">
    </div>

    <!-- 内容输入 -->
    <div class="content-input">
      <textarea v-model="content" placeholder="开始编辑内容..."></textarea>
    </div>

    <!-- 图片上传区 -->
    <div class="image-upload">
      <div v-for="(image, index) in images" :key="index" class="uploaded-image">
        <img :src="image.url" :alt="'Uploaded image ' + index">
        <button @click="removeImage(index)">移除</button>
      </div>
      <button v-if="images.length < 3" @click="uploadImage">+ 添加图片</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      content: '',
      images: []
    };
  },
  methods: {
    cancel() {
      // 取消逻辑
    },
    submit() {
      // 提交逻辑
    },
    uploadImage() {
      // 实现上传图片逻辑
    },
    removeImage(index) {
      this.images.splice(index, 1);
    }
  }
}
</script>

<style scoped>
/* 样式代码 */
.report-share-container {
  display: flex;
  flex-direction: column;
}
.top-buttons {
  display: flex;
  justify-content: space-between;
}
.uploaded-image img {
  width: 100px; /* 可调整为适合的尺寸 */
}
</style>
