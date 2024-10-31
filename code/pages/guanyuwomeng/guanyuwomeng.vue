<template>
  <div class="about-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      
      <h1 class="title">关于我们</h1>
    </div>

    <!-- 中间的图标和信息 -->
    <div class="about-info">
      <img class="app-logo" :src="appLogo" alt="App Logo" />
      <div class="app-name">福小研</div>
      <div class="app-version">V1.145.14</div>
    </div>

    <!-- 信息列表 -->
    <div class="info-list">
      <div class="info-item" v-for="(item, index) in infoItems" :key="index">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
import appLogoPath from '/static/logo.jpg'; // 根据实际路径导入图标

export default {
  name: 'AboutUs',
  data() {
    return {
      appLogo: appLogoPath, // 确保这里和模板部分绑定的名称一致
      infoItems: [
        '生活不易',
        '为SE发电',
        '永爱小研',
        '研途无忧',
      ],
    };
  },
  methods: {
    goBack() {
      // 返回上一页
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.about-page {
  background-color: #f8f8f8;
  color: #333333;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.top-nav {
  display: flex;
  align-items: center;
  position: relative;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
}

.back-button {
  position: absolute;
  left: 0;
  padding: 0 15px;
  font-size: 24px;
  cursor: pointer;
}

.title {
  text-align: center;
  flex: 1;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.about-info {
  text-align: center;
  margin: 40px 0;
}

.app-logo {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.app-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.app-version {
  font-size: 16px;
  color: #999999;
}

.info-list {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px 20px;
}

.info-item {
  padding: 10px 0;
  font-size: 16px;
  color: #333333;
}

.info-item:last-child {
  border-bottom: none;
}
</style>
