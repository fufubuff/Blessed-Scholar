<template>

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

    <!-- 用户头像横向排列 -->
    <view class="user-list">
      <view
        class="user-item"
        v-for="user in users"
        :key="user.userid"
        @click="navigateToPersonalPage(user.userid)"
      >
        <image :src="user.avatar" class="user-avatar"></image>
        <text class="user-name">{{ user.username }}</text>
      </view>
    </view>

    <!-- New Content Section -->
    <view class="new-content">
      <view class="content-item" @click="setActiveContent('求解答')">
        <view
          :class="['content-border', { 'active-border': activeContent === '求解答' }]"
        >
          <image src="/static/求解答帖.png" class="content-image" />
        </view>
      </view>
      <view class="content-item" @click="setActiveContent('加油站')">
        <view
          :class="['content-border', { 'active-border': activeContent === '加油站' }]"
        >
          <image src="/static/加油站帖.png" class="content-image" />
        </view>
      </view>
    </view>

      <!-- Post Content -->
  <scroll-view
    scroll-y="true"
    class="post-list"
    v-if="activeContent === '加油站'"
  >
    <view v-for="(post, index) in posts" :key="index" class="post" @click="navigateToPostDetail(post._id)">
      <view class="post-container">
        <view class="post-header">
          <image :src="post.data.user_pho" class="author-avatar" />
          <view>
            <text class="post-author">{{ post.data.nickname }}</text>
            <text class="post-date">{{ post.data.chat_time }}</text>
          </view>
        </view>
        <view class="post-content">
          <text>{{ post.data.user_chat }}</text>
          <view class="post-images">
            <image
              v-for="(img, idx) in post.data.user_chat_pho"
              :src="img"
              :key="idx"
              class="post-image"
            />
          </view>
        </view>
      </view>
    </view>
  </scroll-view>

  <!-- Question Content -->
  <scroll-view
    scroll-y="true"
    class="question-list"
    v-if="activeContent === '求解答'"
  >
    <view
      v-for="(post, index) in posts"
      :key="index"
      class="question"
      @click="navigateToPostDetail(post._id)"
    >
      <view class="question-container">
        <view class="question-header">
          <image :src="post.data.user_pho" class="author-avatar" />
          <view>
            <text class="question-author">{{ post.data.nickname }}</text>
            <text class="question-date">{{ post.data.chat_time }}</text>
          </view>
        </view>
        <view class="question-content">
          <text>{{ post.data.user_chat }}</text>
          <view class="question-images">
            <image
              v-for="(img, idx) in post.data.user_chat_pho"
              :src="img"
              :key="idx"
              class="question-image"
            />
          </view>
        </view>
      </view>
    </view>
  </scroll-view>

</template>

