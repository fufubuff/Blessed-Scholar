<template>
  <view class="container">
    <view class="settings-container">
      <view class="settings-section">
        <view class="settings-item">
          <text>修改头像</text>
          <image class="avatar" :src="user.avatarUrl"></image>
        </view>
        <view class="settings-item">
          <text>修改昵称</text>
          <text @click="navigateToNicknameEdit">{{ user.nickname }}</text>
        </view>
        <view class="settings-item">
          <text>设置性别</text>
          <view class="gender-selection">
            <text 
              class="gender-option" 
              :class="{ active: user.gender === '男' }" 
              @click="setGender('男')">男</text>
            <text 
              class="gender-option" 
              :class="{ active: user.gender === '女' }" 
              @click="setGender('女')">女</text>
            <text 
              class="gender-option" 
              :class="{ active: user.gender === '其他' }" 
              @click="setGender('其他')">其他</text>
          </view>
        </view>
        <view class="settings-item">
          <text>你的生日</text>
          <input v-model="user.birthday" class="input-field" />
        </view>
        <view class="settings-item">
          <text>报考院校</text>
          <input v-model="user.school" class="input-field" />
        </view>
        <view class="settings-item">
          <text>报考专业</text>
          <input v-model="user.major" class="input-field" />
        </view>
        <view class="settings-item">
          <text>考研年份</text>
          <text @click="navigateToYearEdit" class="year-text">{{ user.year }}</text>
        </view>
        <view class="settings-item">
          <text>个性签名</text>
          <input v-model="user.signature" class="input-field" />
        </view>
      </view>
    </view>
    <button class="submit-btn" @click="saveUserInfo">保存</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user: {
        avatarUrl: '',
        nickname: '',
        gender: '',
        birthday: '',
        school: '',
        major: '',
        year: '',
        signature: ''
      }
    };
  },
  methods: {
    async fetchUserInfo() {
      try {
        const account = uni.getStorageSync('account');
        if (!account) {
          uni.navigateTo({ url: '/pages/login/login' });
          return;
        }

        const res = await uniCloud.callFunction({
          name: 'getUserInfo',
          data: { account }
        });

        if (res.result.success) {
          this.user = res.result.data;
          // 更新本地存储
          uni.setStorageSync('userInfo', this.user);
        } else {
          const storedUserInfo = uni.getStorageSync('userInfo');
          if (storedUserInfo) {
            this.user = storedUserInfo;
          }
          uni.showToast({ title: res.result.message, icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '获取用户信息失败', icon: 'none' });
      }
    },

    navigateToNicknameEdit() {
      console.log('Navigating to nickname edit page');
      uni.navigateTo({ url: '/pages/bianjinicheng/bianjinicheng' });
      // 这里可以直接更新用户信息
      this.fetchUserInfo(); // 确保在页面返回时获取最新信息
    },

    navigateToYearEdit() {
      uni.navigateTo({ url: '/pages/bianjinianfen/bianjinianfen' });
    },

    setGender(gender) {
      this.user.gender = gender; // 更新性别
    },

    async saveUserInfo() {
      try {
        const res = await uniCloud.callFunction({
          name: 'updateUserInfo',
          data: this.user
        });

        if (res.result.success) {
          uni.showToast({ title: '保存成功', icon: 'success' });
          uni.setStorageSync('userInfo', this.user);
        } else {
          uni.showToast({ title: res.result.message, icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '保存失败', icon: 'none' });
      }
    },

    updateNickname(newNickname) {
      this.user.nickname = newNickname; // 更新用户的昵称
      uni.setStorageSync('userInfo', this.user); // 更新本地存储
    }
  },
  
  mounted() {
    this.fetchUserInfo(); // 获取用户信息
	this.$on('yearUpdated', (newYear) => {
	    this.user.year = newYear; // 更新用户的年份
	    uni.setStorageSync('userInfo', this.user); // 更新本地存储
	});
    uni.$on('nicknameUpdated', (newNickname) => {
        this.user.nickname = newNickname; // 更新用户的昵称
        uni.setStorageSync('userInfo', this.user); // 更新本地存储
        console.log('Nickname updated:', newNickname); // 调试信息
      });
  }

}
</script>


<style>
.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.settings-container {
  background-color: #fff;
  border-radius: 25px;
  padding: 20px;
  margin-bottom: 50px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eaeaea;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}

.input-field {
  text-align: right;
  width: 60%;
  border: none;
  outline: none;
  color: #333;
}

.gender-selection {
  display: flex;
}

.gender-option {
  margin-right: 10px;
  cursor: pointer;
}

.gender-option.active {
  font-weight: bold; /* 选中状态加粗 */
  color: #cf382d; /* 选中状态的颜色 */
}

.submit-btn {
  background-color: #cf382d;
  color: white;
  border-radius: 30px;
  width: 80%;
  align-self: center;
}
</style>
