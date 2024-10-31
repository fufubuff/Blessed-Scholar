<template>
  <view class="container">
    <view class="header">
		<image class="background-image" :src="backgroundImage" mode="aspectFit"@click="navigateTo('beijinggenghuan')"></image>

      <image class="overlay-image" src="/static/background1.png" @click="navigateTo('beijinggenghuan')"></image>
      <text class="title">个人主页</text>
    </view>
	<view class="content">
	      <!-- 导入 jinengshu.png 图片 -->
	      <image class="skill-tree-detail" :src="skillTreeImageUrl"></image>
	</view>
    <view class="profile">
      <view class="avatar-container">
        <image class="avatar" :src="avatarUrl"></image>
      </view>
        <view class="profile-info">
          <text class="username" @click="navigateTo('bianjiziliao')">{{ username }}</text>
          <text class="intro" @click="navigateTo('bianjiziliao')">{{ signature || '这是我的自我介绍。' }}</text>
          <!-- 在同一行显示“你正在关注”和“有人在意你”以及它们的计数 -->
                  <view class="follow-info">
                    <view class="follow-item">
                      <text class="following" @click="navigateTo('guanzhu')">你正在关注</text>
                      <text class="follow-count">{{ followingCount || 0 }}</text>
                    </view>
                    <view class="follow-item">
                      <text class="stats" @click="navigateTo('fensi')">有人在意你</text>
                      <text class="follow-count">{{ followersCount || 0 }}</text>
                    </view>
                  </view>
		  <text class="following1">福币</text>
		  <image class="fubipaihangbang" src="/static/排行榜.png"></image>
        </view>
    </view>
    <view class="content">
      <image class="skill-tree" src="/static/skill-tree.png"></image>
    </view>
    <view class="button-container">
      <button class="tab-button" @click="activateButton('规划树')">规划树</button>
      <button class="tab-button" @click="activateButton('加油站')">加油站</button>
      <button class="tab-button" @click="activateButton('回答')">回答</button>
      <button class="tab-button" @click="activateButton('打卡')">打卡</button>
      <button class="tab-button" @click="activateButton('收藏')">收藏</button>
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
      username: '加载中...', 
      avatarUrl: '/static/default-avatar.png',
      signature: '',  // 新增的变量，用于存储自我介绍
	  followingCount: 0, // 初始化关注人数
	  followersCount: 0, // 初始化粉丝人数
      activeButton: null,
      skillTreeImageUrl: '/static/jinengshu.png',
    };
  },
  
  
  mounted() {
  this.username = uni.getStorageSync('username') || '默认用户名';
  this.fetchData();
},

methods: {
	mounted() {
	  this.fetchUserInfo(); // 每次进入页面时都获取用户信息
	},
	
  async fetchData() {
    try {
      const account = uni.getStorageSync('account');
      if (!account) {
        uni.navigateTo({ url: '/pages/login/login' });
        return;
      }

      const res = await uniCloud.callFunction({
        name: 'getUserInfo',
        data: { account: account }
      });

      if (res.result.success) {
        this.username = res.result.data.nickname; 
        this.avatarUrl = res.result.data.avatarUrl;
        this.signature = res.result.data.signature; 
        this.followingCount = res.result.data.followingCount || 0;
        this.followersCount = res.result.data.followersCount || 0;
      } else {
        console.error(res.result.message);
      }
    } catch (error) {
      console.error('获取用户信息失败', error);
    }
  },

  navigateTo(page) {
    const pages = {
      guanzhu: '/pages/guanzhu/guanzhu',
      fensi: '/pages/fensi/fensi',
      bianjiziliao: '/pages/bianjiziliao/bianjiziliao',
      index: '/pages/index/index',
      beijinggenghuan: '/pages/beijinggenghuan/beijinggenghuan'
    };
    if (pages[page]) {
      uni.navigateTo({ url: pages[page] });
    }
  }
},

    activateButton(button) {
      this.activeButton = button;
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
  flex: 1;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.skill-tree {
  width: 100%;  /* Adjust based on your design needs */
  height: auto; /* Maintains the aspect ratio */
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
  font-size: 16px;
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

.skill-tree-detail{
	bottom: -260px;
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

.follow-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* 确保容器宽度 */
  margin-top: 85px; /* 与上方内容的间距 */
}

.follow-item {
  display: flex;
  align-items: center;
  margin-right: 65px; /* 增加每个follow-item之间的间距 */
}

.following, .stats {
  font-size: 12px;
  color: #666;
}

.follow-count {
  font-size: 12px;
  color: red; /* 设置为红色 */
  font-weight: bold; /* 加粗 */
  margin-left: 28px; /* 与文字保持一点距离 */
}
</style>