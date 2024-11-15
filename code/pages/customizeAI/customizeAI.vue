<template>
  <view class="customize-ai">
    <view class="page-title">
      <text>定制您的 AI 考研助手</text>
    </view>
    
    <!-- 用户输入学习情况 -->
    <view class="input-group">
      <text class="label">请输入您的学习情况：</text>
      <textarea v-model="studySituation" placeholder="例如：擅长数学，但英语较弱"></textarea>
    </view>
    
    <!-- 用户输入薄弱点 -->
    <view class="input-group">
      <text class="label">请输入您的薄弱点：</text>
      <textarea v-model="weakness" placeholder="例如：英语听力、历史知识"></textarea>
    </view>
    <view class="input-group">
          <text class="label">请输入您的个性化性格定制：</text>
          <textarea v-model="aipersonality" placeholder="例如：喜欢逻辑思维、注重时间管理"></textarea>
    </view>
    <!-- 提交定制 -->
    <button @click="submitCustomization">提交定制</button>
  </view>
</template>


<script>
export default {
  data() {
    return {
      // 用户信息
      userId: '',
      userAvatarUrl: '/static/logo.jpg', // 默认头像

      // 用户输入的数据
      studySituation: '',
      weakness: '',
	   aipersonality: '',
      selectedDate: '',
    };
  },
  methods: {
    // 获取当前日期，格式为 YYYY-MM-DD
    getCurrentDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    // 获取用户ID并加载用户信息
    async getUserId() {
      // 尝试从本地存储获取 user_id
      const storedUserId = uni.getStorageSync('user_id');
      console.log('存储的 user_id:', storedUserId); // 调试日志

      if (storedUserId) {
        this.userId = storedUserId;
        this.selectedDate = this.getCurrentDate();

        try {
          const db = uniCloud.database();
          console.log('开始从数据库获取用户数据...');
          const res = await db.collection('users').doc(this.userId).get();
          console.log('获取用户数据结果:', res); // 调试日志

          if (res.result.data && res.result.data.length > 0) {
            // 用户存在，加载用户数据
            const userData = res.result.data[0];
            console.log('用户数据:', userData); // 调试日志
            this.userAvatarUrl = userData.avatarUrl || '/static/hxy.jpg';
            this.studySituation = userData.studySituation || '';
            this.weakness = userData.weakness || '';
			this.aipersonality = userData.aipersonality || '';
          } else {
            // 用户不存在，创建新用户文档
            console.warn('用户不存在，正在创建新用户文档');
            const createRes = await db.collection('users').doc(this.userId).set({
              avatarUrl: '/static/logo.jpg',
              studySituation: '',
              weakness: '',
              createdAt: db.command.serverDate(), // 正确使用服务器时间戳
              updatedAt: db.command.serverDate(), // 正确使用服务器时间戳
            });
            console.log('新用户文档已创建:', createRes); // 调试日志

            // 初始化用户数据
            this.userAvatarUrl = '/static/logo.jpg';
            this.studySituation = '';
            this.weakness = '';
			this.aipersonality = '';
          }
        } catch (err) {
          console.error('获取用户信息失败：', err);
          this.userAvatarUrl = '/static/logo.jpg'; // 设置默认头像
        }

        // 加载历史数据和进行自我介绍
        await this.loadHistory();
        await this.assistantIntroduce();
        return;
      }

      // 如果本地存储没有 user_id，提示登录
      console.error('获取用户ID失败: user_id 不存在');
      uni.showToast({
        title: '请先登录',
        icon: 'none',
      });
      // 跳转到登录页面
      uni.navigateTo({
        url: '/pages/login/login',
      });
    },

    // 提交学习状况和薄弱点
    async submitCustomization() {
      try {
        // 确保 userId 已经获取
        if (!this.userId) {
          await this.getUserId();
          if (!this.userId) {
            uni.showToast({
              title: '无法获取用户ID，请重试',
              icon: 'none',
            });
            return;
          }
        }

        // 准备要提交的数据
        const customizationData = {
          userid: this.userId,
          studySituation: this.studySituation,
          weakness: this.weakness,
		  aipersonality: this.aipersonality,
        };
        console.log('定制化数据:', customizationData); // 调试日志

        // 调用云函数
        const res = await uniCloud.callFunction({
          name: 'customizeAI',
          data: customizationData,
        });
        console.log('云函数返回结果:', res); // 调试日志

        if (res.result.success) {
          console.log('用户信息更新成功');
          uni.showToast({
            title: '定制成功',
            icon: 'success',
          });
          // 跳转回主页面
          uni.navigateBack();
        } else {
          throw new Error(res.result.message || '定制失败');
        }
      } catch (error) {
        console.error('定制失败：', error);
        uni.showToast({
          title: '定制失败，请稍后再试',
          icon: 'none',
        });
      }
    },

    // 加载历史数据（假设方法已定义）
    async loadHistory() {
      // 您的实现代码
    },

    // 助手进行自我介绍（假设方法已定义）
    async assistantIntroduce() {
      // 您的实现代码
    },
  },
  mounted() {
    this.getUserId();
  },
};
</script>




<style scoped>
.customize-ai {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
.input-group {
  margin-bottom: 25px;
}
.label {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}
textarea {
  width: 100%;
  height: 120px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  background-color: #fff;
}
textarea::placeholder {
  color: #999;
}
button {
  width: 100%;
  background-color: #007aff;
  color: white;
  padding: 14px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  margin-top: 30px;
  cursor: pointer;
}
button:hover {
  background-color: #005bb5;
}
</style>