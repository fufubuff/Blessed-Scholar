<template>
  <div class="help-page">
    <!-- Top Navigation with Title and Publish Time -->
 <div class="top-nav">
   <text class="back-button" @click="goBack">←</text> <!-- 返回按钮，点击返回上页 -->
   <text class="title">求助详情</text> <!-- 页面标题 -->
   <button class="share-button">
     <i class="fas fa-share-alt"></i> <!-- 分享图标 -->
   </button>
   <!-- 引入 FontAwesome 图标库 -->
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
 </div>

    <!-- Help Request Details -->
    <div class="request-details">
      <div class="user-info">
        <img class="avatar" src="/static/logo.png" alt="User Avatar" /> <!-- 用户头像 -->
        <div class="user-text">
          <text class="username">SE we love it</text> <!-- 用户名 -->
          <text class="timestamp">刚刚发布</text> <!-- 发布时间 -->
        </div>
      </div>
      <div class="request-content">
        <text class="question">有人会开发基于LLM大模型接口的软件吗？</text> <!-- 问题标题 -->
        <text class="description">求支付宝接口巨款</text> <!-- 问题描述 -->
      </div>
    </div>

    <!-- Group Info -->
    <div class="group-info">
      <img class="group-image" src="/static/logo.png" alt="Group Image" /> <!-- 小组或项目图片 -->
    </div>

    <!-- Help Statistics -->
    <div class="help-stats">
      <text>0人已求助</text> <!-- 显示已求助人数 -->
      <text>收藏</text> <!-- 显示收藏按钮 -->
    </div>

    <div class="help-stats2">
      <text>求助回复</text> 
      <text>0人回复</text> <!-- 显示回复人数 -->
    </div>

    <!-- Answer Section -->
    <div class="answer-section">
      <text class="no-answers">暂时还没有同学回答这个求助哦~</text> <!-- 提示没有回答 -->
    </div>

    <!-- Reply Button at Bottom -->
    <div class="reply-section">
      <button class="reply-button">回复</button> <!-- 回复按钮，位于底部 -->
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      // 使用 uni.navigateTo 跳转到 'qiujieda' 页面
      uni.navigateTo({
        url: '/pages/qiujieda/qiujieda' // 替换为你项目中 qiujieda 页面的路径
      });
    }
  }
};
</script>

<style scoped>
/* Container for the entire page */
.help-page {
  background-color: #f8f8f8; /* 设置页面背景颜色 */
  padding: 16px; /* 设置页面内边距 */
  font-family: Arial, sans-serif; /* 设置字体 */
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 垂直排列所有元素 */
  min-height: 100vh; /* 确保页面充满整个视口高度 */
}

/* Top navigation bar with title and share button */
.top-nav {
  display: flex; /* 使用 flex 布局 */
  justify-content: space-between; /* 使元素分别对齐到左右两端 */
  align-items: center; /* 元素垂直居中 */
  border-bottom: 1px solid #ddd; /* 底部边框 */
  padding: 10px 20px; /* 设置内边距，确保左右两边不贴边 */
}

.title {
  font-size: 18px; /* 设置标题字体大小 */
  font-weight: bold; /* 设置标题加粗 */
  color: #333; /* 设置标题颜色 */
  flex-grow: 1; /* 使标题占据剩余空间，从而居中 */
  text-align: center; /* 使标题居中 */
}

.share-button {
  color: #007aff; /* 分享按钮颜色 */
  font-size: 12px; /* 分享按钮字体大小 */
  cursor: pointer; /* 鼠标悬停时显示为可点击 */
  background: none; /* 背景为透明 */
  border: none; /* 去掉按钮边框 */
}

.share-button i {
  margin-left: 5px; /* 给图标和文字之间加点间距 */
  font-size: 16px; /* 图标大小 */
}

/* User Info Section */
.user-info {
  display: flex; /* 使用 flex 布局 */
  align-items: center; /* 用户头像和文本垂直居中 */
}

.avatar {
  width: 40px; /* 用户头像宽度 */
  height: 40px; /* 用户头像高度 */
  border-radius: 50%; /* 圆形头像 */
  margin-right: 10px; /* 头像和文本之间的间距 */
}

