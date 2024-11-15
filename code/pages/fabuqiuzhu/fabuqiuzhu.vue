<template>
  <view class="container">
    <!-- Header with title and close button -->
    <view class="header">
      <view class="tab-container" @click="closePage">
        <text class="tab-close">×</text>
      </view>
      <text class="title">发布求助</text>
      <view class="tab-container" @click="submitHelp">
        <text class="tab-submit">发布</text>
      </view>
    </view>

    <!-- Help Title Input -->
    <view class="title-input">
      <input placeholder="请输入求助标题..." v-model="helpTitle" class="input" />
    </view>

    <!-- Red Line Separator -->
    <view class="separator"></view>

    <!-- Help Content Input -->
    <view class="content-input">
      <textarea placeholder="请输入详细求助内容,以便更好的回答" v-model="helpContent" class="textarea"></textarea>
      <view class="image-preview" v-if="image">
        <image :src="image" class="preview-image" />
      </view>
    </view>

    <!-- Image Upload Button -->
    <view class="fixed-upload-button">
      <text class="upload-hint">添加优质配图可以获得更多的关注，最多添加3张</text>
      <button @click="uploadImage" class="upload-button">+</button>
    </view>

    <!-- Dark Red Line Separator -->
    <view class="separator-darkred"></view>

    <!-- Reward Section -->
    <view class="reward-section">
      <image src="/static/fubiliutong.png" class="reward-image" />
      <text class="reward-hint">价值越高，越快得到高质量的回答哦！</text>
    </view>

    <!-- Reward Options -->
    <view class="reward-options">
      <view class="reward-option" @click="selectReward('无报酬')" :class="{ active: selectedReward === '无报酬' }">
        <text>无报酬</text>
      </view>
      <view class="reward-option" @click="selectReward('5福币')" :class="{ active: selectedReward === '5福币' }">
        <text>5福币</text>
      </view>
      <view class="reward-option" @click="selectReward('10福币')" :class="{ active: selectedReward === '10福币' }">
        <text>10福币</text>
      </view>
      <view class="reward-option" @click="selectReward('自定义')" :class="{ active: selectedReward === '自定义' }">
        <text>自定义</text>
      </view>
    </view>

    <!-- Custom Reward Input -->
    <view v-if="selectedReward === '自定义'" class="custom-reward-input">
      <input placeholder="请输入福币数量" v-model="customReward" class="input" />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      helpTitle: '',
      helpContent: '',
      image: null,
      selectedReward: '无报酬',
      customReward: ''
    };
  },
  methods: {
    uploadImage() {
      // 模拟上传图片的逻辑
      // 实际项目中需要调用上传图片的接口
      this.image = '/static/uploaded-image.png'; // 示例图片路径
    },
    submitHelp() {
      if (!this.helpTitle) {
        alert('请输入求助标题');
        return;
      }
      if (!this.helpContent) {
        alert('请输入求助内容');
        return;
      }
      // 提交求助内容的逻辑
      // 实际项目中需要调用提交求助内容的接口
      alert('求助内容已发布');
    },
    closePage() {
      // 关闭页面的逻辑
      // 实际项目中需要调用关闭页面的接口或方法
      alert('关闭页面');
    },
    selectReward(reward) {
      this.selectedReward = reward;
      if (reward !== '自定义') {
        this.customReward = '';
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  height: 100%;
  background-color: white;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  background-color: white;
  align-items: center;
}
.tab-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
.tab-close {
  font-size: 24px;
  cursor: pointer;
  color: #000;
}
.tab-submit {
  font-size: 12px;
  cursor: pointer;
  color: darkred;
}
.title {
  font-size: 16px;
  font-weight: bold;
}
.title-input {
  margin: 0px 10px;
}
.input {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  background-color: white;
}
.separator {
  width: 100%;
  height: 1px;
  background-color: darkred;
  margin: 0px ;
}
.content-input {
  margin: 0px 0px;
  position: relative;
}
.textarea {
  width: 100%;
  height: 200px;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  resize: none;
}
.fixed-upload-button {
  position: fixed;
  bottom: 220px;
  left: 10px; /* 向左靠 */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 向左对齐 */
}
.upload-hint {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}
.upload-button {
  width: 80px;
  height: 80px;
  background-color: white;
  color: #999;
  border: 1px solid #999;
  border-radius: 5px;
  font-size: 36px;
  line-height: 72px;
  text-align: center;
  cursor: pointer;
}
.separator-darkred {
  width: 100%;
  height: 1px;
  background-color: darkred;
  margin: 130px 0;
}
.reward-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  bottom: 130px;
  margin: 20px 10px;
}
.reward-image {
  width: 87px;
  height: 24px;
  margin-right: 10px;
}
.reward-hint {
  font-size: 14px;
  color: #999;
}
.reward-options {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 10px 10px;
  bottom: 140px;
}
.reward-option {
  padding: 5px 10px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 15px;
  cursor: pointer;
}
.reward-option text {
  font-size: 12px; /* 减小字体 */
}
.reward-option.active {
  border: 1px solid #bd3124;
  color: #bd3124;
}
.custom-reward-input {
  margin: 10px 10px;
  bottom: 140px
}
</style>