<template>
  <view class="container">
    <view class="header">
      <text>选择考研年份</text>
    </view>
    <picker mode="date" fields="year" start="2020" end="2030" @change="onYearChange">
      <view class="picker">
        <text>{{ selectedYear }} 年</text>
      </view>
    </picker>
    <button class="save-button" @click="saveYear">保存</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      account: '', // 确保有一个变量来存储账号信息
      selectedYear: new Date().getFullYear(), // 默认选中当前年份
      originalYear: '' // 存储用户原始年份
    }
  },
  mounted() {
    this.account = uni.getStorageSync('account'); // 从本地存储获取账号信息
    const userInfo = uni.getStorageSync('userInfo'); // 从本地存储获取用户信息
    if (userInfo && userInfo.year) {
      this.originalYear = userInfo.year; // 获取用户原始年份
      this.selectedYear = this.originalYear; // 设置选中的年份为原始年份
    }
  },
  methods: {
    onYearChange(event) {
      const value = event.detail.value; // 获取picker返回的值
      this.selectedYear = new Date(value).getFullYear(); // 更新选中的年份
    },
    async saveYear() {
      if (!this.account) {
        uni.showToast({
          title: '账号未提供',
          icon: 'none'
        });
        return;
      }

      // 调用云函数更新用户的年份
      try {
        const res = await uniCloud.callFunction({
          name: 'updateUserYear',
          data: {
            account: this.account, // 传递账号信息
            year: this.selectedYear.toString() // 将年份转换为字符串
          }
        });

        if (res.result.success) {
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          });
          // 更新本地存储中的用户信息
          const userInfo = uni.getStorageSync('userInfo') || {};
          userInfo.year = this.selectedYear.toString();
          uni.setStorageSync('userInfo', userInfo);
          
          // 延迟返回上一页面
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          uni.showToast({
            title: res.result.message,
            icon: 'none'
          });
        }
      } catch (err) {
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        });
        console.error('Save failed:', err);
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.picker {
  width: 300px;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.save-button {
  background-color: #c8284b;
  color: white;
  padding: 0px 30px;
  border-radius: 25px;
}
</style>
