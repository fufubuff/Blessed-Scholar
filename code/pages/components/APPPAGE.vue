<template>
  <!-- 定义整个组件的容器视图 -->
  <view class="container">
    <!-- 头部区域 -->
    <view class="header">
      <!-- 显示标题 -->
      <text class="header-title">小研圈</text>
      <!-- 头部图标区域 -->
      <view class="header-icons">
        <!-- 显示一个图标图片 -->
        <image src="C:\Users\86198\Desktop\2.0(1)\xxxx-main\static\search.png" class="icon" />
      </view>
    </view>

    <!-- 标签栏 -->
	<!-- 页面跳转提示：在这个示例中，每个标签和导航项都被包裹在一个<router-link>标签中，to属性指定了点击后应该跳转到的路由路径。你需要确保你的Vue Router配置中有对应的路由定义。 -->
    <view class="tabs">
      <!-- 显示标签“求解答” -->
      <router-link to="/ask" class="tab-item">求解答</router-link>
      <!-- 显示当前激活的标签“加油站” -->
      <router-link to="/fuel" class="tab-item active-tab">加油站</router-link>
      <!-- 显示标签“关注” -->
      <router-link to="/follow" class="tab-item">关注</router-link>
    </view>

   <!-- 横幅区域 -->
   <view class="banner">
     <!-- 显示横幅标题 -->
     <text class="banner-title">21天高数模拟卷打卡活动招募令</text>
     <!-- 显示横幅副标题 -->
     <text class="banner-subtitle">每日一模拟，不模拟就淘汰～</text>
     <!-- 显示另一横幅副标题 -->
     <text class="banner-subtitle">来吧，一起坚持21天，做行动派！</text>
     <!-- 使用router-link替换图片，实现点击跳转 -->
     <router-link to="/detail" class="banner-image-link banner-button">
       <image src="@/static/banner.jpg" class="banner-image" />
     </router-link>
   </view>

    <!-- 帖子列表区域 -->
    <view class="post-list">
		<view class="post" v-for="post in posts" :key="post._id">
      <!-- 帖子1 -->
        <!-- 帖子头部 -->
        <view class="post-header">
          <!-- 显示用户头像 -->
          <image :src="post.images" class="avatar" />
          <!-- 显示用户名 -->
          <text class="username">{{ post._id }}</text>
          <!-- 显示日期 -->
         <text class="date">{{ post.date }}</text>
          <!-- 显示“hot”标签 -->
          <text class="hot-label">hot</text>
        </view>
        <!-- 显示帖子内容 -->
        <text class="post-content">{{ post.content }}</text>
        <!-- 显示帖子图片 -->
        <image :src="post.images" class="post-image" />
        <!-- 帖子操作区域 -->
        <view class="post-actions">
          <!-- 显示操作数（如点赞数） -->
          <view class="action-item" @click="toggleLike(0)">
            <image src=""C:\Users\86198\Desktop\2.0(1)\xxxx-main\static\点赞.png" class="action-icon" />
            <text class="action-text">207</text>
          </view>
          <view class="action-item" @click="toggleLike(1)">
            <image src="C:\Users\86198\Desktop\2.0(1)\xxxx-main\static\heart.png" class="action-icon" />
            <text class="action-text">501</text>
          </view>
          <!-- 显示操作数（如分享数），点击跳转到分享页面 -->
          <router-link to="/share" class="action-item">
            <image src="C:\Users\86198\Desktop\2.0(1)\xxxx-main\static\star.png" class="action-icon" />
            <text class="action-text">789</text>
          </router-link>
          <!-- 显示操作数（如评论数），点击跳转到评论页面 -->
          <router-link to="/comment" class="action-item">
            <image src="C:\Users\86198\Desktop\2.0(1)\xxxx-main\static\chat.png" class="action-icon" />
            <text class="action-text">534</text>
          </router-link>
        </view>

      <!-- 帖子2 -->
      <view class="post">
        <!-- 帖子头部 -->
        <view class="post-header">
          <!-- 显示用户头像 -->
          <image src="@/static/logo.png" class="avatar" />
          <!-- 显示用户名 -->
          <text class="username">柯小布</text>
          <!-- 显示日期 -->
          <text class="date">2024-10-18</text>
        </view>
        <!-- 显示帖子内容 -->
        <text class="post-content">第二周。21天模拟，我已经打卡14天，坚持就是胜利呀~ #21天高数模拟卷打卡#</text>
        <!-- 显示帖子图片集合 -->
        <view class="post-images">
          <!-- 显示多张帖子图片 -->
          <image src="@/static/logo.png" class="note-image" />
          <image src="@/static/logo.png" class="note-image" />
          <image src="@/static/logo.png" class="note-image" />
        </view>
       <!-- 帖子操作区域 -->
       <view class="post-actions">
         <!-- 显示操作数（如点赞数） -->
         <view class="action-item" @click="toggleLike(0)">
           <image src=""C:\Users\86198\Desktop\2.0(1)\xxxx-main\static\点赞.png" class="action-icon" />
           <text class="action-text">207</text>
         </view>
         <view class="action-item" @click="toggleLike(1)">
           <image src="C:\Users\86198\Desktop\2.0(1)\xxxx-main\static\heart.png" class="action-icon" />
           <text class="action-text">501</text>
         </view>
         <!-- 显示操作数（如分享数），点击跳转到分享页面 -->
         <router-link to="/share" class="action-item">
           <image src="C:\Users\86198\Desktop\2.0(1)\xxxx-main\static\star.png" class="action-icon" />
           <text class="action-text">789</text>
         </router-link>
         <!-- 显示操作数（如评论数），点击跳转到评论页面 -->
         <router-link to="/comment" class="action-item">
           <image src="C:\Users\86198\Desktop\2.0(1)\xxxx-main\static\chat.png" class="action-icon" />
           <text class="action-text">534</text>
         </router-link>
       </view>

    <!-- 底部导航栏 -->
    <view class="bottom-nav">
      <!-- 导航项：读书魂 -->
      <router-link to="/read-soul" class="nav-item">
        <image src="@/static/logo.png" class="nav-icon" />
        <text class="nav-text">读书魂</text>
      </router-link>
      <!-- 导航项：小研帮 -->
      <router-link to="/help" class="nav-item">
        <image src="@/static/logo.png" class="nav-icon" />
        <text class="nav-text">小研帮</text>
      </router-link>
      <!-- 导航项：+（当前激活） -->
      <router-link to="/fuel" class="nav-item active">
        <image src="@/static/logo.png" class="nav-icon" />
        
      </router-link>
      <!-- 导航项：小研圈 -->
      <router-link to="/community" class="nav-item">
        <image src="@/static/logo.png" class="nav-icon" />
        <text class="nav-text">小研圈</text>
      </router-link>
      <!-- 导航项：上岸 -->
      <router-link to="/shore" class="nav-item">
        <image src="@/static/logo.png" class="nav-icon" />
        <text class="nav-text">上岸人</text>
      </router-link>
    </view>
	
