<template>
  <div id="study-soul" :style="backgroundStyle">
    <div class="image-overlay">
      <div class="overlay"></div>
      <img :src="imagePreview" alt="Preview Image" class="preview-image" />
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>编辑个性签名</h2>
        <input type="text" v-model="tempSignature" placeholder="输入新的个性签名">
        <div class="modal-buttons">
          <span @click="updateSignature" class="text-button update">更新</span>
          <span @click="closeModal" class="text-button cancel">取消</span>
        </div>
      </div>
    </div>

    <div class="content-overlay">
      <div class="header">
        <div class="days">{{ countdown }}天</div>
        <div class="countdown">2025考研倒计时</div>
        <div @click="editSignature" class="signature">{{ signature }}</div>
        <button class="punch-button" @click="punch">{{ punchButtonText }}</button>
      </div>

      <div class="calendar">
        <!-- 一周日历部分 -->
		<div class='weekCalendar'>
        <div class="week-days">
          <div v-for="day in weekDays" :key="day" class="day-of-week">{{ day }}</div>
        </div>
        <div class="dates">
          <div v-for="(day, index) in lastSevenDays" :key="day.date" :class="['date', { 'today': day.isToday }]">
            <div v-if="day.isToday" class="today-marker"></div>
            {{ day.date }}
          </div>
        </div>
		</div>

        <!-- 点击打卡后显示整月日历 -->
        <div v-if="showFullCalendar" class="full-calendar">
          <div class="calendar-header">
            <span>{{ new Date().getFullYear() }}-{{ (new Date().getMonth() + 1).toString().padStart(2, '0') }}</span>
          </div>



          <div v-for="(week, weekIndex) in monthDays" :key="weekIndex" class="week">
            <div v-for="(day, dayIndex) in week" :key="dayIndex" :class="['date', { 
              'today': day.isToday, 
              'current-month': day.isCurrentMonth, 
              'next-month': day.isNextMonth 
            }]">
              {{ day.date }}
            </div>
          </div>
        </div>
		
		

      </div>
    </div>
	<!-- 学情分析模块 -->
	<div class="study-analysis">
	  <div class="analysis-top">
	    <div class="analysis-header">
	      <img src="/static/analysis.png" alt="Analysis Icon" class="analysis-icon"/>
	      <span>学情分析</span>
	    </div>
	    <div class="analysis-link">
	      <img src="/static/skip.png" alt="Link Icon" class="link-icon" @click="goToAnalysisPage"/>
	    </div>
	  </div>
	  <hr class="divider"/>
	  <div class="analysis-content">
	    <p>{{ analysisContent }}</p> <!-- 默认内容 -->
	  </div>
	</div>

	
	<!-- 自习室模块 -->
	<div class="study-room">
	  <div class="room-top">
	    <div class="room-header">
	      <img src="/static/study.png" alt="Study Icon" class="study-icon"/>
	      <span>自习室</span>
	    </div>
	    <div class="room-link">
	      <img src="/static/skip.png" alt="Link Icon" class="link-icon" @click="startStudy"/>
	    </div>
	  </div>
	  <hr class="divider"/>
	  <div class="room-content">
	    <div class="content-icon">
	      <img :src="iconSrc" alt="Icon" class="room-icon"/>
	    </div>
	    <div class="content-texts">
	      <p class="content-title">{{ roomFirstTitle }}</p> <!-- 第一行大字 -->
	      <p class="content-subtitle">{{ roomSubtitle }}</p> <!-- 第二行小字 -->
	    </div>
	  </div>
	</div>

	
	<!-- 我的任务模块 --> 
	<div class="my-tasks">
	  <div class="tasks-top">
	    <div class="tasks-header">
	      <img src="/static/task.png" alt="Task Icon" class="task-icon"/>
	      <span>我的任务</span>
	    </div>
	    <div class="tasks-link">
	      <view href="#" class="task-link" @click="goToTaskPage()">添加</view> <!-- 文字链接代替图标 -->
	    </div>
	  </div>
	  <hr class="divider"/>
	  <div class="tasks-content">
	    <div v-for="(task, index) in tasks" :key="index" class="task-item">
	      <div :class="{'task-completed': task.completed}" @click="toggleTaskCompletion(index)">
	        <span class="task-name">{{ task.name }}</span>
	        <p class="task-remarks">{{ task.remarks }}</p>
	      </div>
	    </div>
	  </div>
	</div>



  </div>
