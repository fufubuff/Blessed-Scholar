<template>
  <div class="settings-page">

    <!-- 通知设置列表 -->
    <ul class="settings-list">
      <li class="settings-item">
        <span>评论与@</span>
        <view class="switchBox">
          <switch @change="switchChange('commentsMentions')" color="#b50c5b" :checked="notifications.commentsMentions" />
        </view>
      </li>
      <li class="settings-item">
        <span>点赞</span>
        <view class="switchBox">
          <switch @change="switchChange('likes')" color="#b50c5b" :checked="notifications.likes" />
        </view>
      </li>
      <li class="settings-item">
        <span>粉丝</span>
        <view class="switchBox">
          <switch @change="switchChange('followers')" color="#b50c5b" :checked="notifications.followers" />
        </view>
      </li>
      <li class="settings-item">
        <span>系统通知</span>
        <view class="switchBox">
          <switch @change="switchChange('systemNotifications')" color="#b50c5b" :checked="notifications.systemNotifications" />
        </view>
      </li>
      <li class="settings-item">
        <span>消息</span>
        <view class="switchBox">
          <switch @change="switchChange('messages')" color="#b50c5b" :checked="notifications.messages" />
        </view>
      </li>
    </ul>

    <!-- 打卡提醒设置 -->
    <div class="reminder-section">
      <h2>打卡提醒</h2>
      <div class="reminder-item">
        <span>提醒时间</span>
        <input type="time" v-model="reminderTime" class="time-input" />
      </div>
      <div class="reminder-item">
        <span>重复时间</span>
        <span class="repeat-text">工作日 周末 每天</span>
      </div>
      <div class="repeat-days">
        <button v-for="day in repeatDays" :key="day" class="day-button" :class="{ active: notifications.repeatDays.includes(day) }" @click="toggleRepeatDay(day)">{{ day }}</button>
      </div>
      <button @click="saveSettings" class="save-button">保存设置</button>
    </div>
  </div>
</template>

<script>


export default {
  name: 'SettingsPage',
  data() {
    return {
      notifications: {
        commentsMentions: false,
        likes: false,
        followers: false,
        systemNotifications: false,
        messages: false,
        repeatDays: [],
      },
      repeatDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      reminderTime: '06:30',
    };
  },
  methods: {
    switchChange(type) {
      this.notifications[type] = !this.notifications[type];
      console.log(`${type} 状态:`, this.notifications[type] ? '开启' : '关闭');
    },
    toggleRepeatDay(day) {
      const index = this.notifications.repeatDays.indexOf(day);
      if (index > -1) {
        this.notifications.repeatDays.splice(index, 1);
      } else {
        this.notifications.repeatDays.push(day);
      }
      console.log('重复时间:', this.notifications.repeatDays);
    },
   async saveSettings() {
     try {
       const result = await uniCloud.callFunction({
         name: 'saveUserSettings',
         data: {
           notifications: this.notifications,
           reminderTime: this.reminderTime,
           repeatDays: this.notifications.repeatDays,
         },
       });
       if (result.result.success) {
         uni.showToast({
           title: '设置已保存',
           icon: 'success',
         });
       } else {
         uni.showToast({
           title: '保存失败',
           icon: 'error',
         });
       }
     } catch (error) {
       console.error('保存设置失败:', error);
       uni.showToast({
         title: '保存失败',
         icon: 'error',
       });
     }
   },
  },
};
</script>

<style scoped>
.settings-page {
  padding: 20px;
  background-color: #ffffff;
  color: #000000;
  font-family: Arial, sans-serif;
}


.settings-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.switchBox {
  transform: scale(0.8, 0.8);
}

.reminder-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 10px;
}

.reminder-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.repeat-text {
  color: #b0b0b0;
  font-size: 14px;
  margin-left: 10px;
}

.repeat-days {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.day-button {
  width: 50px;
  height: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  background-color: #ffffff;
  cursor: pointer;
  color: #000000;
  font-size: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.day-button.active {
  background-color: #bd402f;
  color: #ffffff;
  border-color: #bd402f;
}

.time-input {
  font-size: 16px;
  padding: 5px;
}

.save-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #bd402f;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
