<template>
  <view class="page">
    <!-- 顶部显示今日日期 -->
    <view class="date">- {{ currentDate }} -</view>

    <!-- 累计学习时长模块 -->
    <view class="module recent">
      <view class="module-title">记录发光的每一天💫</view>
      <view class="duration">
        <text class="label">今日学习</text>
        <!-- 今日学习时间显示 -->
        <view class="time">
          <span class="duration-number">{{ hours }}</span>
          <span class="unit">时</span>
          <span class="duration-number">{{ minutes }}</span>
          <span class="unit">分</span>
        </view>
      </view>
      <!-- 本周学习时间显示 -->
      <view class="duration">
        <text class="label">本周学习</text>
        <view class="time">
          <span class="duration-number">{{ weeklyHours }}</span>
          <span class="unit">时</span>
          <span class="duration-number">{{ weeklyMinutes }}</span>
          <span class="unit">分</span>
        </view>
      </view>

      <!-- 新增的表扬或鼓励内容 -->
      <view class="encouragement" v-if="hours >= 4">
        <view class="encouragement-text">
          <view class="large">今天学习很棒，继续保持！</view>
          <view class="small">你已经做得很好了，保持努力！</view>
        </view>
        <image class="encouragement-img" src="/static/hope.jpg" alt="celebrate" />
      </view>
      <view class="encouragement" v-else>
        <view class="encouragement-text">
          <view class="large">今天还可以多读一会儿哦！</view>
          <view class="small">多一点努力，进步会更快！</view>
        </view>
        <image class="encouragement-img" src="/static/workhard.jpg" alt="encourage" />
      </view>
    </view>

    <!-- 打卡分享按钮 -->
    <button class="share-btn" @click="openShareDialog">打卡分享</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date().toLocaleDateString().replace(/\//g, '.'), // 当前日期
      totalStudyDuration: 0, // 总学习时长初始化为0
      hours: 0, // 今日学习的小时
      minutes: 0, // 今日学习的分钟
      weeklyHours: 0, // 本周学习的小时
      weeklyMinutes: 0, // 本周学习的分钟
    };
  },
  onShow() {
    this.fetchTodayStudyDuration();
    this.fetchWeeklyStudyDuration();
  },
  methods: {
    fetchTodayStudyDuration() {
      // 假设云函数名称为 getStudyUsersForToday
      uniCloud.callFunction({
        name: 'getStudyUsersForToday',
        data: {
          today: new Date().toISOString().split('T')[0] // 发送今天的日期
        },
        success: (res) => {
          if (res.result && res.result.length > 0) {
            this.totalStudyDuration = res.result.reduce((total, user) => total + user.totalStudyDuration, 0);
            this.formatDuration(this.totalStudyDuration);
          } else {
            console.log('没有学习记录');
            uni.showToast({ title: '今天没有学习记录', icon: 'none' });
          }
        },
        fail: (err) => {
          console.error('获取学习时长失败:', err);
          uni.showToast({ title: '获取学习数据失败', icon: 'none' });
        }
      });
    },
    fetchWeeklyStudyDuration() {
      const userId = uni.getStorageSync('user_id');
      if (!userId) {
        uni.showToast({ title: '未登录或用户ID丢失', icon: 'none' });
        return;
      }

      const weekStart = this.getWeekStartDate();
      const weekEnd = this.getWeekEndDate();

      uniCloud.callFunction({
        name: 'getStudyDurationForWeek',
        data: {
          user_id: userId,
          weekStart: weekStart,
          weekEnd: weekEnd
        },
        success: (res) => {
          if (res.result && Array.isArray(res.result)) {
            const totalWeeklyDuration = res.result.reduce((total, user) => total + user.totalStudyDuration, 0);
            this.formatWeeklyDuration(totalWeeklyDuration);
          } else {
            console.log('本周没有学习记录');
            uni.showToast({ title: '本周没有学习记录', icon: 'none' });
          }
        },
        fail: (err) => {
          console.error('获取本周学习时长失败:', err);
          uni.showToast({ title: '获取本周学习数据失败', icon: 'none' });
        }
      });
    },
    formatDuration(seconds) {
      this.hours = Math.floor(seconds / 3600);
      this.minutes = Math.floor((seconds % 3600) / 60);
    },
    formatWeeklyDuration(seconds) {
      this.weeklyHours = Math.floor(seconds / 3600);
      this.weeklyMinutes = Math.floor((seconds % 3600) / 60);
    },
    getWeekStartDate() {
      const today = new Date();
      const day = today.getDay() || 7;
      const diff = today.getDate() - day + 1;
      today.setDate(diff);
      today.setHours(0, 0, 0, 0);
      return today.toISOString().split('T')[0];
    },
    getWeekEndDate() {
      const today = new Date();
      const day = today.getDay() || 7;
      const diff = today.getDate() - day + 7;
      today.setDate(diff);
      today.setHours(23, 59, 59, 999);
      return today.toISOString().split('T')[0];
    },
    openShareDialog() {
      console.log("尝试跳转到发布打卡分享页面");
      uni.navigateTo({
        url: '/pages/report_share/report_share',
        success: () => {
          console.log("成功跳转到打卡分享页面");
        },
        fail: (err) => {
          console.log("跳转失败:", err);
        }
      });
    },
  }
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: #f0f0f0; /* 浅灰色背景 */
  height: 100vh; /* 使用100%视窗高度 */
}

.date {
  margin-top: 10px;
  font-size: 18px; /* 设置字体大小为18px */
  color: #333; /* 设置字体颜色为深灰色 */
  font-family: 'Arial', sans-serif; /* 设置字体类型为Arial，若无该字体则使用无衬线字体 */
  text-align: center; /* 设置文本居中对齐 */
  font-weight: bold; /* 设置字体为粗体 */
}

.module {
  background-color: white;
  padding: 20px;
  width: 85%;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  flex: 1;
}

.module-title {
  font-weight: bold;
  margin-bottom: 18px;
  font-size: 20px;
}

.duration {
  display: flex;
  justify-content: space-between; /* 左右分布 */
  align-items: center; /* 垂直居中对齐 */
  margin: 10px;
  margin-top: 15px;
  font-size: 16px; /* 基础字体大小 */
}

.label {
  font-weight: bold; /* 今日学习标签样式 */
}

.time {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  gap: 4px; /* 设置时间元素间的间距 */
}

.duration-number {
  font-size: 26px; /* 动态数字部分字体大小 */
  font-weight: bold; /* 动态数字加粗 */
  color: #BD3124; /* 设置动态数字的颜色 */
}

.unit {
  font-size: 12px; /* 固定字体大小 */
  color: #b6b6b6; /* 设置“时”和“分”的字体颜色 */
  font-weight: normal; /* 设置单位字体正常 */
}

.encouragement-text {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中显示 large 和 small 文本 */
  text-align: center;
  margin-bottom: 30px;
}

.large {
  font-size: 18px;
  color: #BD3124;
  font-weight: bold;
  margin-bottom: 10px;
}

.small {
  font-size: 14px;
  color: #7f8c8d;
}

.encouragement-img {
  max-width: 100%;
  height: 200px;
  object-fit: cover; /* 保持图片比例 */
  border-radius: 8px;
  margin-top: 20px;
}

.share-btn {
  background-color: #BD3124;
  color: white;
  padding: 4px 50px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  border: none;
}

</style>