</template>

<script>
export default {
  name: 'StudySoul',
  data() {
    return {
      examDate: new Date('2024-12-21T00:00:00'),
      countdown: null,
      imagePreview: '/static/鸡汤1.jpg',
      signature: 'call of silence yyds..(自定义签名)',
      showModal: false,
      tempSignature: '',
      todayDate: '',
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],  // 一周日历英文
      monthWeekDays: ['日', '一', '二', '三', '四', '五', '六'],  // 整月日历中文
      lastSevenDays: [],
      showFullCalendar: false,
      punchButtonText: '打卡',
      monthDays: [],
	  
	  analysisContent: "今日的学情分析还没更新哦！", // 默认的学情分析内容
	  
	  roomFirstTitle: "你今天还没进入自习室学习哦", // 初始大字
	  roomSubtitle: "不要让自己的梦想偷偷溜走...", // 初始小字
	  iconSrc: '/static/attention.png', // 初始图标

	  
    };
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: 'url(' + this.imagePreview + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      };
    }
  },
  created() {
    this.calculateCountdown();
    this.updateCalendar();
    setInterval(this.calculateCountdown, 1000);
	this.fetchStudyAnalysis();  // 获取并更新学情分析内容
	this.getTodayDate();  // 获取当前日期
	this.fetchTasksForToday();  // 获取今天的任务
  },
  methods: {
    updateCalendar() {
      const today = new Date();
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay());

      this.lastSevenDays = Array.from({ length: 7 }).map((_, index) => {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + index);
        return {
          dayOfWeek: this.weekDays[date.getDay()],
          date: date.getDate().toString().padStart(2, '0'),
          isToday: date.toDateString() === today.toDateString(),
        };
      });

      this.todayDate = today.toISOString().split('T')[0];
      this.generateMonthCalendar();
    },
    calculateCountdown() {
      const now = new Date();
      const difference = this.examDate - now;
      this.countdown = Math.floor(difference / (1000 * 60 * 60 * 24));
    },
    punch() {
      if (!this.showFullCalendar) {
        this.showFullCalendar = true;
        this.punchButtonText = '已打卡';
      } else {
        this.showFullCalendar = false;
        this.punchButtonText = '打卡';
      }
    },
    editSignature() {
      this.tempSignature = this.signature;
      this.showModal = true;
    },
    updateSignature() {
      this.signature = this.tempSignature;
      this.showModal = false;
    },
    closeModal() {
      this.showModal = false;
    },
    generateMonthCalendar() {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      
      const startDay = firstDayOfMonth.getDay();
      const totalDays = lastDayOfMonth.getDate();
      
      let monthWeeks = [];
      let week = [];
      
      for (let i = startDay; i > 0; i--) {
        const prevMonthDate = new Date(currentYear, currentMonth - 1, totalDays - i + 1);
        week.push({
          date: prevMonthDate.getDate(),
          isCurrentMonth: false,
          isToday: false,
          isNextMonth: false
        });
      }
    
      for (let day = 1; day <= totalDays; day++) {
        const currentDay = new Date(currentYear, currentMonth, day);
        const isToday = currentDay.toDateString() === today.toDateString();
        week.push({
          date: day.toString().padStart(2, '0'),
          isCurrentMonth: true,
          isToday,
          isNextMonth: false
        });
        
        if (currentDay.getDay() === 6 || day === totalDays) {
          monthWeeks.push(week);
          week = [];
        }
      }
    
      if (week.length > 0 && monthWeeks.length < 6) {
        const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
        const nextMonthStartDay = nextMonthDate.getDay();
        for (let i = 1; i <= (7 - nextMonthStartDay) && monthWeeks.length < 6; i++) {
          week.push({
            date: i,
            isCurrentMonth: false,
            isToday: false,
            isNextMonth: true
          });
        }
        if (week.length > 0) monthWeeks.push(week);
      }
    
      this.monthDays = monthWeeks;
    },
	async fetchStudyAnalysis() {
	    // 模拟异步加载学情分析内容
	    const fetchedAnalysis = await this.getAnalysisFromPage();
	    // 截取内容：最多 25 字，超出部分加上省略号
	    this.analysisContent = fetchedAnalysis.length > 25 
	      ? fetchedAnalysis.slice(0, 25) + '...' 
	      : fetchedAnalysis;
	  },
	  
	  async getAnalysisFromPage() {
	    // 这里模拟从其他页面获取内容的过程
	    // 实际中，你需要调用一个 API 或爬取页面内容
	    return new Promise(resolve => {
	      setTimeout(() => {
	        resolve("今天的学情分析：学习进度良好，建议继续保持...");
	      }, 1000);  // 模拟网络延迟
	    });
	  },
	goToAnalysisPage() {
	    uni.navigateTo({
	      url: '/pages/study_analysis/study_analysis'
	    });
	},
	
