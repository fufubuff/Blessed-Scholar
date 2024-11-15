<template>
  <div class="settings-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <!-- 保持标题居中 -->
      <h1 class="title">设置</h1>
    </div>

    <!-- 设置选项列表 -->
    <ul class="settings-list">
      <li class="settings-item" @click="openProfile">
        <span>个人资料</span>
        <span class="arrow">></span>
      </li>
      <li class="settings-item" @click="openAccountSecurity">
        <span>账号与安全</span>
        <span class="arrow">></span>
      </li>
      <li class="settings-item" @click="openNotifications">
        <span>消息与提醒</span>
        <span class="arrow">></span>
      </li>

      <!-- 在此处增加间距 -->
      <li class="settings-separator"></li>

      <!-- 护眼模式（使用开关组件） -->
      <li class="settings-item">
        <span>护眼模式</span>
        <view class="switchBox">
          <!-- 开关组件 -->
          <switch @change="switchChange" color="#af2a0f" :checked="eyeProtectionEnabled" />
        </view>
      </li>

      <!-- 在此处增加间距 -->
      <li class="settings-separator"></li>

      <li class="settings-item" @click="openAbout">
        <span>关于福小研</span>
        <span class="arrow">></span>
      </li>
    </ul>

    <!-- 底部按钮 -->
    <button class="rest-button" @click="takeABreak">休整片刻</button>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage',
  data() {
    return {
      eyeProtectionEnabled: false, // 护眼模式的初始状态设置为 false
    };
  },
  methods: {
    openProfile() {
      // 打开个人资料页面
      this.$router.push({ path: '/pages/bianjiziliao/bianjiziliao' });
    },
    openAccountSecurity() {
      // 打开账号与安全页面
      this.$router.push({ path: '/pages/mimachongzhi/mimachongzhi' });
    },
    openNotifications() {
      // 打开消息与提醒页面
      this.$router.push({ path: '/pages/xiaoxiyutixing/xiaoxiyutixing' });
    },
    openAbout() {
      // 打开关于福小研页面
      this.$router.push({ path: '/pages/guanyuwomeng/guanyuwomeng' });
    },
    takeABreak() {
      // 执行休整片刻的操作并跳转到休整页面
      this.$router.push({ path: '/pages/xiuzheng/xiuzheng' });
    },
    switchChange(e) {
      console.log(e, e.detail.value, '85'); // 打印事件对象和状态值

      // 更新 eyeProtectionEnabled 的状态
      this.eyeProtectionEnabled = e.detail.value;
      console.log('护眼模式:', this.eyeProtectionEnabled ? '开启' : '关闭');
    },
  },
};
</script>

<style scoped>
.settings-page {
  background-color: #ffffff;
  color: #000000;
  padding: 20px;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-nav {
  display: flex;
  justify-content: center; /* 标题居中 */
  margin-bottom: 10px;
}

.title {
  font-size: 18px;
  margin: 0;
}

.settings-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1; /* 占据剩余空间 */
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0; /* 边框颜色更淡，接近图片中的样式 */
}

.settings-separator {
  height: 15px; /* 调整间距大小 */
  background-color: #f8f8f8; /* 浅灰色背景，模仿间隔效果 */
}

.arrow {
  font-size: 18px;
  color: #bfbfbf; /* 箭头颜色为灰色 */
}

.switchBox {
  /* 调整大小 */
  transform: scale(0.8, 0.8);
}

.rest-button {
  background-color: #af2a0f; /* 淡粉红色 */
  color: #ffffff;
  border: none;
  padding: 12px 0;
  width: 100%;
  border-radius: 30px; /* 更圆润的边角 */
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
}

.rest-button:focus {
  outline: none;
}

.rest-button:hover {
  background-color: #af2a0f; /* 略深的粉红色 */
}
</style>