<script>
// 导出组件的默认对象
export default {
  data() {
    return {
      // 假设每个帖子有两个操作数，初始值分别为207和501
      postActions: [207, 501],
	   posts: [] // 用于存储帖子数据的数组
    };
  },
  created() {
  this.fetchPosts();
},

  methods: {
	  app.get('/api/posts', (req, res) => {
	    // 假设你已经设置好了数据库连接
	    database.collection('posts').find().toArray((err, results) => {
	      if (err) throw err;
	      res.json(results);
	    });
	  }
	  fetchPosts() {
	      // 假设你的API端点是 '/api/posts'
	      fetch('/api/posts')
	        .then(response => response.json())
	        .then(data => {
	          this.posts = data;
	        })
	        .catch(error => console.error('Error fetching posts:', error));
	    }
    toggleLike(index) {
      // 切换点赞或点踩的状态
      this.postActions[index] += 1; // 增加操作数
      // 这里可以添加更多的逻辑，比如改变图标或更新服务器数据
    }
  }
};
</script>

<style>
/* 定义容器的样式，使用 Flexbox 布局，设置背景颜色为白色 */
.container {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

/* 定义头部的样式，使用 Flexbox 布局，两端对齐，设置内边距 */
.header {
  display: flex;
  justify-content: space-between;
  padding: 16px;
}
/* 定义标题的样式，设置字体大小和加粗 */
.header-title {
  font-size: 20px;
  font-weight: bold;
}
/* 定义图标的样式，设置宽度和高度 */
.header-icons .icon {
  width: 24px;
  height: 24px;
}

/* 定义标签栏的样式，使用 Flexbox 布局，平均分布，设置背景颜色和内边距 */
.tabs {
  display: flex;
  justify-content: space-around;
  background-color: #f2f2f2;
  padding: 10px 0;
}
/* 定义标签项的样式，设置文本颜色 */
.tab-item {
  color: #333;
}
/* 定义激活的标签项的样式，设置文本颜色和加粗 */
.active-tab {
  color: #ff5733;
  font-weight: bold;
}

/* 定义横幅的样式，设置背景颜色、内边距和文本居中 */
.banner {
  background-color: #e6f7ff;
  padding: 20px;
  text-align: center;
  background-image: url("C:\Users\86198\Desktop\图片\QQ图片20241009204616.jpg"); /* 添加背景图片 */
  background-size: cover; /* 使背景图片覆盖整个横幅区域 */
  background-position: center; /* 使背景图片居中显示 */
}
/* 定义横幅按钮的样式，使其位于横幅的右下角 */
.banner-button {
  margin-top: 10px;
  background-color: #ff5733;
  color: #ffffff;
  padding: 5px 10px;
  position: absolute; /* 使用绝对定位 */
  top: 100%; /* 从副标题的底部开始定位 */
  right: 0; /* 靠右对齐 */
  z-index: 10; /* 确保按钮显示在横幅图片的顶层 */
}

/* 如果需要，可以为按钮添加一些视觉效果 */
.banner-button .banner-image {
  border-radius: 5px; /* 圆角边框 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* 阴影效果 */
}
/* 定义横幅标题的样式，设置字体大小和加粗 */
.banner-title {
  font-size: 18px;
  font-weight: bold;
}
/* 定义横幅副标题的样式，设置字体大小和文本颜色 */
.banner-subtitle {
  font-size: 14px;
  color: #666;
  position: relative; /* 设置相对定位，以便按钮可以相对于它进行绝对定位 */
}
/* 定义横幅图片的样式，使其看起来像一个按钮 */
.banner-image-link {
  display: block;
  width: 100%; /* 使链接占据整个横幅区域 */
}
.banner-image {
  width: 100%; /* 使图片占据整个链接区域 */
  height: auto; /* 保持图片比例 */
  cursor: pointer; /* 当鼠标悬停时显示指针手形图标 */
}
 

/* 定义帖子列表的样式，设置内边距*/
.post-list {
  padding: 16px;
}
/* 定义帖子的样式，设置背景颜色、内边距、圆角和外边距 */
.post {
  background-color: #ffffff;
  padding: 10px;
  border: 1px solid #ccc; /* 添加边框 */
  border-radius: 5px; /* 设置圆角 */
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}
/* 定义帖子头部的样式，使用 Flexbox 布局，垂直居中 */
.post-header {
  display: flex;
  align-items: center;
}
/* 定义头像的样式，设置宽度、高度和圆角 */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
/* 定义用户名的样式，设置加粗和外边距 */
.username {
  font-weight: bold;
  margin-left: 10px;
}
/* 定义日期的样式 */
.date {
  margin-left: auto;
  color: #888;
}
.hot-label {
  background-color: #ff5733;
  color: #ffffff;
  padding: 2px 5px;
  border-radius: 5px;
}
.post-content {
  margin: 10px 0;
}
.post-image {
  width: 100%;
  margin: 10px 0;
}
.post-actions {
  display: flex;
  justify-content: space-around;
}
/* 定义操作数的样式，设置文本颜色。 */
.action {
  color: #333;
}
/* 定义操作数项的样式 */
.action-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}
/* 定义操作数图标的样式 */
.action-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
/* 定义操作数文本的样式 */
.action-text {
  color: #333;
}

/* Bottom Navigation styles */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  background-color: #f2f2f2; 
   /* 定义底部导航栏的样式，使用 Flexbox 布局，平均分布，设置内边距和背景颜色。 */
}
/* 定义导航项的样式，设置文本居中。 */
.nav-item {
  text-align: center;
}
/* 义导航图标的样式，设置宽度和高度。 */
.nav-icon {
  width: 24px;
  height: 24px;
}
/* 定义导航文本的样式，设置字体大小和外边距。 */
.nav-text {
  font-size: 12px;
  margin-top: 4px;
}
</style>
