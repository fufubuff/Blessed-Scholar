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
            <image :src="post.authorAvatar" class="author-avatar" @error="handleImageError" />

            <view class="post-author-info">
              <text class="post-author">{{ post.author }}</text>
              <text class="post-date">{{ post.date }}</text>
            </view>
          </view>
          <view class="post-content">
            <text>{{ post.content }}</text>
			
<view class="post-images" v-if="post.images.length">
  <image v-for="(img, idx) in post.images" :src="img" :key="idx" class="post-image" @error="handleImageError" />
</view>

          </view>
          <view class="post-actions">
            <text class="followers-count">{{ post.followersCount }} 人正在关注</text>
            <button class="answer-button"@click="navigateTo('postxijie')">回答</button>
          </view>
        </view>
      </view>
    </scroll-view>

<!-- 在底部导航栏外面添加一个新图片元素，右下方 -->
<view class="bottom-right-img" @click="navigateTo('publish')">
  <image src="/static/logo.jpg" class="image-icon" />
</view><!-- 图片可以更改 -->

    <!-- 底部导航栏 -->
<view class="bottom-nav">
  <view class="nav-item" :class="{ active: activeNav === '读书魂' }" @click="navigateTo('读书魂')">
    <image src="/static/读书魂.png" class="nav-icon"></image>
    <text class="nav-text">读书魂</text>
  </view>
  <view class="nav-item" :class="{ active: activeNav === '小研帮' }" @click="navigateTo('小研帮')">
    <image src="/static/小研帮.png" class="nav-icon"></image>
    <text class="nav-text">小研帮</text>
  </view>
  <view class="nav-item" :class="{ active: activeNav === '研小fu' }" @click="navigateTo('研小fu')">
    <image src="/static/研小fu.png" class="nav-icon"></image>
  </view>
  <view class="nav-item" :class="{ active: activeNav === '小研圈' }" @click="navigateTo('小研圈')">
    <image src="/static/小研圈.png" class="nav-icon"></image>
    <text class="nav-text">小研圈</text>
  </view>
  <view class="nav-item" :class="{ active: activeNav === 'zhuyehuodong' }" @click="navigateTo('zhuyehuodong')">
    <image src="/static/上岸人.png" class="nav-icon"></image>
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
      posts: [], // 帖子数据数组，将从云数据库获取
      activeNav: '' // 当前激活的底部导航项
    };
  },
  mounted() {
    // 在页面加载完成时调用云函数获取帖子内容
    this.fetchPosts();
  },
  methods: {
    // 设置激活的标签
    setActiveTab(tab) {
      this.activeTab = tab;
      if (tab === '关注') {
        uni.navigateTo({
          url: '/pages/attention/attention' // 跳转到关注页面
        });
      }
    },async fetchPosts() {
  try {
    const res = await uniCloud.callFunction({
      name: 'getPosts'
    });

    // 打印响应结果，帮助调试
    console.log('云函数响应结果：', res);

    // 检查响应结果是否符合预期
    if (res && res.result && res.result.success) {
      // 如果成功，设置帖子数据
      this.posts = res.result.data;
    } else {
      // 如果不成功，输出错误详情
      console.error('获取帖子数据失败：', res.result);
      uni.showToast({ title: '数据获取失败', icon: 'none' });
    }
  } catch (error) {
    // 打印详细的错误信息，帮助调试
    console.error('云函数调用失败:', error);
    
    // 提示用户网络或服务器问题
    if (error.message && error.message.includes('timeout')) {
      uni.showToast({ title: '请求超时，请稍后再试', icon: 'none' });
    } else {
      // 如果是其他错误，显示更详细的错误信息
      uni.showToast({ title: `系统错误：${error.message}`, icon: 'none' });
    }
  }
}
,
    // 跳转到指定页面
navigateTo(page) {
  console.log(`Navigating to: ${page}`);
  this.activeNav = page;
  if (page === 'attention') {
    uni.navigateTo({
      url: '/pages/attention/attention'
    });
  } else if (page === 'publish') {
    console.log('Attempting to navigate to publish page...');
    uni.navigateTo({
      url: '/pages/publish/publish'
    });
  } 
  else if (page === 'postxijie') {
    console.log('Attempting to navigate to publish page...');
    uni.navigateTo({
      url: '/pages/postxijie/postxijie'
    });
  } 
  else {
    uni.navigateTo({
      url: `/pages/${page}/${page}`
    });
  }
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
  border: 2px solid #FFFFFF; /* 帖子边框 */
  border-bottom: 2px solid #bd3124;
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

.nav-item.active {
  border: 2px solid red; /* 激活项添加红色边框 */
}
.nav-icon {
  width: 24px; /* 图标宽度 */
  height: 24px; /* 图标高度 */
}
.nav-item .activeIcon {
  filter: brightness(0) saturate(100%) invert(38%) sepia(72%) saturate(445%) hue-rotate(0deg) brightness(102%) contrast(101%); /* 变为红色 */
}
.nav-text {
  font-size: 12px; /* 字体大小 */
  margin-top: 5px; /* 图标和文本之间的间距 */
}

.bottom-nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 60px; /* 导航栏高度 */
  background-color: #FFFFFF; /* 导航栏背景颜色 */
  border-top: 1px solid white; /* 导航栏上方的黑色水平线 */
  position: fixed; /* 固定在底部 */
  bottom: 0;
  width: 100%;
}


/* 导航项样式 */
.nav-item {
  display: flex;
  flex-direction: row;
  flex-direction: column;
  align-items: center;
}
.nav-item.active {
  border: 2px solid red; /* 激活态红色边框 */
}

/* 导航图标样式 */
.nav-icon {
  width: 24px;
  height: 24px;
}

/* 导航文本样式 */
.nav-text {
  margin-top: 5px;
  font-size: 12px;
  color: #000000;
}

/* 修改第三个导航项的样式为圆角矩形填充为暗红色 */
.nav-item:nth-child(3) {
  width: 70px; /* 圆角矩形的宽度 */
  height: 40px; /* 圆角矩形的高度 */
  background-color: #bd3124; /* 填充颜色为暗红色 */
  border-radius: 15px; /* 圆角半径为20px */
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
}

/* 第三个导航项中的加号样式 */
.nav-item:nth-child(3)::before {
  content: '+'; /* 加号字符 */
  color: white; /* 加号颜色为白色 */
  font-size: 24px; /* 加号大小 */
  font-weight: bold; /* 加号加粗 */
}

/* 移除第三个导航项的图片 */
.nav-item:nth-child(3) .nav-icon {
  display: none;
}
.bottom-right-img {
  position: fixed; /* 固定在屏幕右下角 */
  right: 37px; /* 距离右边10px */
  bottom: 77px; /* 距离底部10px */
  z-index: 9999; /* 确保在最上层 */
}

.image-icon {
  width: 60px; /* 你可以根据需要调整图片的大小 */
  height: 60px;
}

</style>
