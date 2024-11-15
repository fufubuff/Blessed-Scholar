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
        const userId = uni.getStorageSync('user_id');
        if (!userId) {
          // 如果没有 user_id，跳转到登录页面
          uni.navigateTo({
            url: '/pages/login/login' // 根据你的登录页面路径调整
          });
          return;
        }

        // 调用云函数 getUserInfo 获取用户信息
        const res = await uniCloud.callFunction({
          name: 'getUserInfo',
          data: { user_id: userId }
        });
		
		console.log('云函数返回的数据:', res); // 打印返回的数据
		

        if (res.success) {
          this.user = res.result.data;
		  console.log('User data updated:', this.user);  // 打印用户数据，确认数据是否更新
          
        } else {
          uni.showToast({ title: res.result.message, icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '获取用户信息失败', icon: 'none' });
		console.error(error); // 打印错误信息
      }
    },

    navigateToNicknameEdit() {
      console.log('Navigating to nickname edit page');
      uni.navigateTo({ url: '/pages/bianjinicheng/bianjinicheng' });
    },

    navigateToYearEdit() {
      uni.navigateTo({ url: '/pages/bianjinianfen/bianjinianfen' });
    },

    setGender(gender) {
      this.user.gender = gender; // 更新性别
    },

    async saveUserInfo() {
        try {
          const userId = uni.getStorageSync('user_id') // 获取用户唯一标识符
          if (!userId) {
            uni.showToast({ title: '用户未登录', icon: 'none' });
            return;
          }
    
          // 准备要更新的数据
                const updatedData = {
                  userId, 
                  avatarUrl: this.user.avatarUrl,
                  nickname: this.user.nickname,
                  gender: this.user.gender,
                  birthday: this.user.birthday,
                  school: this.user.school,
                  major: this.user.major,
                  year: this.user.year,
                  signature: this.user.signature
                };

    
          const res = await uniCloud.callFunction({
            name: 'updateUserInfo',
            data: updatedData  // 传递更新的数据
          });
    
          if (res.success) {
            uni.showToast({ title: '保存成功', icon: 'success' });
			
			// 保存成功后，返回上一页面
			uni.navigateBack();  // 这行代码将跳转回设置页面
          } else {
            uni.showToast({ title: res.msg, icon: 'none' });
          }
        } catch (error) {
          uni.showToast({ title: '保存失败', icon: 'none' });
		  console.error(error); // 打印错误信息
        }
      },

    updateNickname(newNickname) {
      this.user.nickname = newNickname; // 更新用户的昵称
    }
  },
  
  mounted() {
    this.fetchUserInfo(); // 获取用户信息
	
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
