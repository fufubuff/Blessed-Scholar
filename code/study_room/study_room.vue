<template>
  <div class="study-room">
    <!-- Header Image with Overlays -->
    <div class="header-image">
      <img :src="imageSrc" alt="Study Room" />
      <div class="overlay">
        <h1 v-if="ranking === 1">{{ nickname + ' 霸占了自习室封面' }}</h1>
        <div class="stats">
          <p><span>{{ numberOfPeople }}</span> 人正在专注中</p>
          <p><span>{{ ranking }}</span> 您当前的排名 </p>
        </div>
      </div>
    </div>

    <!-- Information Box Below Image -->
    <div class="info-box">
      <img src="/static/infotag.png" alt="Icon" class="info-icon" />
      <div class="user-info">
        <img :src="userAvatar" alt="User Avatar" />
        <span>我</span>
      </div>
      <div class="time-spent">
        <span>{{ formattedTime }}</span>
      </div>
    </div>

    <!-- Leaderboard Section with Scroll -->
    <div class="leaderboard">
      <div class="leaderboard-item" v-for="(user, index) in leaderboard" :key="index">
        <div :class="['rank-circle', { 'top-three': index < 3 }]" :style="getCircleStyle(index)">
          <span>{{ index + 1 }}</span> <!-- 显示排名数字 -->
        </div>
        <div class="info-box">
          <div class="user-info">
            <img :src="user.avatar" alt="User Avatar" />
            <span>{{ user.name }}</span>
          </div>
          <div class="time-spent">
            <span>{{ formatTime(user.timeSpent) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating End Study Button -->
    <button class="end-study-btn" @click="endStudy">学习结束</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageSrc: '/static/bghxy.jpg',
      userAvatar: '', // 初始的默认头像
      nickname: '',
      numberOfPeople: 0, // 初始值待动态设置
      ranking: 0, // 当前排名
      timeSpentInSeconds: 0,  // 存储学习的秒数
      formattedTime: '0h 0min', // 存储显示的时间格式
      studyInProgress: false,  // 判断学习是否进行
      leaderboard: [],  // 用来存储当天的排行榜数据
      timer: null,  // 计时器
    };
  },
  methods: {
    // 启动计时器
    startTimer() {
      this.studyInProgress = true;
      this.timer = setInterval(() => {
        this.timeSpentInSeconds += 1;  // 每秒增加1秒
        this.formattedTime = this.formatTime(this.timeSpentInSeconds); // 更新显示的时间格式
        this.updateLeaderboard();  // 更新排行榜
      }, 1000);
    },
    // 停止计时器
    stopTimer() {
      clearInterval(this.timer);
      this.studyInProgress = false;
    },
    // 格式化时间（秒转为 h min 格式）
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}min`;
    },

    // 获取圆形背景样式
    getCircleStyle(index) {
      if (index === 0) {
        return {
          background: '#BD3124', // 第一名红色渐变
          color: 'white',
        };
      } else if (index === 1) {
        return {
          background: '#bd5c4f', // 第二名渐变
          color: 'white',
        };
      } else if (index === 2) {
        return {
          background: '#f0b7b5', // 第三名渐变
          color: 'white',
        };
      } else {
        return {
          backgroundColor: '#BDC3C7', // 非前三名为灰色背景
          color: 'black', // 黑色字体
        };
      }
    },

    // 获取用户头像
    async fetchUserAvatar() {
      const userId = uni.getStorageSync('user_id');
      if (userId) {
        try {
          const res = await uniCloud.callFunction({
            name: 'getUserInfo',
            data: { userId: userId }
          });
    
          if (res.result && res.result.data && res.result.data.avatarUrl) {
            this.userAvatar = res.result.data.avatarUrl;
          } else {
            this.userAvatar = '/static/default-avatar.jpg';  // 使用默认头像
          }
        } catch (error) {
          console.error('获取用户头像失败:', error);
          this.userAvatar = '/static/default-avatar.jpg';
        }
      } else {
        this.userAvatar = '/static/default-avatar.jpg';
      }
    },

    async fetchLeaderboard() {
      const today = new Date().toISOString().split('T')[0]; // 获取今天的日期（yyyy-MM-dd 格式）
      
      try {
        const res = await uniCloud.callFunction({
          name: 'getStudyUsersForToday',
          data: { today: today }
        });

        console.log('云函数返回的数据:', res); 

        if (res && res.result && Array.isArray(res.result) && res.result.length > 0) {
          this.leaderboard = res.result.map(item => ({
            name: item.nickname,  
            avatar: item.avatarUrl, 
            timeSpent: item.totalStudyDuration, 
          }));

          this.updateLeaderboard();  // 确保数据加载后再更新排行榜
        } else {
          console.error('返回数据格式错误或没有数据:', res);
          uni.showToast({
            title: '未能获取排行榜数据，请稍后再试',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取排行榜数据失败:', error); 
        uni.showToast({
          title: '获取排行榜数据失败，请检查网络或稍后再试',
          icon: 'none'
        });
      }
    },

    updateLeaderboard() {
      if (this.leaderboard.length > 0) {
        // 排行榜按照学习时长排序
        this.leaderboard.sort((a, b) => b.timeSpent - a.timeSpent);
    
        // 查找当前用户的排名
        const userRank = this.leaderboard.findIndex(user => user.avatar === this.userAvatar);  // 使用 avatar 或 user_id 来定位当前用户
    
        // 更新当前排名
        this.ranking = userRank !== -1 ? userRank + 1 : this.ranking;
    
        // 如果是第一名，更新昵称为第一名的昵称
        if (this.ranking === 1) {
          this.nickname = this.leaderboard[0].name;  // 获取排行榜第一名的昵称
        }
    
        // 更新正在专注的人数
        this.numberOfPeople = this.leaderboard.length;
      }
    },


    // 学习结束
    endStudy() {
      const randomId = uni.getStorageSync('randomId');
      const userId = uni.getStorageSync('user_id');
    
      if (!userId || !randomId) {
        uni.showToast({ title: '缺少用户ID或记录ID', icon: 'none' });
        return;
      }
    
      uniCloud.callFunction({
        name: 'endStudy',
        data: { userId: userId, randomId: randomId },
        success: (res) => {
          if (res.result.success) {
            uni.navigateTo({ url: '/pages/study_report/study_report' });
          } else {
            uni.showToast({ title: res.result.message, icon: 'none' });
          }
        },
        fail: (err) => {
          uni.showToast({ title: '云函数调用失败', icon: 'none' });
        }
      });
    }
  },
  mounted() {
    this.startTimer();  // 页面加载时启动计时器
    this.fetchUserAvatar(); // 获取头像
    this.fetchLeaderboard();  // 获取当天的排行榜数据
  },
  beforeDestroy() {
    this.stopTimer();  // 组件销毁时清除计时器
    this.timeSpentInSeconds = 0;  // 清空学习时长
    this.formattedTime = '0h 0min';  // 重置时间显示
  },
  watch: {
    // 监听页面离开，退出计时
    '$route': function() {
      if (this.studyInProgress) {
        this.stopTimer(); // 页面切换时停止计时
      }
    }
  }
};
</script>



<style scoped>
.study-room {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.header-image {
  position: relative;
  width: 100%;
  height: 250px;
}

.header-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
}

.overlay h1 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #ffffff;
}

.stats {
  font-size: 14px;
}

.stats p {
  font-size: 15px;
  font-style: italic;
  color: #BD3124;
  margin: 0;
}

.stats p span {
  font-size: 20px;
  font-weight: bold;
}

.leaderboard {
  width: 100%;
  max-height: 270px;
  overflow-y: auto;
  margin-top: 20px;
}

.leaderboard-item {
  position: relative;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.rank-circle {
  position: absolute;
  top: -35px;
  right: -35px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  transform: rotate(45deg);
  clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
}

.rank-circle span {
  position: absolute;
  bottom: 1px;
  left: 28px;
  transform: rotate(-45deg);
  margin: 5px;
}

.rank-circle.top-three {
  background: #BD3124;
  color: white;
}

.info-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.user-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.info-icon {
  position: absolute;
  top: 40%;
  right: 10%;
  width: 20px;
  height: 20px;
}

.time-spent {
  font-size: 20px;
  font-weight: bold;
}

/*悬浮按钮样式*/
.end-study-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 55px;
  background-color: #BD3124;
  opacity: 0.7; /* 整个按钮的透明度 */
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.end-study-btn:hover {
  background-color: #f0b7b5;
  opacity: 0.7; /* 整个按钮的透明度 */
}
</style>
