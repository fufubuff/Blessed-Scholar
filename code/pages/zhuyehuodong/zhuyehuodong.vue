<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <image class="background-image" src="/static/background.png"></image>
      <image class="overlay-image" src="/static/background1.png"></image>
      <text class="title">个人主页</text>
	   <image
	          class="settings-icon"
	          src="/static/shezhi.jpg"
	          @click="navigateToSettings"
	        ></image>
    </view>
     
    <!-- 个人资料 -->
    <view class="profile">
      <view class="avatar-container">
        <image class="avatar" :src="avatarUrl"></image>
      </view>
      <view class="profile-info">
        <text class="username" @click="navigateTo('bianjiziliao')">{{ username }}</text>
        <text class="intro" @click="navigateTo('bianjiziliao')">这是我的自我介绍。</text>
        <text class="following" @click="navigateTo('guanzhu')">你正在关注</text>
        <text class="stats" @click="navigateTo('fensi')">有人在意你</text>
        <image class="fubipaihangbang" src="/static/排行榜.png"></image>
      </view>
    </view>

    <!-- 按钮 -->
    <view class="button-container">
      <view class="tab-button" :class="{ active: activeButton === '规划树' }" @click="activateButton('规划树')">规划树</view>
      <view class="tab-button" :class="{ active: activeButton === '加油站' }" @click="activateButton('加油站')">加油站</view>
      <view class="tab-button" :class="{ active: activeButton === '回答' }" @click="activateButton('回答')">回答</view>
      <view class="tab-button" :class="{ active: activeButton === '打卡' }" @click="activateButton('打卡')">打卡</view>
     
	  <view class="tab-button" :class="{ active: activeButton === '收藏' }" @click="activateButton('收藏')">收藏</view>
    <view class="tab-button" :class="{ active: activeButton === '活动' }" @click="activateButton('活动')">活动</view>
	</view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 打卡内容 -->
      <view v-if="activeButton === '打卡'" class="check-in-section">
        <view class="check-in-card">
          <!-- 累计打卡 -->
          <view class="check-in-summary">
            <image src="/static/target-icon.png" class="summary-icon"></image>
            <text class="check-in-title">你已累计打卡</text>
            <text class="check-in-days">100 天</text>
          </view>
          <view class="check-in-divider"></view>
          <!-- 今日语律 -->
          <view class="check-in-today">
            <view class="today-summary">
              <image src="/static/quote-icon.png" class="summary-icon"></image>
              <text class="check-in-today-title">今日语律</text>
              <text class="check-in-today-subtitle">研小fu为你助力！</text>
            </view>
            <text class="check-in-quote">Never say never!</text>
          </view>
          <!-- 查看打卡记录按钮 -->
          <view class="check-in-record">
            <text @click="navigateTo('dakajilu')" class="check-in-record-link">点击查看打卡记录</text>
          </view>
        </view>
      </view>
	  
     <view v-if="activeButton === '规划树'" class="skill-tree-section">
         <!-- 显示本地图片 -->
         <image src="/static/jinengshu.png" class="skill-tree-image" alt="规划树图片"></image>
       </view>

      <!-- 加油站内容 -->
      <view v-if="activeButton === '加油站'">
        <!-- 加油站的内容 -->
      </view>

      <!-- 回答内容 -->
      <view v-if="activeButton === '回答'">
        <!-- 回答的内容 -->
      </view>
	  

      <view v-if="activeButton === '收藏'" class="collection-section">
		  
          <!-- 收藏子选项卡 -->
          <view class="sub-tab-container">
            <view class="sub-tab-button" :class="{ active: activeSubTab === '题库' }" @click="activateSubTab('题库')">题库</view>
            <view class="sub-tab-button" :class="{ active: activeSubTab === '课程' }" @click="activateSubTab('课程')">课程</view>
            <view class="sub-tab-button" :class="{ active: activeSubTab === '快讯' }" @click="activateSubTab('快讯')">快讯</view>
            <view class="sub-tab-button" :class="{ active: activeSubTab === '加油站' }" @click="activateSubTab('加油站')">加油站</view>
            <view class="sub-tab-button" :class="{ active: activeSubTab === '求解答' }" @click="activateSubTab('求解答')">求解答</view>
          </view>
          <!-- 收藏内容卡片 -->
          <view class="collection-content">
			  
            <view v-for="(item, index) in filteredCollectionItems" :key="index" class="collection-card">
              
				<view class="collection-header">
				  <view class="title-line"></view> <!-- 添加一个竖线装饰 -->
				  <text class="collection-title">{{ item.title }}</text>
				  <image src="/static/more.png" class="more-icon"></image>
				</view>
             
              <text class="publisher">发布人：{{ item.publisher }}</text>
            </view>
          </view>
        </view>
      </view>
	    <view v-if="activeButton === '活动'" class="activity-section">
	            <view v-for="(activity, index) in activities" :key="index" class="activity-card" :class="{'active': activity.status === '正在参与', 'ended': activity.status === '已结束'}">
	              <!-- 左侧的竖线装饰 -->
	              <view class="left-line"></view>
	              <!-- 活动标题 -->
	              <text class="activity-title">{{ activity.title }}</text>
	              <!-- 更多图标 -->
	              
	              <!-- 发起人信息 -->
	              <text class="initiator">发起人：{{ activity.initiator }}</text>
	              <!-- 活动状态 -->
	              <view class="status-label">{{ activity.status }}</view>
	            </view>
	          </view>
    <!-- 底部导航栏 -->
    <view class="bottom-nav">
      <view class="nav-item" @click="navigateTo('读书魂')">
        <image src="/static/读书魂.png" class="nav-icon"></image>
        <text class="nav-text">读书魂</text>
      </view>
      <view class="nav-item" @click="navigateTo('小研帮')">
        <image src="/static/小研帮.png" class="nav-icon"></image>
        <text class="nav-text">小研帮</text>
      </view>
      <view class="nav-item" @click="navigateTo('研小fu')">
        <image src="/static/研小fu.png" class="nav-icon"></image>
      </view>
      <view class="nav-item" @click="navigateTo('小研圈')">
        <image src="/static/小研圈.png" class="nav-icon"></image>
        <text class="nav-text">小研圈</text>
      </view>
      <view class="nav-item" @click="navigateTo('index')">
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
	  activeButton: '收藏', // 默认选中“收藏”
	        // 新增活动列表数据
	        activities: [
	          {
	            title: '21天高数模拟卷打卡活动',
	            initiator: '小研',
	            status: '正在参与',
	          },
	          {
	            title: '考研助力企划',
	            initiator: '小研',
	            status: '已结束',
	          },],
      username: '加载中...', 
      avatarUrl: '/static/default-avatar.png',
      activeButton: '收藏', // 默认选中“收藏”
      activeSubTab: '题库', // 默认选中“题库”子选项卡
      collectionItems: [
            {
              type: '题库',
              title: '2024年考研数1',
              publisher: '小研',
            },
            {
              type: '课程',
              title: '高数精讲',
              publisher: '小研',
            },
      ],
    };
  },
  
  
 computed: {
   filteredCollectionItems() {
     return this.collectionItems.filter(item => item.type === this.activeSubTab);
   },
 },


  mounted() {
    this.fetchData();
  },
   
   
    
  methods: {
	  openMoreOptions(item) {
	      // 打开更多操作菜单，可能是编辑、删除、分享等功能
	      console.log('更多操作', item);
	    },
	  activateSubTab(subTab) {
	      this.activeSubTab = subTab;
	    },
    async fetchData() {
      try {
        // 从本地存储中获取 account 信息
        const account = uni.getStorageSync('account');
        if (!account) {
          // 如果没有 account 信息，则跳转到登录页面
          uni.navigateTo({
            url: '/pages/login/login'
          });
          return;
        }

        // 调用云函数 getUserInfo 并传递 account 信息
        const res = await uniCloud.callFunction({
          name: 'getUserInfo',
          data: { account: account }
        });
        if (res.result.success) {
          this.username = res.result.data.username;
          this.avatarUrl = res.result.data.avatarUrl;
        } else {
          console.error(res.result.message);
        }
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    },
    navigateTo(page) {
      if (page === 'guanzhu') {
        uni.navigateTo({
          url: '/pages/guanzhu/guanzhu'
        });
      } else if (page === 'fensi') {
        uni.navigateTo({
          url: '/pages/fensi/fensi'
        });
      } else if (page === 'bianjiziliao') {
        uni.navigateTo({
          url: '/pages/bianjiziliao/bianjiziliao'
        });
      } else if (page === 'index') {
        uni.navigateTo({
          url: '/pages/index/index'
        });
      } else if (page === 'dakajilu') {
        uni.navigateTo({
          url: '/pages/dakajilu/dakajilu'
        });
      }
      // 处理其他页面的导航逻辑
    },
    navigateToSettings() {
          uni.navigateTo({
            url: '/pages/shezhi/shezhi',
          });
        },
	activateButton(button) {
	    this.activeButton = button;
	    if (button === '收藏') {
	      this.activeSubTab = '题库'; // 点击“收藏”时，默认选中“题库”子选项卡
	    }
	  },
	  activateSubTab(subTab) {
	    this.activeSubTab = subTab;
	  },

  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  margin: 0; /* Reset any default margins */
  padding: 0; /* Reset any default padding */
}

.header {
  position: relative;
  width: 100%;
  height: 200px; /* 保持高度不变 */
  text-align: center;
  color: #fff;
  background-image: url('/static/background1.png'), url('/static/background.png');
  background-position: center top, center top; /* 保持背景图像位置不变 */
  background-size: cover, cover; /* 保持背景图像大小不变 */
  margin: 0; /* 移除默认外边距 */
  padding: 0; /* 移除默认内边距 */
  /* 新增样式以移除顶部留白 */
  top: 0; /* 将头部容器固定在顶部 */
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* 其他样式 */
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.overlay-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1; /* 确保这个图像位于 background-image 之上 */
}

.background-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.title {
  position: absolute;
  bottom: 160px; /* Position title at the bottom of the header */
  width: 100%;
  left: 0;
  font-size: 16px;
  z-index: 9;
  font-weight: bold; /* Add this line to make the text bold */
}

.profile {
  display: flex;
  width: 80%;  /* 控制宽度为父容器宽度的90%，留出两侧空白以形成间隙 */
  height: 90px; /* 设置新的高度 */
  align-items: center;
  margin-top: 80px; /* 上移，部分覆盖头部容器 */
  margin-bottom: 20px; /* 下边距 */
  margin-left: 5%; /* 左边距 */
  margin-right: 5%; /* 右边距，确保左右间距相等，也可调整为具体px值 */
  background-color: #FFF; /* 背景颜色为白色 */
  padding: 20px 20px 20px 20px; /* 内边距，确保内容不会紧贴边缘，上下左右均为20px */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 阴影效果，增加立体感 */
  border-radius: 15px; /* 边框圆角，设置为15px，制造圆角效果 */
  position: absolute; /* 相对定位，允许内部的avatar-container绝对定位相对于此元素 */
  z-index: 2;
}

.avatar-container {
  width: 70px;
  height: 70px;
  border-radius: 35px; /* Half of width and height to make it round */
  overflow: hidden;
  border: 2px solid #FFFFFF; /* White border around the avatar */
  box-shadow: 0 2px 4px rgba(0,0,0,0.25); /* Shadow for depth */
  position: absolute;
  left: 20%;
  transform: translateX(-50%); /* Move it half outside the left border */
  top: -35%; /* Increase this value to move the avatar down */
  z-index: 2;
}

.avatar {
  width: 100%;
  height: 100%;
}

.profile-info {
  display: flex;
  flex-direction: column; /* 设置为垂直排列 */
  align-items: flex-start; /* 左对齐 */
  margin-left: 50px; /* Make space for the avatar */
}

.username {
  font-size: 18px;
  color: #333;
  position: absolute; /* 或者使用 absolute，根据你的布局需求 */
  left: 30px; /* 向左移动 10px */
  bottom: 65px; /* 向下移动 10px */
}

.intro {
  position: absolute; /* 绝对定位 */
  top: 75px; /* 顶部位置 */
  left: 30px; /* 左侧位置 */
  font-size: 12px;
  color: #333;
}

.following {
  position: absolute; /* 绝对定位 */
  top: 100px; /* 顶部位置 */
  left: 30px; /* 左侧位置 */
  font-size: 12px;
  color: #666;
}

/* 修改 .stats 文本样式 */
.stats {
  position: absolute; /* 绝对定位 */
  top: 100px; /* 顶部位置 */
  left: 130px; /* 左侧位置 */
  font-size: 12px;
  color: #666;
}

.following1 {
  position: absolute; /* 绝对定位 */
  top: 100px; /* 顶部位置 */
  left: 230px; /* 左侧位置 */
  font-size: 12px;
  color: #666;
}

.fubipaihangbang {
  width: 6%;
  height: 13%;
  position: absolute;
  top: 100px;
  left: 290px;
  z-index: 12;
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
  margin-top: 120px;
  margin-left: -20px; /* 负值使元素向左移动，调整数值达到理想位置 */
}




.skill-tree-section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 150px; /* 确保规划树内容与顶部有合适的间距 */
}

