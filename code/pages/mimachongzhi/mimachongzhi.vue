<template>
  <div class="account-security-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <h1 class="title">账号与安全</h1>
    </div>

    <!-- 密码设置区域 -->
    <div class="password-section">
      <div class="password-item">
        <label class="password-label">重置密码</label>
        <input type="password" v-model="newPassword" placeholder="输入新密码" class="password-input" />
      </div>
    </div>

    <!-- 确认修改按钮 -->
    <button @click="confirmChange" class="confirm-button">确认修改</button>
  </div>
</template>

<script>
export default {
  name: 'AccountSecurityPage',
  data() {
    return {
      newPassword: '',
    };
  },
  methods: {
    confirmChange() {
      if (!this.newPassword) {
        uni.showToast({
          title: '请输入新密码',
          icon: 'none',
        });
        return;
      }
      // 处理密码修改逻辑
      uniCloud.callFunction({
        name: 'resetPassword',
        data: {
          newPassword: this.newPassword,
        },
      }).then((res) => {
        if (res.result.success) {
          uni.showToast({
            title: '密码修改成功',
            icon: 'success',
          });
        } else {
          uni.showToast({
            title: '密码修改失败',
            icon: 'none',
          });
        }
      }).catch((error) => {
        console.error('修改密码失败:', error);
        uni.showToast({
          title: '密码修改失败',
          icon: 'none',
        });
      });
    },
  },
};
</script>

<style scoped>
.account-security-page {
  padding: 20px;
  background-color: #ffffff;
  color: #000000;
  font-family: Arial, sans-serif;
}

.top-nav {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.title {
  font-size: 18px;
  margin: 0;
}

.password-section {
  margin-top: 20px;
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 10px;
}

.password-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.password-label {
  font-size: 16px;
  color: #000;
}

.password-input {
  border: none;
  background-color: transparent;
  text-align: right;
  font-size: 16px;
  color: #b0b0b0;
}

.confirm-button {
  margin-top: 30px;
  padding: 12px;
  background-color: #f4c2c2;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
}

.confirm-button:focus {
  outline: none;
}
</style>
