<template>
  <view class="container">
    <!-- 背景图片 -->
    <div class="header-image">
		<img :src="imageSrc" alt="Fub Rank" />
		<!-- 灰色遮罩层 -->
		<div class="overlay"></div> 
    </div>
	
	<!-- 遮罩层和标题 -->
	<div class="overlay-title">
	    <h1>{{ username }} 功德已拉满</h1>
	</div>

    <!-- 排行榜 -->
    <view class="leaderboard">
      <view class="user" v-for="user in users" :key="user.user_id">
        <view class="avatar">
          <image :src="user.avatarUrl" mode="aspectFill" />
        </view>
        <view class="username">{{ user.nickname }}</view>
        <!-- 中间：福币数和福币logo -->
        <view class="fub-info">
          <image src="/static/fub-logo.webp" class="fub-logo" />
          <text class="fub-amount">{{ user.score }} 福币</text>
        </view>
        <view class="rank">{{ user.rank }}</view>
      </view>
    </view>

    <view class="current-user" @click="goToMyFub">
      <view class="avatar">
        <image :src="currentUser.avatarUrl" mode="aspectFill" />
      </view>
      <view class="username">{{ '我' }}</view>
      <view class="fub-info">
        <image src="/static/fub-logo.webp" class="fub-logo" />
        <text class="fub-amount">{{ currentUser.score || 0 }} 福币</text>
      </view>
      <view class="rank">{{ currentUser.rank || '-' }}</view>
    </view>
	
	<!-- 返回按钮 -->
	<view class="back-btn" @click="goBack">
	    <image src="/static/back-icon.png" alt="Back" />
	</view>
	
	<!-- 福小铺按钮 -->
	<view class="shop-button" @click="goToShop"></view>
	
  </view>
</template>

<script>
export default {
  data() {
    return {
	  imageSrc: '/static/bghxy.jpg',
      users: [], // 排行榜用户数据
      currentUser: {} ,// 当前用户信息
	  username: '' // 排名第一用户的用户名
    };
  },
  async created() {
    await this.fetchLeaderboardData(); // 获取排行榜数据
  },
  methods: {
    async fetchLeaderboardData() {
  try {
    const userId = uni.getStorageSync('user_id'); // 获取当前用户的 user_id
    if (!userId) {
      console.error('user_id not found in local storage');
      uni.showToast({ title: '用户未登录', icon: 'none' });
      return;
    }

    const response = await uniCloud.callFunction({
      name: 'getLeaderboard',
      data: { user_id: userId }
    });

    console.log("Cloud function response:", response); // 调试输出云函数返回值

    if (response.result && response.result.code === 0) {
      this.users = response.result.data.users;
      this.currentUser = response.result.data.currentUser || {};
	  this.username = this.users.length > 0 ? this.users[0].nickname : ''; // 获取排名第一用户的用户名
    } else {
      console.error('Failed to fetch leaderboard data:', response.result.msg);
      uni.showToast({ title: '获取排行榜数据失败', icon: 'none' });
    }
  } catch (error) {
    uni.showToast({ title: '获取排行榜失败', icon: 'none' });
    console.error(error);
  }
  },

    goToMyFub() {
      const userId = uni.getStorageSync('user_id'); // 获取当前用户的 user_id
      uni.navigateTo({
        url: `/pages/myFub/myFub?user_id=${userId}`
      });
  },
  
    goToShop() {
        uni.navigateTo({
          url: '/pages/xiaofupu/xiaofupu'  
        });
      },
  
  // 返回上一个页面
      goBack() {
        uni.navigateBack(); // 返回上一页
      }
    }
  
};
</script>

<style>
.container {
  position: relative;
  //width: 100%;
  //height: 100%;
  //background-color: #fff;

}

/* 背景图片 */
.header-image {
  position: relative;
  width: 100%;
  height: 230px;
}

.header-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 遮罩层和标题 */
.overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
  z-index: 0;
}


.overlay-title {
  position: absolute;
    top: 10px; /* 距离顶部一点点 */
    left: 50%;
    transform: translateX(-50%);
    color: white;
    text-align: center;
    font-size: 10px;
    z-index: 1; /* 确保标题在遮罩层上方 */
}


/* 排行榜 */
.leaderboard {
  position: relative;
  width: 90%;
  margin-top: -10%; /* 排行榜紧跟在背景图片下方 */
  padding: 15px 10px;
}

/* 每个用户条目 */
.user {
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  background-color: #fff; /* 设置白色背景色以和阴影形成对比 */
  margin-bottom: 5px; /* 每个条目之间增加间距 */
}

/* 固定底部的“我的条目” */
.current-user {
  position: fixed;
  bottom: 20px;
  width: 90%;
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  background-color: #f2f2f2; /* 设置白色背景色以和阴影形成对比 */
  margin-bottom: 5px; /* 每个条目之间增加间距 */
}
/*
.user:last-child, .current-user:last-child {
  border-bottom: none;
}
*/
.avatar image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  font-size: 16px;
  color: #333;
}

/* 中间：福币数和福币logo */
.fub-info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.fub-logo {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}

.fub-amount {
  font-size: 16px;
  color: #d9534f;
}

.score {
  font-size: 16px;
  color: #e74c3c;
  font-weight: bold;
}

.rank {
  font-size: 34px;
  color: #d9363e; /* 排名颜色 */
  font-weight: bold;
  font-style: italic;
}

/* 返回按钮 */
.back-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.back-btn image {
  width: 25px;
  height: 25px;
}
.shop-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: url('/static/fuxiaopu-icon.png') no-repeat center center;
  background-size: contain;
  cursor: pointer;
}
</style>