<template>
  <view class="container">
    <!-- 输入框部分 -->
    <view class="input-box">
      <!-- 替换为文本区域，使其可编辑 -->
      <textarea class="input-area" placeholder="请输入你的任务" v-model="taskText" />
      <view class="tag-section">
        <view class="tag" @click="setTaskText('背单词')">背单词+</view>
        <view class="tag" @click="setTaskText('专业课')">专业课+</view>
        <view class="tag" @click="setTaskText('高数')">高数+</view>
        <view class="tag" @click="setTaskText('起床')">起床+</view>
        <view class="tag" @click="setTaskText('做阅读')">做阅读+</view>
        <view class="tag" @click="setTaskText('背政治')">背政治+</view>
        <view class="tag" @click="setTaskText('十二点睡觉')">十二点睡觉+</view>
      </view>

      <!-- “更多常用任务”按钮 -->
      <view class="more-tasks" @click="toggleMoreTasks">
        更多常用任务
        <text class="arrow-icon">▼</text> <!-- 向下展开的图标 -->
      </view>
    </view>

    <!-- 新增的白色圆角矩形，用于打卡时间和提醒时间 -->
    <view class="time-box">
      <picker mode="time" start="08:00" end="23:00" @change="onTimeRangeChange">
        <view class="time-item">
          <text class="time-label">打卡时间</text>
          <text class="time-value">{{ checkInTime }}</text>
        </view>
      </picker>

      <!-- 提醒时间选择 -->
      <view class="time-item">
        <text class="time-label">提醒时间</text>
        <picker mode="time" start="08:00" end="23:00" @change="onReminderChange">
          <view class="reminder-box">
            <text class="reminder-time">{{ reminderTime }}</text>
          </view>
        </picker>
      </view>

      <view class="section">
        <view class="time-label">重复</view>
        <view class="time-values">
          <view
            class="time-slot"
            v-for="(time, index) in times"
            :key="index"
            :class="{'selected': selectedTimes.includes(time)}"
            @click="toggleTimeSelection(time)"
          >
            {{ time }}
          </view>
        </view>
      </view>
    </view>

    <!-- 备注部分 -->
    <view class="section">
      <view class="textarea-container">
        <textarea class="textarea" placeholder="请输入备注内容" v-model="notes"></textarea>
      </view>
      <button class="confirm-button" @click="addTask">确认添加</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      notes: '', // 备注内容
      taskText: '请输入你的任务',  // 默认任务文本
      times: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],  // 更新时间选择部分
      selectedTimes: [],  // 存储被选择的日期
      checkInTime: '08:00-23:00',  // 初始化打卡时间
      reminderTime: '08:00'  // 初始化提醒时间
    };
  },
  methods: {
    // 点击按钮时，更新任务文本区域的内容
    setTaskText(text) {
      this.taskText = text;
    },
    // 切换“更多常用任务”按钮
    toggleMoreTasks() {
      console.log('更多常用任务展开');
      // 添加展开功能逻辑
    },
    // 选择打卡时间范围
    onTimeRangeChange(event) {
      const selectedTime = event.detail.value;
      this.checkInTime = selectedTime;  // 只保存用户选择的时间
    },
    // 选择提醒时间
    onReminderChange(event) {
      this.reminderTime = event.detail.value;
    },
    // 切换时间选择状态
    toggleTimeSelection(time) {
      const index = this.selectedTimes.indexOf(time);
      if (index === -1) {
        this.selectedTimes.push(time);  // 选中
      } else {
        this.selectedTimes.splice(index, 1);  // 取消选中
      }
    },
    // 添加任务
    addTask() {
      console.log('任务已添加');
      // 添加任务的逻辑
    }
  }
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #e5e5e5;
}

.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.input-box {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  align-self: center;
  width: 93%;
  height: 170px;
  display: flex;
  flex-direction: column;
}

.input-area {
  width: 100%;
  height: 16%;
  border: none;
  outline: none;
  resize: none;
  font-size: 16px;
  color: #c1c1c1;
  background-color: transparent;
}

.tag-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-top: 20px;
  margin-top: 0px;
}

.tag {
  background-color: white;
  border: 0.1px solid #fd717a;
  color: #c1c1c1;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 15px;
  margin: 0px 10px 12px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tag:hover {
  background-color: #e0e0e0;
}

.more-tasks {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #e70128;
  cursor: pointer;
  margin-top: 25px;
}

.arrow-icon {
  margin-left: 5px;
  font-size: 12px;
}

/* 新增的时间选择框样式 */
.time-box {
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  align-self: center;
  width: 96%;
  height: 200px;
  display: flex;
  flex-direction: column;
}

.time-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.time-label {
  font-size: 16px;
  color: black;
}

.reminder-box {
  width: 60px;
  height: 60px;
  background-color: #e0e0e0;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.reminder-time {
  font-size: 14px;
  color: #666;
}

.picker-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.section {
  margin-bottom: 20px;
}

.time-values {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 0;
}

.time-slot {
  background-color: #fd717a;
  margin-top: 20px;
  color: white;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.time-slot:hover {
  background-color: #e0585e;
}

.time-slot.selected {
  background-color: #e70128;  /* 选中的按钮颜色 */
}

.textarea {
  width: 100%;
  height: 100px;
  border-radius: 8px;
  font-size: 16px;
  padding: 10px;
}

/* 新增的备注输入框样式 */
.textarea-container {
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  margin-left: -8px;
  align-self: center;
  width: 95%;
  resize: both; /* 允许调整大小 */
  overflow: auto; /* 隐藏溢出内容 */
  border: 1px solid transparent; /* 添加边框以便更好地显示 */
}

/* 确认添加按钮样式 */
.confirm-button {
  background-color: #f80512;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 35px;
  cursor: pointer;
  align-self: center;
  transition: background-color 0.3s;
  margin-bottom: 200px;
}

.confirm-button:hover {
  background-color: #e1001e;
}

</style>