startStudy() {
  // 保持 roomFirstTitle 和 subtitle 的变化
  this.toggleRoomContent();

  // 获取存储的用户ID
  const userId = uni.getStorageSync('user_id');  // 获取用户ID

  if (!userId) {
    console.log('用户未登录，请先登录');
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;  // 不再继续执行云函数
  }

  // 确认是否能正确获取 userId
  console.log('准备调用云函数，传递的用户ID:', userId);

  // 调用云函数，不需要传递 randomId，云函数会生成它
  uniCloud.callFunction({
    name: 'startStudyRoom',  // 云函数名称
    data: {
      userId: userId  // 只传递 userId
    },
    success: (res) => {
      console.log('云函数调用成功，返回结果:', res);

      if (res.result.success) {
        console.log('自习室已开启');
        console.log('返回的自习信息:', res.result.data);  // 返回的自习信息

        // 获取返回的时间戳、日期和 randomId
        const { startTime, startDate, randomId } = res.result.data;
        console.log('今天日期:', startDate);
        console.log('现在时间戳:', startTime);
        console.log('生成的随机ID:', randomId);

        // 将 randomId 存储到本地存储
        uni.setStorageSync('randomId', randomId);  // 存储 randomId

        // 在成功回调中跳转到自习室页面
        uni.navigateTo({
          url: '/pages/study_room/study_room'
        });
      } else {
        console.log('自习室开启失败:', res.result.message);
      }
    },
    fail: (err) => {
      console.log('调用云函数失败:', err);
    }
  });
},

toggleRoomContent() {
  const today = new Date().toISOString().split('T')[0]; // 获取今天的日期，格式如：2024-11-14
  const lastStudyDate = uni.getStorageSync('lastStudyDate'); // 获取上次自习日期

  // 如果今天的日期与最后记录的日期不一致，说明是新的一天
  if (!lastStudyDate || lastStudyDate !== today) {
    this.roomFirstTitle = "你今天还没进入自习室学习哦！";
    this.roomSubtitle = "不要让自己的梦想偷偷溜走...";
    this.iconSrc = '/static/attention.png'; // 初始图标
  } else {
    // 如果当天已经进入过自习室，状态保持不变
    this.roomFirstTitle = "今日已沉浸式学习";
    this.roomSubtitle = "点击可以继续进入自习室学习哦！";
    this.iconSrc = '/static/okstudy.png'; // 改变后的图标
  }

  // 如果点击后还未记录今天的学习，更新状态并记录今天的日期
  if (!lastStudyDate || lastStudyDate !== today) {
    uni.setStorageSync('lastStudyDate', today); // 记录今天日期
  }
},

