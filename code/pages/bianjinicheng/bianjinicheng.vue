<template>
  <view class="container">
    <view class="input-container">
      <input type="text" v-model="newNickname" placeholder="输入新昵称" @input="updateCount" />
      <text class="counter">{{ currentCount }}/24</text>
    </view>
    <view class="buttons">
      <button class="button" @click="updateNickname">
        <image src="/static/打勾.png" class="icon" />
      </button>
      <button class="button" @click="cancelUpdate">
        <image src="/static/打叉.png" class="icon" />
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      newNickname: '', // 输入的新昵称
      currentCount: 0, // 字符计数
      username: '' // 页面显示的用户名
    };
  },
  methods: {
    updateNickname() {
      uniCloud.callFunction({
        name: 'updateUserNickname',
        data: {
          account: this.account,
          newNickname: this.newNickname
        },
        success: (res) => {
          if (res.result.success) {
            uni.showToast({
              title: '昵称更新成功',
              icon: 'success'
            });
            
            // 更新本地存储
            const userInfo = uni.getStorageSync('userInfo') || {};
            userInfo.nickname = this.newNickname; // 更新昵称
            uni.setStorageSync('userInfo', userInfo);
    
            // 返回到 bianjiziliao 页面
            uni.navigateBack({
              delta: 1,
              complete: () => {
                // 直接在这里更新，避免事件未被捕获
                this.$emit('nicknameUpdated', this.newNickname); // 使用事件通信
              }
            });
          } else {
            uni.showToast({
              title: res.result.message || '昵称更新失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '昵称更新失败',
            icon: 'none'
          });
          console.error('Update failed:', err);
        }
      });
    },



    cancelUpdate() {
      this.newNickname = ''; // 清空输入框
      this.currentCount = 0; // 重置计数
      uni.showToast({
        title: '更新已取消',
        icon: 'none'
      });
    },
    updateCount() {
      this.currentCount = this.newNickname.length; // 更新字符计数
    }
  },
  mounted() {
    // 假设在mounted生命周期中获取当前username
    this.username = uni.getStorageSync('username') || '当前用户名'; // 从本地存储获取
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.input-container {
  display: flex;
  align-items: center;
  width: 90%;
  margin-bottom: 20px;
  background-color: white;
  border-radius: 20px;
  border: 1px solid #ccc;
}

input {
  flex-grow: 1;
  padding: 10px 40px 10px 10px;
  border: none;
  border-radius: 20px;
  background: none;
}

.counter {
  margin-right: 20px;
  color: black;
}

.buttons {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.button {
  padding: 10px;
  margin: 0 10px;
  border: none;
  outline: none;
}

.icon {
  width: 26px;
  height: 24px;
}
</style>
