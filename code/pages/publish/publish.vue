<template>
  <view class="container">
    <!-- 顶部导航，包含标题和发布按钮 -->
    <view class="header">
      <text class="close-button" @click="navigateTo('qiujieda')">×</text> <!-- 关闭按钮 -->
      <text class="title">发布求助</text> <!-- 页面标题 -->
      <text class="publish-button" @click="publishHelp">发布</text> <!-- 发布按钮 -->
    </view>

    <!-- 提问标题输入框 -->
    <view class="input-container">
      <input class="title-input" placeholder="你的提问标题：)" v-model="title" /> <!-- 提问标题 -->
    </view>

    <!-- 详细描述输入框 -->
    <view class="input-container">
      <textarea class="description-input" placeholder="详细说明问题，以便获得更好的回答" v-model="description"></textarea> <!-- 问题描述 -->
    </view>

    <!-- 图片上传 -->
    <view class="image-upload">
      <text class="image-upload-text">添加优质配图将会得到更多人回答（最多三张）</text> <!-- 图片上传说明 -->
      <view class="image-preview" v-for="(img, index) in images" :key="index">
        <image :src="img" class="uploaded-image" /> <!-- 展示上传的图片 -->
      </view>
      <button class="add-image-button" @click="addImage">+</button> <!-- 上传按钮 -->
    </view>

    <!-- 福币流通部分 -->
    <view class="reward-section">
      <image src="/static/fubiliutong.png" class="reward-image" />
      <text class="reward-description">(价值越高，越快得到高质量的回答哦~)</text> <!-- 福币描述 -->
    </view>

    <view class="reward-section2">
      <view class="reward-options">
        <button class="reward-option" :class="{ active: reward === 0 }" @click="setReward(0)">无报酬</button> <!-- 无报酬按钮 -->
        <button class="reward-option" :class="{ active: reward === 5 }" @click="setReward(5)">5福币</button> <!-- 5福币按钮 -->
        <button class="reward-option" :class="{ active: reward === 15 }" @click="setReward(15)">15福币</button> <!-- 15福币按钮 -->
        <button class="reward-option" :class="{ active: reward === 'custom' }" @click="setReward('自定义')">自定义</button> <!-- 自定义福币按钮 -->
      </view>
    </view>
    
    <!-- 显示输入的自定义福币数量 -->
    <view v-if="reward === 'custom' && customReward !== ''" class="custom-reward-display">
      <text>自定义福币数量: {{ customReward }} 福币</text>
    </view>

    <!-- 自定义福币输入框，只有选择自定义时才显示 -->
    <view v-if="reward === 'custom'" class="custom-reward-input">
      <input type="number" placeholder="请输入福币数量" v-model="customReward" class="input" @keydown.enter="onEnterPress" /> <!-- 输入框 -->
    </view>

    <!-- 发布成功的消息 -->
    <view v-if="publishMessage" class="success-message">
      <text>{{ publishMessage }}</text>
    </view>

  </view>
</template>

<script>export default {
  data() {
    return {
      title: '', // 提问标题
      description: '', // 问题详细描述
      images: [], // 上传的图片数组
      reward: 0, // 福币奖励值
      customReward: null, // 自定义福币值
      publishMessage: '', // 发布成功的消息
    };
  },
  methods: {
    publishHelp() {
      // 发布求助逻辑，模拟输出数据
      console.log("求助发布成功", this.title, this.description, this.images, this.reward);
      
      // 设置发布成功的消息
      this.publishMessage = '发布成功！';  // 设置发布成功的提示信息
      
      // 可选：自动隐藏消息（例如 3 秒后隐藏）
      setTimeout(() => {
        this.publishMessage = ''; // 3秒后清空消息
      }, 3000);
    },
    addImage() {
      // 模拟添加图片逻辑，最多三张
      if (this.images.length < 3) {
        this.images.push('/static/image-placeholder.png'); // 添加一张图片
      } else {
        alert("最多只能上传三张图片"); // 超过三张时提示
      }
    },
    setReward(value) {
      if (value === '自定义') {
        this.reward = 'custom';  // 设置 reward 为 'custom'，表示选择了自定义按钮
        this.customReward = '';  // 清空自定义值，以便重新输入
      } else {
        this.reward = value; // 设置选择的奖励值
      }
    },
    onEnterPress() {
      if (this.customReward) {
        this.reward = this.customReward; // 按下 Enter 后将自定义值设置到 reward
      }
    },
    close() {
      // 关闭页面逻辑
      console.log("关闭求助发布页面");
    },
    navigateTo(page) {
      console.log(`Navigating to: ${page}`);
      // 页面跳转逻辑
      if (page === 'qiujieda') {
        uni.navigateTo({
          url: '/pages/qiujieda/qiujieda' // 这里的路径应当与你的项目中 `qiujieda` 页面的路径一致
        });
      } else {
        uni.navigateTo({
          url: `/pages/${page}/${page}`
        });
      }
    }
  },
};

</script>
<style scoped>
.container {
  padding: 20px; /* 设置容器的内边距 */
  background-color: #fff; /* 设置容器背景颜色 */
}

.header {
  display: flex; /* 水平布局 */
  flex-direction: row; /* 水平方向排列 */
  justify-content: space-between; /* 元素在水平方向上均匀分布 */
  border-bottom: 1px solid #eee; /* 添加底部边框 */
}

