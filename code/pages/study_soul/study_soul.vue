<template>
  <div id="study-soul" :style="backgroundStyle">
    <div class="image-overlay">
      <div class="overlay"></div>
      <img :src="imagePreview" alt="Preview Image" class="preview-image" />
    </div>

    <!-- 编辑个性签名的模态框 -->
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
        <!-- 打卡按钮 -->
        <button 
          class="punch-button" 
          @click="punchIn" 
          :style="{ backgroundColor: hasPunchedToday ? '#BD3124' : 'gray', cursor: hasPunchedToday ? 'not-allowed' : 'pointer' }" 
          :disabled="hasPunchedToday">
          {{ hasPunchedToday ? '已打卡' : '打卡' }}
        </button>
      </div>

      <div class="calendar">
        <!-- 一周日历部分 -->
        <div class='weekCalendar'>
          <div class="week-days">
            <div v-for="day in weekDays" :key="day" class="day-of-week">{{ day }}</div>
          </div>
          <div class="dates">
            <div v-for="(day, index) in lastSevenDays" :key="day.date" :class="['date', { 'today': day.isToday }]">
              {{ day.date }}
            </div>
          </div>
        </div>

        <!-- 显示整月日历 -->
        <div v-if="showFullCalendar" class="full-calendar">
          <span class="close-button" @click="closeFullCalendar">&times;</span> <!-- 关闭按钮 -->
          <div class="calendar-header">
            <span>{{ currentYear }}-{{ currentMonth }}</span>
          </div>
        
          <div v-for="(week, weekIndex) in monthDays" :key="weekIndex" class="week">
            <div v-for="(day, dayIndex) in week" :key="dayIndex" :class="['date', { 
              'today': day.isToday, 
              'current-month': day.isCurrentMonth, 
              'next-month': day.isNextMonth,
              'punched': day.isPunched
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
          <view href="#" class="task-link" @click="goToTaskPage()">+添加</view>
        </div>
      </div>
      <hr class="divider"/>
      <div class="tasks-content">
        <!-- 如果没有任务，显示提示信息 -->
        <div v-if="tasks.length === 0" class="no-tasks-message">
          今天还没有给自己布置任务哦
        </div>
        
        <!-- 从数据库获取到的任务 -->
        <div v-else>
          <div class="task-item" v-for="(task, index) in tasks" :key="task._id">
            <div :class="{'task-completed': task.status}" @click="toggleTaskCompletion(index)">
              <span class="task-name">{{ task.name }}</span>
              <p class="task-remarks">{{ task.remarks || '暂无备注' }}</p>
            </div>
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
      signature: '个性签名待编辑...',
      showModal: false,
      tempSignature: '',
      todayDate: '',
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],  // 一周日历英文
      monthWeekDays: ['日', '一', '二', '三', '四', '五', '六'],  // 整月日历中文
      lastSevenDays: [],
      showFullCalendar: false,
      monthDays: [],
      currentYear: new Date().getFullYear(),
      currentMonth: (new Date().getMonth() + 1).toString().padStart(2, '0'), // 当前月份，补零
      
      analysisContent: "今日的学情分析还没更新哦！", // 默认的学情分析内容
      
      roomFirstTitle: "你今天还没进入自习室学习哦", // 初始大字
      roomSubtitle: "不要让自己的梦想偷偷溜走...", // 初始小字
      iconSrc: '/static/attention.png', // 初始图标
      
      tasks: [],

      // 新增：打卡状态
      hasPunchedToday: false,
      punchCount: 0, // 新增：连续打卡天数
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
    this.fetchTasksForToday();  // 获取今天的任务
    this.fetchUserSignature();  // 获取用户个性签名
    this.checkPunchStatus();    // 检查当天是否已打卡
  },
  methods: {
    // 新增：格式化日期为 'YYYY-MM-DD'，基于本地时间
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

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

      this.todayDate = this.formatDate(today); // 使用 formatDate 方法
      console.log('todayDate 设置为:', this.todayDate); // 调试日志
      this.generateMonthCalendar();
    },
    calculateCountdown() {
      const now = new Date();
      const difference = this.examDate - now;
      this.countdown = Math.floor(difference / (1000 * 60 * 60 * 24));
    },
    async punchIn() {
      if (this.hasPunchedToday) {
        uni.showToast({
          title: '今天已打卡',
          icon: 'none'
        });
        return;
      }
    
      // 获取用户ID
      const userId = uni.getStorageSync('user_id');
      console.log('获取到的 userId:', userId);
      if (!userId) {
        uni.showToast({
          title: '用户未登录',
          icon: 'none'
        });
        return;
      }
    
      console.log('调用 recordPunch 云函数，传递的 user_id:', userId);
    
      try {
        const res = await uniCloud.callFunction({
          name: 'recordPunch',  // 云函数名称
          data: { user_id: userId },
        });
    
        console.log('recordPunch 返回结果:', res);
    
        if (res.result.code === 0) {
          // 打卡成功
          this.hasPunchedToday = true;
          uni.setStorageSync('lastPunchDate', this.todayDate); // 记录最后打卡日期
    
          uni.showToast({
            title: '打卡成功',
            icon: 'success'
          });
    
          // 设置 showFullCalendar 为 true，显示整月日历
          this.showFullCalendar = true;
          console.log('打卡成功，showFullCalendar 设置为:', this.showFullCalendar);
    
          // 重新检查打卡状态以确保数据同步
          await this.checkPunchStatus();
    
          // 重新生成月日历以反映新的打卡状态
          await this.generateMonthCalendar();
        } else if (res.result.code === 2) {
          // 今天已打卡
          this.hasPunchedToday = true;
          uni.showToast({
            title: '今天已打卡',
            icon: 'none'
          });
        } else {
          // 其他错误
          console.log('打卡失败的原因:', res.result.msg);
          uni.showToast({
            title: res.result.msg || '打卡失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('打卡失败的详细信息:', error);
        uni.showToast({
          title: '打卡失败，请重试',
          icon: 'none'
        });
      }
    },


    async checkPunchStatus() {
      const userId = uni.getStorageSync('user_id');
      if (!userId) {
        console.log('用户未登录，请先登录');
        return;
      }

      console.log('调用 getPunchStatus 云函数，传递的 user_id:', userId);

      try {
        const res = await uniCloud.callFunction({
          name: 'getPunchStatus',  // 云函数名称，用于获取用户打卡状态
          data: { user_id: userId },
        });

        console.log('getPunchStatus 返回结果:', res);

        if (res.result.code === 0) {
          this.hasPunchedToday = true;
          console.log('设置 hasPunchedToday 为 true');
          uni.showToast({
            title: '今天已打卡',
            icon: 'success'
          });
        } else if (res.result.code === 2) {
          this.hasPunchedToday = false;
          console.log('设置 hasPunchedToday 为 false');
          uni.showToast({
            title: '今天未打卡',
            icon: 'none'
          });
        } else {
          console.log('获取打卡状态失败:', res.result.msg);
          uni.showToast({
            title: res.result.msg || '获取打卡状态失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取打卡状态失败:', error);
        uni.showToast({
          title: '获取打卡状态失败，请重试',
          icon: 'none'
        });
      }
    },

    // 关闭全月日历
    closeFullCalendar() {
      this.showFullCalendar = false;
      console.log('关闭全月日历，showFullCalendar 设置为 false');
    },
    // 获取用户个性签名
    async fetchUserSignature() {
      const userId = uni.getStorageSync('user_id');  // 获取存储的用户ID
      if (!userId) {
        console.log('用户未登录，请先登录');
        return;
      }

      try {
        const res = await uniCloud.callFunction({
          name: 'getSignature',  // 云函数名称
          data: { user_id: userId },  // 传递用户ID
        });

        if (res.result.code === 0) {
          this.signature = res.result.signature;
          console.log('获取到的签名:', res.result.signature);
        } else if (res.result.code === 2) {
          console.log('用户未找到，使用默认签名');
          this.signature = 'call of silence yyds..(自定义签名)';
        } else {
          console.log('获取签名失败:', res.result.msg);
        }
      } catch (error) {
        console.error('获取签名失败:', error);
        uni.showToast({
          title: '获取签名失败，请重试',
          icon: 'none'
        });
      }
    },

    // 编辑个性签名
    editSignature() {
      this.tempSignature = this.signature;
      this.showModal = true;
    },

    // 更新个性签名
    async updateSignature() {
      const userId = uni.getStorageSync('user_id');  // 获取存储的用户ID
      if (!userId) {
        uni.showToast({
          title: '用户未登录',
          icon: 'none'
        });
        return;
      }

      const newSignature = this.tempSignature.trim();
      if (newSignature.length === 0) {
        uni.showToast({
          title: '签名不能为空',
          icon: 'none'
        });
        return;
      }

      try {
        const res = await uniCloud.callFunction({
          name: 'updateSignature',  // 云函数名称
          data: {
            user_id: userId,
            signature: newSignature
          }
        });

        if (res.result.code === 0) {
          this.signature = newSignature;
          this.showModal = false;
          uni.showToast({
            title: '签名更新成功',
            icon: 'success'
          });
          console.log('签名更新成功:', res.result.msg);
        } else {
          uni.showToast({
            title: res.result.msg || '签名更新失败',
            icon: 'none'
          });
          console.log('签名更新失败:', res.result.msg);
        }
      } catch (error) {
        console.error('更新签名时出错:', error);
        uni.showToast({
          title: '更新签名失败，请重试',
          icon: 'none'
        });
      }
    },

    closeModal() {
      this.showModal = false;
    },
    async generateMonthCalendar() {
      // 获取当前时间（本地时间，无需时区调整）
      const currentDate = new Date();
    
      // 将 currentDate 格式化为 'YYYY-MM-DD' 字符串
      const todayStr = this.formatDate(currentDate);
      this.todayDate = todayStr; // 更新 todayDate
    
      // 使用 currentDate 进行后续日期操作
      const currentMonthIndex = currentDate.getMonth(); // 0-11
      const currentYear = currentDate.getFullYear();
      const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0);
    
      const startDay = firstDayOfMonth.getDay(); // 0-6 (Sun-Sat)
      const totalDays = lastDayOfMonth.getDate();
    
      let monthWeeks = [];
      let week = [];
    
      // 获取所有打卡日期
      const userId = uni.getStorageSync('user_id');
      let punchDates = [];
      if (userId) {
        try {
          const res = await uniCloud.callFunction({
            name: 'getAllPunchDates', // 云函数名称
            data: { user_id: userId },
          });
          if (res.result.code === 0) {
            punchDates = res.result.punchDates; // 获取打卡日期数组，格式为 'YYYY-MM-DD'
            console.log('获取到的打卡日期:', punchDates);
          }
        } catch (error) {
          console.error('获取打卡日期失败:', error);
        }
      }
    
      // 添加上个月的日期
      for (let i = startDay; i > 0; i--) {
        const prevMonthDate = new Date(currentYear, currentMonthIndex, 1 - i);
        const dateStr = this.formatDate(prevMonthDate); // 使用 formatDate 方法
        week.push({
          date: prevMonthDate.getDate(),
          isCurrentMonth: false,
          isToday: dateStr === this.todayDate,
          isNextMonth: false,
          isPunched: punchDates.includes(dateStr)
        });
      }
    
      // 添加当前月的日期
      for (let day = 1; day <= totalDays; day++) {
        const currentDay = new Date(currentYear, currentMonthIndex, day);
        const dateStr = this.formatDate(currentDay); // 使用 formatDate 方法
        const isToday = dateStr === this.todayDate;
        week.push({
          date: day.toString().padStart(2, '0'),
          isCurrentMonth: true,
          isToday,
          isNextMonth: false,
          isPunched: punchDates.includes(dateStr)
        });
    
        if (currentDay.getDay() === 6 || day === totalDays) { // 周六或月末
          monthWeeks.push(week);
          week = [];
        }
      }
    
      // 添加下个月的日期
      if (week.length > 0 && monthWeeks.length < 6) {
        const nextMonthDate = new Date(currentYear, currentMonthIndex + 1, 1);
        const nextMonthStartDay = nextMonthDate.getDay();
        for (let i = 1; i <= (7 - nextMonthStartDay) && monthWeeks.length < 6; i++) {
          const nextDay = new Date(currentYear, currentMonthIndex + 1, i);
          const dateStr = this.formatDate(nextDay); // 使用 formatDate 方法
          week.push({
            date: i.toString().padStart(2, '0'),
            isCurrentMonth: false,
            isToday: dateStr === this.todayDate,
            isNextMonth: true,
            isPunched: punchDates.includes(dateStr)
          });
        }
        if (week.length > 0) monthWeeks.push(week);
      }
    
      this.monthDays = monthWeeks;
      console.log('Generated monthDays:', this.monthDays); // 调试日志
    
      // 更新 currentYear 和 currentMonth
      const currentMonthStr = (currentMonthIndex + 1).toString().padStart(2, '0'); // 当前月份，补零
      this.currentYear = currentYear;
      this.currentMonth = currentMonthStr;
    
      // 额外调试日志：打印每周的打卡状态
      monthWeeks.forEach((week, index) => {
        console.log(`Week ${index + 1}:`);
        week.forEach(day => {
          console.log(`Date: ${day.date}, Punched: ${day.isPunched}`);
        });
      });
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
      const today = this.formatDate(new Date()); // 使用 formatDate 方法
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
    fetchTasksForToday() {
      const userId = uni.getStorageSync('user_id');  // 获取存储的用户ID
      if (!userId) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }
    
      uniCloud.callFunction({
        name: 'getTasksForToday',  // 云函数名称
        data: { user_id: userId },  // 传递用户ID
        success: (res) => {
          if (res.result && res.result.tasks) {
            this.tasks = res.result.tasks;  // 更新任务数据
          } else {
            this.tasks = [];  // 没有任务时清空任务列表
          }
        },
        fail: (error) => {
          console.error('获取任务失败:', error);
          uni.showToast({
            title: '获取任务失败，请重试',
            icon: 'none'
          });
        }
      });
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
    async toggleTaskCompletion(index) {
      const task = this.tasks[index];
      console.log('当前任务对象:', task); // 添加日志
      const newStatus = !task.status;
      console.log('新状态:', newStatus, '类型:', typeof newStatus); // 添加日志
    
      // 确保 task._id 存在
      if (!task._id) {
        uni.showToast({
          title: '任务ID缺失',
          icon: 'none'
        });
        return;
      }
    
      // 确保 newStatus 是布尔类型
      if (typeof newStatus !== 'boolean') {
        uni.showToast({
          title: '状态值错误',
          icon: 'none'
        });
        return;
      }
    
      try {
        const res = await uniCloud.callFunction({
          name: 'changeTaskStatus', // 使用新的云函数名称
          data: {
            task_id: task._id, // 确保这里的 _id 是正确的任务ID
            status: newStatus
          }
        });
    
        console.log('changeTaskStatus 返回结果:', res);
    
        if (res.result.code === 0) {
          this.tasks[index].status = newStatus;
          uni.showToast({
            title: newStatus ? '任务已完成' : '任务未完成',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: res.result.msg || '更新任务状态失败',
            icon: 'none'
          });
          console.log('更新任务状态失败:', res.result.msg);
        }
      } catch (error) {
        console.error('更新任务状态时出错:', error);
        uni.showToast({
          title: '更新任务状态失败',
          icon: 'none'
        });
      }
    }
  },
  onLoad() {
    this.fetchTasksForToday();  // 获取当天的任务
  }
};
</script>


<style scoped>
/* 一周日历部分 */
.weekCalendar {
  position: fixed; /* 固定定位 */
  bottom: 0; /* 固定在页面底部 */
  left: 0;
  width: 100%; /* 宽度占满屏幕 */
  height: 60px; /* 固定高度，根据需要调整 */
  padding: 10px 0; /* 上下内边距 */
  z-index: 10; /* 确保在其他内容之上 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 一周日历的星期名称和日期 */
.week-days, .dates {
  display: flex;
  justify-content: space-around; /* 平均分配每个项目 */
  width: 90%; /* 设置宽度，您可以根据需要调整 */
  margin: 0 auto; /* 居中 */
  padding: 0; /* 去除默认内边距 */
}

.day-of-week, .date {
  width: 40px; /* 统一宽度 */
  text-align: center;
  font-size: 14px;
  box-sizing: border-box; /* 确保内边距和边框不会影响宽度 */
}

.today-marker {
  width: 6px;
  height: 6px;
  background-color: #BD3124;
  border-radius: 50%;
  margin: 0 auto 2px; /* 居中并添加下边距 */
}

/* 调整日期的样式 */
.date {
  height: 30px; /* 调整高度以匹配星期名称 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.date.today {
  background-color: lightcoral;
  color: white;
  border-radius: 50%;
}

.date.punched {
  background-color: #BD3124;
  color: white;
  position: relative;
  border-radius: 50%; /* 确保圆形 */
}

.date.punched::after {
  content: '';
  position: absolute;
  bottom: 2px;
  right: 50%;
  transform: translateX(50%);
  width: 6px;
  height: 6px;
  background-color: white;
  border-radius: 50%;
}

.date:hover {
  background-color: #f0f0f0;
}

.date.current-month {
  color: black;
}

.date.next-month {
  color: gray; /* 下个月的日期为灰色 */
}

/* 全月日历样式 */
.full-calendar {
  position: fixed; /* 固定定位 */
  top: 270px;
  left: 50%;
  transform: translateX(-50%) translateY(0); /* 恢复位置 */
  width: 90%; /* 根据需要调整 */
  max-width: 500px; /* 设置最大宽度 */
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 999; /* 确保在最上层 */
  overflow-y: auto; /* 如果内容过多，允许滚动 */
  transition: all 0.3s ease-in-out; /* 添加过渡效果 */
  display: flex; /* 确保 flex 布局 */
  flex-direction: column;
  align-items: center;
}

.full-calendar .close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #aaa;
}

.full-calendar .close-button:hover {
  color: #000;
}

.full-calendar .calendar-header {
  text-align: center;
  color: #000000;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.full-calendar .week {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 5px;
}

.full-calendar .date {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  border-radius: 50%;
  margin: 2px;
}

.full-calendar .date.current-month {
  color: black;
}

.full-calendar .date.next-month {
  color: gray; /* 下个月的日期为灰色 */
}

.full-calendar .date.today {
  background-color: lightcoral;
  color: white;
}

.full-calendar .date:hover {
  background-color: #f0f0f0;
}

/* 学情分析模块 */
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
  color: #A9A9A9;
}

/* 自习室模块 */
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
  color: #A9A9A9; /* 灰色字体 */
  margin: 0;
}

/* 我的任务模块 */
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

.task-item {
  margin: 10px 0;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.task-name {
  font-weight: bold;
}

.task-remarks {
  font-size: 12px;
  color: #666;
}

.task-completed .task-name {
  text-decoration: line-through;
  color: #bbb;
}

.no-tasks-message {
  text-align: center;
  color: #A9A9A9; /* 灰色字体 */
  padding: 20px 0;
  font-size: 12px;
}

/* 其他模态框样式 */
.modal-overlay {
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

/* 打卡按钮样式 */
.punch-button {
  background-color: gray;
  color: white;
  border: none;
  padding: 3px 20px;
  font-size: 12px;
  cursor: pointer;
  position: absolute;
  right: 15px;
  bottom: 80px;
  border-radius: 5px;
  transition: background-color 0.3s, opacity 0.3s;
}

.punch-button:hover {
  background-color: #BD3124;
  color: white;
}

.punch-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
