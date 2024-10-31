<template>
  <view class="page">
    <view class="header">
      <view class="subtitles">
        <view class="subtitle" :class="{ active: activeTab === '互关' }" @click="tabClick('互关')">互关</view>
        <view class="subtitle" :class="{ active: activeTab === '关注' }" @click="tabClick('关注')">关注</view>
        <view class="subtitle" :class="{ active: activeTab === '粉丝' }" @click="tabClick('粉丝')">粉丝</view>
      </view>
    </view>
    <view class="content">
      <view class="user-item" v-for="user in users" :key="user.id">
        <view class="user-info">
          <image class="avatar" :src="user.avatar"></image>
          <view class="user-name">{{ user.name }}</view>
          <view class="user-desc">{{ user.desc }}</view>
        </view>
        <view class="follow-status">{{ user.followStatus }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: '关注',
      users: []
    };
  },
  methods: {
    tabClick(tab) {
      this.activeTab = tab;
      if (tab === '粉丝') {
        this.getFansData();
      }
    },
    async getFansData() {
      const db = uniCloud.database();
      const res = await db.collection('fans').get();
      this.users = res.data;
    }
  },
  mounted() {
    this.getFansData(); // 页面加载时默认获取粉丝数据
  }
};
</script>

<style>
  .page {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .header {
    background-color: #fff;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
  }

  .subtitles {
    display: flex;
    justify-content: space-around;
  }
  .subtitle {
    font-size: 28rpx;
    padding: 10rpx 20rpx;
    border-bottom: 2rpx solid #ccc;
    color: #9d9d9d; /* 默认文本颜色为黑色 */
	font-weight: bold;
  }
  .subtitle.active {
    border-bottom-color: #d14c00;
    color: #d14c00; /* 激活状态的文本颜色 */
  }
  .content {
    flex: 1;
    padding: 20rpx;
  }
  .user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
  }
  .user-info {
    display: flex;
    align-items: center;
  }
  .avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }
  .user-name {
    font-size: 30rpx;
    margin-bottom: 10rpx;
  }
  .user-desc {
    font-size: 24rpx;
    color: #666;
  }
  .follow-status {
    background-color: #ccc;
    color: #fff;
    padding: 10rpx 20rpx;
    border-radius: 10rpx;
  }
</style>