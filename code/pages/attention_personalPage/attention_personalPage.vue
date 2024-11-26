<template>
  <view class="container">
    <!-- Header with back button and title -->
    <view class="header">
      <image src="/static/back-icon.png" class="back-icon" @click="goBack"></image>
      <text class="title">个人主页</text>
    </view>

    <!-- User Profile Section -->
    <view class="profile-section" v-if="user">
      <image :src="user.avatarUrl" class="profile-avatar"></image>
      <view class="profile-details">
        <text class="profile-name">{{ user.nickname }}</text>
        <text class="profile-info">{{ user.school }} | {{ user.major }}</text>
        <text class="profile-info">入学年份: {{ user.year }}</text>
        <text class="profile-info">个性签名: {{ user.signature }}</text>
      </view>
    </view>

    <!-- User Stats Section -->
    <view class="stats-section" v-if="user">
      <view class="stat-item">
        <text class="stat-number">{{ user.following }}</text>
        <text class="stat-label">关注</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ user.followers }}</text>
        <text class="stat-label">粉丝</text>
      </view>
    </view>

    <view class="divider"></view>

    <!-- User Posts Section -->
    <!-- 用户帖子区域 -->
    <scroll-view scroll-y="true" class="posts-section" v-if="posts.length">
      <view v-for="(post, index) in posts" :key="index" class="post" @click="navigateToPostDetail(post._id)">
        <view class="post-header">
          <image :src="post.authorAvatar" class="post-avatar"></image>
          <view>
            <text class="post-author">{{ post.author }}</text>
            <text class="post-date">{{ post.date }}</text>
          </view>
        </view>
        <view class="post-content">
          <text>{{ post.content }}</text>
          <view class="post-images">
            <image v-for="(img, idx) in post.images" :src="img" :key="idx" class="post-image" />
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      posts: []
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    async fetchUserInfo(userid) {
      try {
        const res = await uniCloud.callFunction({
          name: 'getAttentionPersonalInfo',
          data: { userid }
        });
        if (res.result.code === 0) {
          this.user = res.result.data.user;
          this.posts = res.result.data.posts;
        } else {
          uni.showToast({
            title: res.result.message,
            icon: 'none'
          });
        }
      } catch (error) {
        uni.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    },
    navigateToPostDetail(postId) {
      uni.navigateTo({
        url: `/pages/post-detail/post-detail?id=${postId}`,
      });
    }
  },
  onLoad(options) {
    const { userid } = options;
    if (userid) {
      this.fetchUserInfo(userid);
    } else {
      uni.showToast({
        title: '缺少用户ID',
        icon: 'none'
      });
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px;
  background-color: white;
}
.back-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}
.title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  flex: 1;
}
.divider {
  height: 2px;
  background-color: darkred;
  margin: 10px 0;
}
.profile-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  background-color: white;
  justify-content: flex-start; /* 将内容靠左对齐 */
}
.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
}
.profile-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 将内容靠左对齐 */
}
.profile-name {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  text-align: left;
}
.profile-info {
  font-size: 10px;
  color: #666;
  margin-top: 5px;
  text-align: left;
}
.stats-section {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 2px;
  background-color: white;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-number {
  font-size: 12px;
  font-weight: bold;
  color: #666;
}
.stat-label {
  font-size: 14px;
  color: #666;
}
.posts-section {
  flex: 1;
  padding: 10px;
  background-color: #f8f8f8;
}
.post {
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
}
.post-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}
.post-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.post-author {
  font-size: 16px;
  font-weight: bold;
}
.post-date {
  font-size: 12px;
  color: #999;
}
.post-content {
  font-size: 14px;
  margin-top: 10px;
}
.post-images {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}
.post-image {
  width: 70px;
  height: 70px;
  margin-right: 10px;
  border-radius: 4px;
}
</style>