.skill-tree-detail {
  width: 80%; /* 设置图片宽度以保证在各种屏幕上可见 */
  height: auto; /* 保持图片的宽高比 */
  max-width: 400px; /* 限制最大宽度，防止在大屏幕上过大 */
}


.button-container {
  position: absolute; /* Position can be absolute if needed */
  display: flex;
  border: none;
  box-shadow: none;
  justify-content: space-around;
  align-items: center;
  width: 100%; /* Adjustable width */
  height: 15px;
  padding: 10px 0;
  background-color: #FFFFFF;
  margin-top: 0px; /* Adjust this to move the container up or down */
  border-radius: 0px; /* Adjust border-radius for rounded corners */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Optional shadow for depth */
  bottom: 360px;
}

.tab-button {
  background-color: transparent !important; /* 确保背景透明 */
  border: none !important; /* 确保没有边框 */
  color: grey; /* 默认颜色为灰色 */
  padding: 10px 15px;
  font-size: 13.5px;
  outline: none;
}

.tab-button.active {
  color: red !important; /* 点击后文本颜色变为红色 */
}

.button-container button::before,
.button-container button::after {
  border: none !important;
  background: none !important;
}

.bottom-nav {
  display: flex;
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
  flex-direction: column;
  align-items: center;
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
.check-in-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin-top: 150px; /* 确保有合适的上间距 */
}