<script>
export default {
  data() {
  return {
    activeNav: '小研圈',
    activeTab: '关注', // 默认激活的标签
    activeContent: '加油站',
    users: [],
    userid: '',
    posts: [],
    questions: [],
  };
},
  methods: {
    setActiveTab(tab) {
    if (tab === '加油站') {
      uni.reLaunch({
        url: '/pages/jiayouzhan/jiayouzhan?activeTab=加油站'
      });
    } else if (tab === '求解答') {
      uni.navigateTo({
        url: '/pages/qiujieda/qiujieda?activeTab=求解答'
      });
    } else if (tab === '关注') {
      // 当前页面，无需跳转
    }
  },
  navigateToPostDetail(postId) {
      uni.navigateTo({
        url: `/pages/post-detail/post-detail?id=${postId}`,
      });
    },
    navigateToPersonalPage(userid) {
      console.log('Navigating to personal page with userid:', userid); // 打印 userid
      uni.navigateTo({
        url: `/pages/attention_personalPage/attention_personalPage?userid=${userid}`,
      });
    },
    setActiveContent(content) {
      this.activeContent = content;
    },
    async fetchPosts() {
      try {
        const res = await uniCloud.callFunction({
          name: 'getAttentionPost',
          data: {
            userid: this.userid,
          },
        });
        if (res.result.code === 0) {
          this.posts = res.result.data;
        } else {
          console.error('获取帖子失败：', res.result.msg);
        }
      } catch (err) {
        console.error('调用云函数失败：', err);
      }
    },
    async fetchQuestions() {
      try {
        const res = await uniCloud.callFunction({
          name: 'getAttentionQuestion',
          data: {
            userid: this.userid,
          },
        });
        if (res.result.code === 0) {
          this.posts = res.result.data;
        } else {
          console.error('获取帖子失败：', res.result.msg);
        }
      } catch (err) {
        console.error('调用云函数失败：', err);
      }
  },
    navigateTo(page) {
      this.activeNav = page;
      if (page === 'attention') {
        uni.navigateTo({
          url: '/pages/attention/attention',
        });
      } else {
        // 处理其他页面的导航逻辑
        uni.navigateTo({
          url: `/pages/${page}/${page}`,
        });
      }
    },
  },
  async created() {
    // 获取当前用户的 ID，例如从缓存中获取
    this.userid = uni.getStorageSync('userid');

    // 根据 activeContent 初始值加载内容
    if (this.activeContent === '求解答') {
      this.fetchQuestions();
    } else if (this.activeContent === '加油站') {
      this.fetchPosts();
}

    // 获取关注的用户列表
    try {
      const res = await uniCloud.callFunction({
        name: 'getFollowerList',
        data: {
          userid: this.userid,
        },
      });
      if (res.result.code === 0) {
        this.users = res.result.data;
      } else {
        uni.showToast({
          title: res.result.message,
          icon: 'none',
        });
      }
    } catch (error) {
      console.error('获取关注列表失败:', error);
      uni.showToast({
        title: '获取关注列表失败',
        icon: 'none',
      });
    }
  },
  watch: {
  activeContent(newVal) {
    if (newVal === '求解答') {
      this.fetchQuestions();
    } else if (newVal === '加油站') {
      this.fetchPosts();
    }
  },
},
    // 统一跳转方法
    navigateTo(page) {
      console.log('跳转到页面:', page);
      const pageMap = {
        'attention': '/pages/attention/attention',
        'qiujieda': '/pages/qiujieda/qiujieda',
        'guanzhu': '/pages/guanzhu/guanzhu',
        'fensi': '/pages/fensi/fensi',
        'bianjiziliao': '/pages/bianjiziliao/bianjiziliao',
        'index': '/pages/index/index',
        'dakajilu': '/pages/dakajilu/dakajilu',
        'aihelper': '/pages/aihelper/aihelper', // 新增 aihelper 页面映射
        // 根据需要添加更多映射
      };
      const targetUrl = pageMap[page] || `/pages/${page}/${page}`;  // 如果没有在 pageMap 中找到，则默认跳转
      console.log('跳转到页面 URL:', targetUrl);
      uni.navigateTo({
        url: targetUrl
      });
    },
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
.tab-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tab {
  color: #666;
  font-size: 15px;
  position: relative;
}
.tab.active {
  color: red;
}
.underline {
  width: 100%;
  height: 2px;
  background-color: red;
  margin-top: 5px;
}
.profile-row {
  display: flex; 
  flex-direction: row;
  padding-top: 0px ;
  background-color: #FFFFFF;
  overflow-x: auto; /* 允许横向滚动 */
  align-items: center; /* 垂直居中 */
  padding-left: 20px; /* 离左边界一定距离 */
}
.profile-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}
.profile-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.username {
  font-size: 18px;
  color: #333;
}
.new-content {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: #f8f8f8;
  padding-top: 5px ;
  padding-bottom: 5px;
}
.content-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content-border {
  width: 130px;
  height: 40px;
  border: 2px solid #999; /* 深灰色边框 */
  border-radius: 15px; /* 圆角矩形 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.active-border {
  border-color: #bd3124; /* 激活时边框变红 */
}
.content-image {
  width: 30px;
  height: 30px;
}
.post-list {
  flex: 1;
  overflow-y: auto; /* 允许纵向滚动 */
}
.post {
  background-color: #ffffff;
  padding: 6px;
  margin: 6px ;
  border-radius: 8px;
}
.post-container {
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 10px; /* 减小内边距 */
  margin-bottom: 10px;
  border: 2px solid #bd3124; /* 枣红色边框 */
}
.post-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px; /* 减小底部边距 */
}
.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}
.post-author {
  font-weight: bold;
}
.post-date {
  color: #999;
  font-size: 8px;
}
.post-content {
  font-size: small;
  margin-top: 5px; /* 减小顶部边距 */
}
.post-images {
  display: flex;
  flex-direction: row;
  margin-top: 5px; /* 减小顶部边距 */
}
.post-image {
  width: 70px;
  height: 70px;
  margin-right: 5px;
  border-radius: 4px;
}
.question-list {
  flex: 1;
  overflow-y: auto; /* 允许纵向滚动 */
}
.question {
  background-color: #ffffff;
  padding: 6px;
  margin: 6px ;
  border-radius: 8px;
}
.question-container {
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 10px; /* 减小内边距 */
  margin-bottom: 10px;
  border: 2px solid #bd3124; /* 枣红色边框 */
}
.question-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px; /* 减小底部边距 */
}
.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}
.question-author {
  font-weight: bold;
}
.question-date {
  color: #999;
  font-size: 8px;
}
.question-content {
  font-size: small;
  margin-top: 5px; /* 减小顶部边距 */
}
.question-images {
  display: flex;
  flex-direction: row;
  margin-top: 5px; /* 减小顶部边距 */
}
.question-image {
  width: 70px;
  height: 70px;
  margin-right: 5px;
  border-radius: 4px;
}
.answer-text {
  color: white;
  font-size: 10px;
  text-align: center; /* 水平居中 */
  align-items: center;
}

.user-list {
  display: flex;
  flex-direction: row; /* 横向排列 */
  overflow-x: auto; /* 横向滚动 */
  padding: 10px;
}

.user-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.user-name {
  margin-top: 5px;
  font-size: 12px;
  color: #333;
}
</style>