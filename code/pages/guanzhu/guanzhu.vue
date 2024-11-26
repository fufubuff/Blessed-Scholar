<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="subtitles">
        <view class="subtitle" :class="{ active: activeTab === '互关' }" @click="tabClick('互关')">互关</view>
        <view class="subtitle" :class="{ active: activeTab === '关注' }" @click="tabClick('关注')">关注</view>
        <view class="subtitle" :class="{ active: activeTab === '粉丝' }" @click="tabClick('粉丝')">粉丝</view>
        <!-- 基础横线 -->
        <view class="base-underline"></view>
        <!-- 红色下划线 -->
        <view class="active-underline" :style="activeUnderlineStyle"></view>
      </view>
    </view>
    <!-- 内容区域 -->
    <view class="content">
      <!-- 关注内容 -->
      <view v-if="activeTab === '关注'">
        <view class="user-item" v-for="user in followUsers" :key="user.id">
          <view class="card">
            <!-- 左侧头像 -->
            <image class="avatar" :src="user.avatar"></image>
            <!-- 右侧信息 -->
            <view class="card-info">
                <text class="user-name">{{ user.name }}</text>
              <view class="user-desc">{{ user.desc }}</view>
            </view>
            <!-- 已关注标签 -->
            <text class="follow-status">已关注</text>
          </view>
        </view>
      </view>

      <!-- 互关内容 -->
      <view v-if="activeTab === '互关'">
        <view class="user-item" v-for="user in mutualFollowUsers" :key="user.id">
          <view class="card">
            <!-- 左侧头像 -->
            <image class="avatar" :src="user.avatar"></image>
            <!-- 中间信息 -->
            <view class="card-info">
              <text class="user-name">{{ user.name }}</text>
              <text class="user-desc">{{ user.desc }}</text>
            </view>
            <!-- 右侧互关图标 -->
            <image class="huguan-icon" src="/static/huguan.png" />
          </view>
        </view>
      </view>

      <!-- 粉丝内容 -->
      <view v-if="activeTab === '粉丝'">
        <view class="user-item" v-for="user in fansUsers" :key="user.id">
          <view class="card">
            <!-- 左侧头像 -->
            <image class="avatar" :src="user.avatar"></image>
            <!-- 中间信息 -->
            <view class="card-info">
              <text class="user-name">{{ user.name }}</text>
              <text class="user-desc">{{ user.desc }}</text>
            </view>
            <!-- 右侧按钮 -->
            <view
              class="fans-button"
              :class="{ active: user.status === '互关中' }"
              @click="toggleFollowStatus(user)"
            >
              {{ user.status }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: '关注', // 默认选中的标签
      // 关注用户数据
      followUsers: [
        {
          id: 1,
          avatar: 'https://via.placeholder.com/80',
          name: 'mx',
          desc: '软件工程你知道的，我一直是爱你的'
        },
        {
          id: 2,
          avatar: 'https://via.placeholder.com/80',
          name: 'hxy',
          desc: '软件工程你知道我为你push了多少...'
        },
        {
          id: 3,
          avatar: 'https://via.placeholder.com/80',
          name: 'zmx',
          desc: '被软件工程压垮的小数据库层人员'
        }
      ],
      // 互关用户数据
      mutualFollowUsers: [
        {
          id: 4,
          avatar: 'https://via.placeholder.com/80',
          name: 'user1',
          desc: '这是一个互关用户的签名'
        },
        {
          id: 5,
          avatar: 'https://via.placeholder.com/80',
          name: 'user2',
          desc: '互关用户的签名更个性'
        }
      ],
      // 粉丝用户数据
      fansUsers: [
        {
          id: 6,
          avatar: 'https://via.placeholder.com/80',
          name: 'mx',
          desc: '软件工程你知道的...',
          status: '互关中' // 按钮状态
        },
        {
          id: 7,
          avatar: 'https://via.placeholder.com/80',
          name: 'hxy',
          desc: '软件工程你知道我为你push...',
          status: '互关中'
        },
        {
          id: 8,
          avatar: 'https://via.placeholder.com/80',
          name: 'xff',
          desc: '疑似被ddl带走了所有的快乐...',
          status: '回关ta'
        }
      ]
    };
  },
  computed: {
    activeUnderlineStyle() {
      const indexMap = {
        '互关': 0,
        '关注': 1,
        '粉丝': 2
      };
      const index = indexMap[this.activeTab] || 0;
      return {
        width: `${100 / 3 - 20}%`,
        left: `${(100 / 3) * index + 10}%`,
        backgroundColor: '#d14c00',
        height: '6rpx',
        transition: 'left 0.3s ease, width 0.3s ease',
        bottom: '0'
      };
    }
  },
  methods: {
    tabClick(tab) {
      this.activeTab = tab; // 切换标签时更新当前激活的标签
    },
    toggleFollowStatus(user) {
      // 动态切换状态
      if (user.status === '回关ta') {
        user.status = '互关中';
      } else if (user.status === '互关中') {
        user.status = '回关ta';
      }
    }
  }
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 确保页面高度为视口高度 */
  background-color: #f8f8f8; /* 浅灰色背景 */
}

.header {
  background-color: #fff;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
}

.subtitles {
  position: relative;
  display: flex;
  justify-content: space-around;
  margin-bottom: -20rpx;
}

.subtitle {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  padding: 10rpx 0;
  color: #9d9d9d;
  font-weight: bold;
  cursor: pointer;
}

.subtitle.active {
  color: #d14c00;
}

.base-underline {
  position: absolute;
  bottom: 0;
  left: -10px;
  width: 150%;
  height: 2rpx;
  background-color: #ccc;
}

.active-underline {
  position: absolute;
  bottom: 0;
}

.content {
  flex: 1;
  padding: 20rpx;
  background-color: #f8f8f8;
}

.user-item {
  margin-bottom: 20rpx;
}

.card {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 30rpx; /* 圆角 */
  padding: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1); /* 阴影 */
  position: relative;
  border: 2rpx solid transparent;
  width: 90%;
  height: 70px;
  margin: 0 auto 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 40rpx;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-name {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx; /* 控制间距 */
}

.user-desc {
  font-size: 24rpx;
  color: #666;
  margin-top: 0; /* 确保只有 .user-name 的 margin-bottom 生效 */
}

.fans-button {
  padding: 5rpx 10rpx;
  font-size: 22rpx;
  border-radius: 15rpx;
  border: 2rpx solid #ccc; /* 默认浅灰色边框 */
  color: #666; /* 默认浅灰色文字 */
  text-align: center;
  cursor: pointer;
  margin-right: 13px;
}

.fans-button.active {
  border-color: #d14c00; /* 红色边框 */
  color: #d14c00; /* 红色文字 */
}

.huguan-icon {
  width: 50rpx; /* 调整宽度 */
  height: 50rpx; /* 调整高度 */
  margin-left: 0rpx; /* 左边距保持不变 */
  margin-right: 13px;
}

.follow-status {  position: absolute;  top: 0rpx; /* 上移一定距离，使其看起来被遮挡 */  right: 0rpx; /* 靠近右侧 */  font-size: 22rpx; /* 字体大小 */  background-color: #ccc; /* 灰色背景 */  color: #fff; /* 白色字体 */  padding: 5rpx 10rpx; /* 内边距 */  border-radius: 10rpx; /* 圆角矩形 */  z-index: 1; /* 保证优先级低于卡片主体 */  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1); /* 添加阴影使其更加立体 */  overflow: hidden; /* 防止溢出 */}
</style>
