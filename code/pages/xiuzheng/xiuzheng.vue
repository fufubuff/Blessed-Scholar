<template>
  <div class="splash-page">
    <!-- 顶部图标 -->
    <div class="logo-container">
      <img src="/static/logo.jpg" alt="Logo" class="logo" />
    </div>

    <!-- 标题和说明 -->
    <div class="text-container">
      <h1 class="title">福小研</h1>
      <p class="subtitle">is all you Need!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SplashPage',
};
</script>

<style scoped>
.splash-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #ffffff;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  width: 150px;
  height: 150px;
}

.text-container {
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #ff0000; /* 红色字体 */
  margin: 0;
  line-height: 1.2;
}

.subtitle {
  font-size: 20px;
  color: #ff0000; /* 红色字体 */
  margin: 10px 0 0;
  font-weight: bold;
}
</style>
