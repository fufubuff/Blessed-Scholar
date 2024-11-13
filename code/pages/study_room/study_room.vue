<template>
  <div class="study-room">
    <!-- Header Image with Overlays -->
    <div class="header-image">
      <img :src="imageSrc" alt="Study Room" />
      <div class="overlay">
        <h1>{{ username }} 霸占了自习室封面</h1>
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
      username: 'hxy',
      numberOfPeople: 6,
      ranking: 3,
      timeSpentInSeconds: 0,  // 存储学习的秒数
      formattedTime: '0h 0min', // 存储显示的时间格式
      studyInProgress: false,  // 新增：判断学习是否进行
      leaderboard: [
        { name: 'hxy', avatar: '/static/hxy.jpg', timeSpent: 330 },
        { name: 'wq', avatar: '/static/wq.jpg', timeSpent: 255 },
        { name: 'mx', avatar: '/static/mx.jpg', timeSpent: 225 },
        { name: 'xh', avatar: '/static/xh.jpg', timeSpent: 150 },
        { name: 'cl', avatar: '/static/cl.jpg', timeSpent: 110 },
        { name: 'ly', avatar: '/static/ly.jpg', timeSpent: 60 },
      ],
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
    // 更新排行榜，基于用户学习时长排序
    updateLeaderboard() {
      this.leaderboard.sort((a, b) => b.timeSpent - a.timeSpent);
      this.ranking = this.leaderboard.findIndex(user => user.name === this.username) + 1;
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

    async fetchUserAvatar() {
      const userId = uni.getStorageSync('user_id');
      if (userId) {
        try {
          const res = await uniCloud.callFunction({
            name: 'getUserInfo',
            data: { userId: userId }
          });
    
          console.log('Cloud function response:', res);  // 打印返回数据，检查头像字段
          if (res.result && res.result.data.avatarUrl) {
            this.userAvatar = res.result.data.avatarUrl;  // 确保更新头像 URL
            console.log('Updated Avatar URL:', this.userAvatar);  // 打印更新后的头像 URL
          }
        } catch (error) {
          console.error('获取用户头像失败:', error);
        }
      }
    },
	// 在学习结束时调用云函数
	endStudy() {
	  uniCloud.callFunction({
	    name: 'endStudy',  // 云函数名
	    data: { userId: this.userId },  // 传递用户ID
	    success: (res) => {
	      if (res.result.success) {
	        // 处理学习结束后的逻辑，例如跳转到其他页面
	        uni.navigateTo({
	          url: '/pages/studyEnd/studyEnd'  // 跳转到学习结束页面
	        });
	      } else {
	        uni.showToast({
	          title: res.result.message,
	          icon: 'none'
	        });
	      }
	    },
	    fail: (err) => {
	      uni.showToast({
	        title: '云函数调用失败',
	        icon: 'none'
	      });
	      console.error('云函数调用失败:', err);
	    }
	  });
	}


  },
  mounted() {
    this.startTimer();  // 页面加载时启动计时器
    this.fetchUserAvatar(); // 获取头像
      this.$nextTick(() => {
        console.log('头像更新完成', this.userAvatar);  // 在头像更新后打印
      });
  },
  beforeDestroy() {
    this.stopTimer();  // 组件销毁时清除计时器
  }
}
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
