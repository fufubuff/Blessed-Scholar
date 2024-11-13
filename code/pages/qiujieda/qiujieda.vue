<template>
  <view class="container">
    <!-- 头部包含标题和搜索按钮 -->
    <view class="header">
      <text class="title">小研圈</text>
      <icon type="search" size="24" class="search-icon" />
    </view>

    <!-- 标签导航 -->
    <view class="tab-bar">
      <view class="tab-container" @click="setActiveTab('求解答')">
        <text class="tab" :class="{ active: activeTab === '求解答' }">求解答</text>
        <view v-if="activeTab === '求解答'" class="underline"></view>
      </view>
      <view class="tab-container" @click="setActiveTab('加油站')">
        <text class="tab" :class="{ active: activeTab === '加油站' }">加油站</text>
        <view v-if="activeTab === '加油站'" class="underline"></view>
      </view>
      <view class="tab-container" @click="setActiveTab('关注')">
        <text class="tab" :class="{ active: activeTab === '关注' }">关注</text>
        <view v-if="activeTab === '关注'" class="underline"></view>
      </view>
    </view>

    <!-- 帖子内容 -->
    <scroll-view scroll-y="true" class="post-list" v-if="activeTab === '求解答'">
      <view v-for="(post, index) in posts" :key="index" class="post">
        <view class="post-container">
          <view class="post-header">
            <image src="/static/logo.png" class="author-avatar" />
            <view class="post-author-info">
              <text class="post-author">{{ post.author }}</text>
              <text class="post-date">{{ post.date }}</text>
            </view>
          </view>
          <view class="post-content">
            <text>{{ post.content }}</text>
            <view class="post-images" v-if="post.images.length">
              <image v-for="(img, idx) in post.images" :src="img" :key="idx" class="post-image" />
            </view>
          </view>
          <view class="post-actions">
            <text class="followers-count">{{ post.followersCount }} 人正在关注</text>
            <button class="answer-button">回答</button>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部导航栏 -->
    <view class="bottom-nav">
      <!-- 每个 nav-item 代表底部导航栏中的一个按钮 -->
      <view class="nav-item" @click="navigateTo('读书魂')">
        <image src="/static/logo.png" class="nav-icon"></image>
        <text class="nav-text">读书魂</text>
      </view>
      <view class="nav-item" @click="navigateTo('小研帮')">
        <image src="/static/logo.png" class="nav-icon"></image>
        <text class="nav-text">小研帮</text>
      </view>
	  <view class="nav-item" @click="navigateTo('研小fu')">
	    <image src="/static/yan小fu.png" class="nav-icon"></image>
	  </view>
      <view class="nav-item" @click="navigateTo('小研圈')">
        <image src="/static/logo.png" class="nav-icon"></image>
        <text class="nav-text">小研圈</text>
      </view>
      <view class="nav-item" @click="navigateTo('上岸人')">
        <image src="/static/logo.png" class="nav-icon"></image>
        <text class="nav-text">上岸人</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: '求解答', // 当前激活的标签
      posts: [ // 帖子数据数组
        {
          author: 'Patisseris Land',
          date: '刚刚发布',
          content: '有没有小伙伴觉得张字老师的高数课，有关概念讲解的有点点难...',
          images: ['/static/logo.png'], // 帖子包含的图片
          followersCount: 15, // 关注人数
          liked: false, // 是否已点赞
          starred: false // 是否已收藏
        },
        {
          author: '柯小布',
          date: '4分钟前',
          content: '各位大佬们有没有英语阅读的学习方法，想用提高一下。赐赐',
          images: [], // 没有图片
          followersCount: 10,
          liked: false,
          starred: false
        },
        {
          author: '骑鱼吃小鱼',
          date: '6分钟前',
          content: '现在数学分指南二刷结束，是看81绝还是看题源...',
          images: [], // 没有图片
          followersCount: 10,
          liked: false,
          starred: false
        }
      ]
    };
  },
  methods: {
    setActiveTab(tab) { // 设置激活的标签
      this.activeTab = tab;
    },
    navigateTo(page) { // 导航逻辑
      // 在这里处理页面导航的逻辑
    }
  }
};
</script>

<style scoped>
.container {
  display: flex; /* 垂直方向排列 */
  flex-direction: column;
  height: 100%; /* 占满父容器 */
}