.user-text {
  display: flex;
  flex-direction: row; /* 水平排列用户名和时间 */
}

.username {
  font-size: 16px; /* 用户名字体大小 */
  font-weight: bold; /* 用户名加粗 */
  color: #333; /* 用户名颜色 */
  margin-right: 13px; /* 用户名和时间戳之间的间距 */
}

.timestamp {
  font-size: 12px; /* 时间戳字体大小 */
  color: #999; /* 时间戳颜色 */
}

/* Request Content Section */
.request-content {
  margin-top: 10px; /* 设置内容与上方的间距 */
}

.question {
  font-size: 16px; /* 设置问题标题字体大小 */
  font-weight: bold; /* 设置问题标题加粗 */
  color: #333; /* 设置问题标题颜色 */
  margin-bottom: 4px; /* 设置标题底部间距 */
  display: block;  /* 确保每个文本独占一行 */
  padding-left: 3em;  /* 添加左边的空白，2em 等同于两个字符的宽度 */
}

.description {
  font-size: 14px; /* 设置问题描述字体大小 */
  color: #666; /* 设置描述文字颜色 */
  display: block;  /* 确保每个文本独占一行 */
  padding-left: 4em;  /* 添加左边的空白，2em 等同于两个字符的宽度 */
}

/* Group Information Section */
.group-info {
  display: flex; /* 使用 flex 布局 */
  align-items: center; /* 小组图片和文本垂直居中 */
}

.group-image {
  width: 100px; /* 小组图片宽度 */
  height: 50px; /* 小组图片高度 */
  border-radius: 5px; /* 设置圆角 */
  margin-right: 10px; /* 图片与文本之间的间距 */
  margin-left: 50px;  /* 增加左边的空白格 */
  margin-top: 7px; /* 设置图片上方的间距 */
}

/* Help Statistics Section */
.help-stats {
  display: flex; /* 使用 flex 布局 */
  justify-content: space-between; /* 两个部分之间平均分配 */
  align-items: center; /* 垂直居中 */
  margin-top: 15px; /* 设置顶部间距 */
  font-size: 10px; /* 设置字体大小 */
  color: #666; /* 设置字体颜色 */
}

.help-stats2 {
  display: flex; /* 使用 flex 布局 */
  justify-content: space-between; /* 两个部分之间平均分配 */
  align-items: center; /* 垂直居中 */
  margin-top: 15px; /* 设置顶部间距 */
  font-size: 10px; /* 设置字体大小 */
  color: #666; /* 设置字体颜色 */
}

.help-stats text:first-child {
  color: #333; /* 第一个文字的颜色 */
  font-weight: bold; /* 第一个文字加粗 */
}

/* Answer Section */
.answer-section {
  margin-top: 150px; /* 设置顶部间距 */
  text-align: center; /* 文本居中 */
  color: #999; /* 设置颜色 */
}

.no-answers {
  font-size: 14px; /* 设置字体大小 */
  margin-bottom: 10px; /* 设置底部间距 */
}

/* Reply Button Section at the Bottom */
.reply-section {
  margin-top: auto; /* 自动推到页面底部 */
  text-align: center; /* 回复按钮居中 */
}

.reply-button {
  background-color: #ff4d4f; /* 设置按钮背景颜色 */
  color: #fff; /* 设置按钮文字颜色 */
  font-size: 16px; /* 设置按钮字体大小 */
  font-weight: bold; /* 设置按钮字体加粗 */
  padding: 10px 20px; /* 设置按钮内边距 */
  border-radius: 20px; /* 设置圆角 */
  border: none; /* 去掉按钮边框 */
  cursor: pointer; /* 鼠标悬停时显示为可点击 */
}
.back-button {
  font-size: 24px; /* 增大箭头图标的字体大小 */
  color: #333; /* 设置箭头颜色 */
  cursor: pointer; /* 鼠标悬停时显示为可点击 */
  border-radius: 50%; /* 让箭头图标变圆润 */ /* 给箭头周围增加一点间距 */
  transition: background-color 0.3s; /* 添加背景色变化效果 */
}
</style>