.check-in-card {
  width: 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 120px; /* 保证卡片与下方内容有一定的间距 */
}

.check-in-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.summary-icon {
  width: 24px;
  height: 24px;
  margin-right: 30px;
}

.check-in-title {
  font-size: 16px;
  color: #bd3124;
  font-weight: bold;
}

.check-in-days {
  font-size: 48px;
  font-weight: bold;
  color: #bd3124;
  margin-top: 5px;
}

.check-in-divider {
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 20px 0;
}

.check-in-today {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.today-summary {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.check-in-today-title {
  font-size: 16px;
  color: #bd3124;
  font-weight: bold;
  margin-right: 15px;
}

.check-in-today-subtitle {
  font-size: 10px;
  color: #666;
}

.check-in-quote {
  font-size: 18px;
  color: #333;
  font-style: italic;
  margin-top: 5px;
}

.check-in-record {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.check-in-record-link {
  font-size: 14px;
  color: #bd3124;
  text-decoration: underline;
  cursor: pointer;
}

.check-in-record-link:hover {
  color: #a0291e;
}

/* 收藏区域样式 */
.collection-section {
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
   margin-top: 130px; 
}

.collection-card {
  background-color: #fff; /* 白色背景 */
  border-radius: 10px; /* 圆角边框，10px 可根据需要调整 */
  padding: 15px; /* 内边距 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果，增加立体感 */
  margin-bottom: 15px; /* 卡片之间的间距 */
  position: relative;
}


.collection-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-line {
  width: 4px; /* 竖线宽度 */
  height: 20px; /* 竖线高度，根据需要调整 */
  background-color: #000; /* 竖线颜色，黑色 */
  margin-right: -180px; /* 竖线和标题之间的间距 */
  align-self: center; 
}

.collection-title {
  font-size: 16px;
  font-weight: bold;
  color: #333; /* 黑色字体 */
}


.more-icon {
  width: 20px;
  height: 20px;
}

.publisher {
  font-size: 14px;
  color: #888;
  margin-top: 10px;
}
/* 收藏子选项卡样式 */


.sub-tab-button {
  font-size: 14px;
  color: grey;
}

.sub-tab-button.active {
  color: black;
}
.more-icon {
  width: 20px;
  height: 20px;
  cursor: pointer; /* 鼠标移到图标上时显示手形指针，表示可点击 */
}
/* 修改未选中状态下的标签颜色为灰色 */

.sub-tab-container {
  display: inline-flex; /* 使用 inline-flex，让按钮靠左排列 */
  flex-wrap: wrap;      /* 如果按钮很多，允许换行 */
  background-color: #FFFFFF;
  padding: 10px;           /* 去掉多余的内边距 */
  margin: 0;            /* 去掉与上一行的外边距 */
  border-bottom: 1px solid #e0e0e0;
}

.sub-tab-button {
  font-size: 12px;
  color: grey;  /* 默认颜色为灰色 */
  cursor: pointer;  /* 鼠标变为手形指针，提示可以点击 */
  padding: 5px 10px; /* 设置适当的内边距 */
  margin: 6px 3px; /* 增加上下间距为 10px，左右间距为 10px */
  transition: color 0.3s ease; /* 添加过渡效果 */
}

.sub-tab-button.active {
  color: black;  /* 被激活时变为黑色 */
}

/* 活动模块样式 */
.activity-section {
  width: 100%;
  padding: 10px;
  margin-top: 130px; /* 根据需要调整与顶部的间距 */
}

.activity-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 左侧的竖线装饰 */
.left-line {
  width: 4px;
  height: 100%;
  background-color: #bd3124; /* 默认红色 */
  position: absolute;
  left: 0;
  top: 0;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

/* 活动标题样式 */
.activity-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-left: 10px; /* 给标题留出左侧空间，避免与竖线重叠 */
}

/* 更多图标样式 */


/* 发起人信息样式 */
.initiator {
  font-size: 9px;
  color: #888;
  margin-top: 10px;
  margin-left: 10px; /* 与标题左对齐 */
}

/* 活动状态标签样式 */
.status-label {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

/* 根据活动状态改变样式 */
.activity-card.active .status-label {
  color: #bd3124;
  border: 1px solid #bd3124;
}

.activity-card.ended .status-label {
  color: #888;
  border: 1px solid #888;
}
.settings-icon {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50px;
  right: 3px;
  z-index: 10;
}
/* 根据活动状态改变左侧竖线的颜色 */
.activity-card.ended .left-line {
  background-color: #888;
}
</style>