// 加载今天的任务
    async loadTasksForToday() {
      const currentDate = new Date().toISOString().split('T')[0];  // 获取当前日期（yyyy-mm-dd）

      try {
        // 假设通过uniCloud获取数据
        const res = await uniCloud.callFunction({
          name: 'getTasksForToday',  // 云函数名
          data: {
            user_id: this.userId,
            date: currentDate  // 过滤出今天的任务
          }
        });

        if (res.result && res.result.tasks) {
          this.tasks = res.result.tasks;
        } else {
          this.tasks = [];
        }
      } catch (error) {
        console.error('加载任务失败:', error);
      }
    },

    // 切换任务完成状态
    toggleTaskCompletion(index) {
      const task = this.tasks[index];
      task.completed = !task.completed;

      // 更新任务状态
      this.updateTaskCompletion(task);
    },

    // 更新任务完成状态到数据库
    async updateTaskCompletion(task) {
      try {
        await uniCloud.callFunction({
          name: 'updateTaskCompletion',
          data: {
            taskId: task._id,  // 任务ID
            completed: task.completed  // 任务完成状态
          }
        });
      } catch (error) {
        console.error('更新任务状态失败:', error);
      }
    },
    goToTaskPage() {
      console.log("尝试跳转到添加任务页面");
      uni.navigateTo({
        url: '/pages/addTasks/addTasks',
        success: () => {
          console.log("成功跳转到添加任务页面");
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
/* 样式保持不变 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 100;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal h2 {
  font-size: 14px;
  margin-bottom: 15px;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.text-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
}

.text-button.update {
  color: #FF0000;
}

.text-button.cancel {
  color: #000000;
}

.text-button:hover {
  text-decoration: underline;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.image-overlay {
  position: relative;
}

.preview-image {
  width: 100%;
  height: 40vh;
  z-index: 0;
}

.content-overlay {
  position: absolute;
  top: 21%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 40vh;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  z-index: 2;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.days {
  font-size: 38px;
  font-weight: bold;
  position: relative;
  top: 50px;
  margin-left: 10px;
}

.countdown {
  position: relative;
  top: 50px;
  font-size: 12px;
  margin-left: 10px;
}

.signature {
  position: relative;
  top: 80px;
  margin-left: 10px;
}

.punch-button {
  background-color: #aa0000;
  color: white;
  border: none;
  padding: 3px 20px;
  font-size: 12px;
  cursor: pointer;
  position: absolute;
  right: 15px;
  bottom: 80px;
  border-radius: 5px;
}

.punch-button:hover {
  background-color: #cc0000;
}

.calendar {
  display: flex;
  flex-direction: column;  /* 这里保持原样，因为其他内容是竖直排布 */
  align-items: center;
  width: 100%;
  margin-top: 0px;
}

/* 一周日历部分 */
.weekCalendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.week-days {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 5px;
  position: fixed;/* 使该部分粘在页面顶部 */
  bottom: 40px;
  padding: 5px 0; /* 增加一定的内边距 */
}

.dates {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 5px;
  position: fixed;/* 使该部分粘在页面顶部 */
  bottom: 0px;
  padding: 5px 0; /* 增加一定的内边距 */
}

.full-calendar {
  margin-top: 190px;
  width: 100%; /* 使背景横跨整个屏幕 */
  background-color: white; /* 白底背景 */
  padding: 10px; /* 内边距，确保内容不会紧贴边缘 */
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  box-sizing: border-box; /* 确保宽度计算包括内边距 */
}

.full-calendar .week {
  display: flex;
  justify-content: space-evenly; /* 平均分配每列 */
  width: 100%;
}

.full-calendar .date {
  width: 25px;  /* 缩小日期宽度 */
  height: 25px;  /* 缩小日期高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px; /* 调整字体大小 */
  border-radius: 50%;
  margin: 2px;
}

.full-calendar .date.current-month {
  color: black;
}

.full-calendar .date.next-month {
  color: gray;  /* 下个月的日期为灰色 */
}

.full-calendar .date.today {
  background-color: lightcoral;
  color: black;
}

.full-calendar .date:hover {
  background-color: #f0f0f0;
}

.calendar-header {
  text-align: center;
  color: #000000;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.week-days .day-of-week {
  font-size: 14px; /* 设置一周日历星期字体大小 */
}



.week {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.date {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 50%;
  margin: 2px;
}

.date.current-month {
  color: black;
}

.date.next-month {
  color: gray;  /* 下个月的日期为灰色 */
}

.date.today {
  background-color: lightcoral;
  color: black;
}

.date:hover {
  background-color: #f0f0f0;
}

.week {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.week .date {
  flex: 1;
  text-align: center;
  padding: 5px;
}

.study-analysis {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background: #fff;
}

.analysis-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;  /* 确保顶部容器宽度为100% */
}

.analysis-header {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}

.analysis-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.analysis-link {
  cursor: pointer;
}

.link-icon {
  width: 20px;
  height: 20px;
}

.divider {
  width: 100%;
  border-top: 1px solid #eaeaea; /* 重新启用边框线 */
  margin-top: 10px;
}

.analysis-content {
  margin-top: 10px;
  font-size: 12px;
  color: gray;
}

.study-room {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background: #fff;
}

.room-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.room-header {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}

.study-icon {
  width: 25px;
  height: 25px;
  margin-right: 10px;
}

.room-link {
  cursor: pointer;
}

.divider {
  width: 100%;
  border-top: 1px solid #eaeaea;
  margin-top: 10px;
}

.room-content {
  display: flex;
  align-items: center;  /* 确保垂直居中 */
  justify-content: center; /* 确保水平居中 */
  padding: 10px;
  background-color: #fff; /* 背景颜色 */
  border-radius: 10px; /* 圆角边框 */
  width: 100%;  /* 确保充满容器宽度 */
}

.content-icon {
  flex-shrink: 0; /* 防止图标缩小 */
  display: flex;  /* 确保图标自身居中 */
  justify-content: center; /* 图标水平居中 */
}

.room-icon {
  width: 40px;  /* 图标大小 */
  height: 40px;  /* 图标大小 */
}

.content-texts {
  display: flex;
  flex-direction: column;
  align-items: center; /* 修改为居中 */
  margin-left: 10px; /* 保持图标和文本之间的间隔 */
  text-align: center; /* 文本居中对齐 */
}

.content-title {
  font-size: 16px; /* 较大字体 */
  color: #000; /* 黑色字体 */
  margin: 0;
}

.content-subtitle {
  font-size: 12px; /* 较小字体 */
  color: #666; /* 灰色字体 */
  margin: 0;
}

.my-tasks {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #fff;
}

.tasks-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.tasks-header {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}

.task-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.tasks-link {
  /* 确保链接在顶部区域的右侧 */
  margin-left: auto;
}

.task-link {
  color: #BD3124;
  text-decoration: none;
  cursor: pointer;
  padding: 5px 10px;
}

.task-link:hover {
  text-decoration: underline;
}

.divider {
  width: 100%;
  border-top: 1px solid #eaeaea;
  margin-top: 10px;
}

.tasks-content {
  text-align: center;
  width: 100%;
}

<style scoped>
/* 样式部分 */
.my-tasks {
  padding: 20px;
}

.tasks-header {
  display: flex;
  align-items: center;
}

.task-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.tasks-content {
  margin-top: 20px;
}

.task-item {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  cursor: pointer;
}

.task-name {
  font-weight: bold;
}

.task-remarks {
  color: #666;
}

.task-completed .task-name,
.task-completed .task-remarks {
  text-decoration: line-through;
  color: #999;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
}

.task-link {
  color: #0066cc;
  text-decoration: none;
}



</style>