.header {
  display: flex; /* 水平方向排列 */
  flex-direction: row;
  justify-content: space-between; /* 两端对齐 */
  align-items: center; /* 垂直居中对齐 */
  padding: 10px;
  background-color: white; /* 背景色为白色 */
}

.title {
  font-size: 20px; /* 标题字体大小 */
  font-weight: bold; /* 标题加粗 */
}

.search-icon {
  color: #666; /* 搜索图标颜色 */
  margin-left: auto; /* 自动填充左边距 */
}

.tab-bar {
  display: flex; /* 水平方向排列 */
  flex-direction: row;
  justify-content: space-around; /* 均匀分配 */
  background-color: #f8f8f8; /* 背景色 */
  padding: 10px 0; /* 上下内边距 */
}

.tab {
  color: #666; /* 标签颜色 */
  font-size: 15px; /* 标签字体大小 */
  padding: 10px; /* 内边距 */
  border: none; /* 无边框 */
  background: transparent; /* 背景透明 */
  cursor: pointer; /* 鼠标悬停时显示为指针形状 */
  flex: 1; /* 均分宽度 */
  text-align: center; /* 文本居中 */
}

.tab.active {
  color: red; /* 选中标签颜色 */
  font-weight: bold; /* 选中标签加粗 */
  border-bottom: 2px solid #bd3124; /* 选中标签下划线 */
}

.post-list {
  flex: 1; /* 占据剩余空间 */
  overflow-y: auto; /* 纵向滚动 */
}

.post {
  background-color: #fff; /* 帖子背景色 */
  padding: 10px; /* 内边距 */
  border-radius: 10px; /* 圆角 */
  margin-bottom: 10px; /* 下边距 */
  border: 2px solid #bd3124; /* 帖子边框 */
}

.post-container {
  padding: 10px; /* 内边距 */
}

.post-header {
  display: flex; /* 水平方向排列 */
  align-items: center; /* 垂直居中对齐 */
}

.author-avatar {
  width: 30px; /* 头像宽度 */
  height: 30px; /* 头像高度 */
  border-radius: 50%; /* 圆形头像 */
  margin-right: 10px; /* 右边距 */
}

.post-author-info {
  display: flex; /* 垂直方向排列 */
  flex-direction: column; /* 垂直排列 */
}

.post-author {
  font-weight: bold; /* 作者姓名加粗 */
}

.post-date {
  color: #999; /* 日期颜色 */
  font-size: 12px; /* 日期字体大小 */
}

.post-content {
  margin-top: 10px; /* 上边距 */
}

.post-images {
  display: flex; /* 水平方向排列 */
  margin-top: 10px; /* 上边距 */
}

.post-image {
  width: 70px; /* 图片宽度 */
  height: 70px; /* 图片高度 */
  margin-right: 5px; /* 右边距 */
  border-radius: 4px; /* 圆角 */
}

.post-actions {
  display: flex; /* 水平方向排列 */
  justify-content: space-between; /* 均匀分配 */
  margin-top: 10px; /* 上边距 */
  align-items: center; /* 垂直居中对齐 */
}

.followers-count {
  color: #bd3124; /* 关注人数颜色 */
  font-size: 14px; /* 字体大小 */
}

.answer-button {
  background-color: #f8f8f8; /* 按钮背景色 */
  color: #bd3124; /* 按钮文字颜色 */
  padding: 6px 12px; /* 内边距 */
  border-radius: 15px; /* 圆角 */
  font-weight: bold; /* 加粗按钮文字 */
  border: none; /* 无边框 */
  cursor: pointer; /* 鼠标悬停时为指针形状 */
}

.bottom-nav {
  display: flex; /* 水平方向排列 */
  justify-content: space-around; /* 均匀分配 */
  align-items: center; /* 垂直居中对齐 */
  background-color: #fff; /* 背景色 */
  height: 60px; /* 高度 */
  position: fixed; /* 固定在底部 */
  bottom: 0; /* 距离底部0 */
  width: 100%; /* 宽度100% */
}

.nav-item {
  display: flex; /* 水平方向排列 */
  flex-direction: column; /* 垂直方向排列 */
  align-items: center; /* 居中对齐 */
}

.nav-icon {
  width: 24px; /* 图标宽度 */
  height: 24px; /* 图标高度 */
}

.nav-text {
  font-size: 12px; /* 字体大小 */
  margin-top: 5px; /* 图标和文本之间的间距 */
}
</style>
