<template>
  <view class="container">
  	<view style="height: 20px;"></view>
    <!-- Header with title and search button -->
    <view class="header">
      <text class="title">小研圈</text>
      <icon type="search" size="24" class="search-icon" />
    </view>
  
    
    <!-- Tab Navigation -->
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
<!-- 可滚动的帖子列表容器，只有在 activeTab 为 '求解答' 时显示 -->
<scroll-view scroll-y="true" class="post-list" v-if="activeTab === '求解答'">
  <!-- 遍历 posts 数组，渲染每个帖子 -->
  <view v-for="(post, index) in posts" :key="index" class="post">
    <!-- 帖子的主体内容容器 -->
    <view class="post-container">
      <!-- 帖子的头部，包含作者头像和作者信息 -->
      <view class="post-header">
        <!-- 显示作者的头像，若加载失败则调用 handleImageError 方法 -->
        <image :src="post.authorAvatar" class="author-avatar" @error="handleImageError"/>
        
        <!-- 显示作者名称和发帖时间 -->
        <view class="post-author-info">
          <text class="post-author">{{ post.author }}</text> <!-- 显示作者名称 -->
          <text class="post-date">{{ post.date }}</text> <!-- 显示发帖日期 -->
        </view>
      </view>
      
      <!-- 帖子的内容部分 -->
      <view class="post-content">
        <!-- 显示帖子的文字内容 -->
        <text>{{ post.content }}</text>
        
        <!-- 如果帖子有图片，则显示图片 -->
        <view class="post-images" v-if="post.images.length">
          <!-- 遍历图片数组，显示每张图片 -->
          <image v-for="(img, idx) in post.images" :src="img" :key="idx" class="post-image" @error="handleImageError" />
        </view>
      </view>
      
      <!-- 帖子的操作区域，显示关注人数和回答按钮 -->
      <view class="post-actions">
        <!-- 显示关注人数 -->
        <text class="followers-count">{{ post.followersCount }} 人正在关注</text>
        
        <!-- 点击回答按钮跳转到回答页面 -->
        <button class="answer-button" @click="navigateTo('postxijie')">回答</button>
      </view>
    </view>
  </view>
</scroll-view>


<!-- 在底部导航栏外面添加一个新图片元素，右下方 -->
<view class="bottom-right-img" @click="navigateTo('publish')">
  <image src="/static/0000.png" class="image-icon" />
</view><!-- 图片可以更改 -->

    <!-- 底部导航栏 -->


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
          uni.reLaunch({
          				url:"/pages/attention/attention"
          			})
        }
        if (tab === '加油站') {
          uni.reLaunch({
          				url:"/pages/jiayouzhan/jiayouzhan"
          			})
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
  if (page === '加油站') {
    uni.navigateTo({
      url: '/pages/jiayouzhan/jiayouzhan'
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
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #F8F8F8;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  background-color: white;
  align-items: center;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
.search-icon {
  font-size: 13px;
  color: #666;
}
.tab-bar {
  display: flex;
  flex-direction: row;
  font-weight: bold;
  justify-content: space-around;
  background-color: #f8f8f8;
  padding: 10px 0;
  position: relative;
}
.tab {
  color: #666;
  font-size: 15px;
  position: relative;
}

.tab.active {
  color: red; /* 选中标签颜色 */
  font-weight: bold; /* 选中标签加粗 */
  border-bottom: 2px solid red; /* 选中标签下划线 */
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
  width: 100px; /* 图标宽度 */
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