.title {
  font-size: 20px; /* 设置标题字体大小 */
  font-weight: bold; /* 设置标题加粗 */
  text-align: center; /* 设置标题居中对齐 */
}

.close-button {
  font-size: 24px; /* 设置关闭按钮字体大小 */
  color: #666; /* 设置关闭按钮颜色 */
  cursor: pointer; /* 设置鼠标指针样式 */
}

.publish-button {
  color: #ff0000; /* 设置发布按钮颜色 */
  font-weight: bold; /* 设置发布按钮字体加粗 */
  cursor: pointer; /* 设置鼠标指针样式 */
}

.input-container {
  margin-top: 20px; /* 设置输入框上边距 */
}

.title-input {
  width: 100%; /* 设置输入框宽度为100% */
  height: 50px; /* 设置输入框高度 */
  padding: 10px; /* 设置输入框内边距 */
  font-size: 18px; /* 设置输入框字体大小 */
  border: 1px solid #ddd; /* 设置输入框边框 */
  border-radius: 5px; /* 设置输入框圆角 */
}

.description-input {
  width: 100%; /* 设置文本域宽度为100% */
  padding: 10px; /* 设置文本域内边距 */
  font-size: 16px; /* 设置文本域字体大小 */
  border: 1px solid #ddd; /* 设置文本域边框 */
  border-radius: 5px; /* 设置文本域圆角 */
  height: 100px; /* 设置文本域高度 */
}

.image-upload {
  margin-top: 20px; /* 设置图片上传部分上边距 */
}

.image-upload-text {
  font-size: 14px; /* 设置图片上传文本字体大小 */
  color: #888; /* 设置图片上传文本颜色 */
}

.image-preview {
  display: inline-block; /* 设置图片预览为行内块元素 */
  margin-top: 10px; /* 设置图片预览上边距 */
}

.uploaded-image {
  width: 70px; /* 设置上传图片的宽度 */
  height: 70px; /* 设置上传图片的高度 */
  border-radius: 5px; /* 设置上传图片圆角 */
  border: 1px solid #ddd; /* 设置上传图片的边框 */
}

.add-image-button {
  display: inline-block; /* 设置按钮为行内块元素 */
  width: 70px; /* 设置按钮宽度 */
  height: 70px; /* 设置按钮高度 */
  font-size: 32px; /* 设置按钮字体大小 */
  color: #888; /* 设置按钮颜色 */
  background-color: #f8f8f8; /* 设置按钮背景颜色 */
  border: 1px dashed #ddd; /* 设置按钮边框为虚线 */
  border-radius: 5px; /* 设置按钮圆角 */
  text-align: center; /* 设置按钮文本居中 */
  line-height: 70px; /* 设置按钮文字垂直居中 */
  margin-top: 10px; /* 设置按钮上边距 */
  cursor: pointer; /* 设置鼠标指针样式 */
}

.reward-section {
  margin-top: 20px; /* 设置福币部分上边距 */
  flex-direction: row; 
  gap: 17px;
}

.reward-image {
  width: 87px;
  height: 24px;
  margin-right: 10px;
}

.reward-title {
  font-size: 16px; /* 设置福币标题字体大小 */
  font-weight: bold; /* 设置福币标题加粗 */
  color: #ff0000; /* 设置福币标题颜色 */
}

.reward-description {
  font-size: 12px; /* 设置福币描述字体大小 */
  color: #888; /* 设置福币描述颜色 */
}

.reward-section2{
  margin-top: 10px; /* 设置福币部分上边距 */
}

.reward-options {
  display: flex; /* 水平布局 */
  flex-direction: row; /* 水平方向排列 */
  justify-content: space-between; /* 均匀分配 */
  margin-top: 10px; /* 设置福币按钮上边距 */

}

.reward-option {
  padding: 8px 10px; /* 设置按钮内边距 */
  font-size: 4px; /* 设置按钮字体大小 */
  color: #666; /* 设置按钮文字颜色 */
  background-color: #f8f8f8; /* 设置按钮背景颜色 */
  border: 1px solid #ddd; /* 设置按钮边框 */
  border-radius: 5px; /* 设置按钮圆角 */
  cursor: pointer; /* 设置鼠标指针样式 */
  text-align: center; /* 设置按钮文本居中 */
   line-height: 15px;
  width: 70px; /* 设置按钮宽度 */
  height: 32px; /* 设置按钮高度 */
}

.reward-option.active {
  color: #fff; /* 设置激活状态下按钮文字颜色 */
  background-color: #ff0000; /* 设置激活状态下按钮背景颜色 */
  border-color: #ff0000; /* 设置激活状态下按钮边框颜色 */
}
.input {
	  width: 100%;
	  height: 40px;
	  padding: 10px;
	  font-size: 16px;
	  border: 1px solid #ddd;
	  border-radius: 5px;
	}
	.success-message {
	  margin-top: 20px;
	  padding: 10px;
	  background-color: #ff0000; 
	  color: white; /* 白色文字 */
	  border-radius: 5px;
	  text-align: center;
	  font-size: 16px;
	  text-align: center; /* 水平居中文本 */
	  width: 100px; /* 设置消息框的宽度为 300px */
	  height: 20px; /* 设置消息框的高度为 50px */
	  margin-left: auto; /* 自动设置左边距，使其居中 */
	  margin-right: auto; /* 自动设置右边距，使其居中 */
	}

</style>
