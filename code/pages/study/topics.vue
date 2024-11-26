<template>
    <view>
        <!-- 导航 -->
        <view class="uni-page-head status_bar" style="top: 0;">
            <view class="flex_space" style="flex:1">
                <svg @click="toBack" width="26" height="26" viewBox="0 0 32 32"><path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="#000000"></path></svg>
                <view class="uni-page-head__title">小研题库</view>
                <image style="width: 67rpx;height: 57rpx;" src="../../static/search.png" @click="toSearch"></image>
            </view>
        </view>
        <view style="height: 44px;"></view>
        <view class="flex_space tabs">
            <view @click="switchTab(index)" :class="{'tab_active':index==activeIndex}" v-for="(item,index) in tabs">{{item}}</view>
        </view>
        <view class="list">
            <view class="item" v-for="topic in filteredTopics" :key="topic._id" @click="openLink(topic.link)">
                <image class="item_index" :src="topic.cover_url" mode="aspectFill"></image>
                <view class="item_body">
                    <view class="item_title">{{topic.topic_name}}</view>
                    <view style="color:#a5a4a4">{{topic.date}}</view>
                </view>
                <button 
                        :class="{'favorite-button': true, 'favorited': topic.isFavorited}" 
                        @click.stop="toggleFavorite(topic)"
                    >
                        {{ topic.isFavorited ? '已收藏' : '收藏' }}
                    </button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            tabs: ['专业课', '英语', '数学', '思政'],
            activeIndex: 0,
            topics: [],
            currentUserId: null, // 添加 currentUserId
            starredTopics: [] // 添加 starredTopics
        };
    },
    computed: {
        filteredTopics() {
            const subjects = ['main', 'english', 'math', 'politics'];
            return this.topics.filter(topic => topic.subject === subjects[this.activeIndex]);
        }
    },
    methods: {
        toSearch() {
            uni.navigateTo({
                url: '/pages/study/search'
            });
        },
        toBack() {
            uni.navigateBack();
        },
        switchTab(index) {
            this.activeIndex = index;
        },
        async fetchTopics() {
            try {
                const res = await uniCloud.callFunction({
                    name: 'getTopic'
                });
                if (res.result.code === 0) {
                    // 初始化 isFavorited 字段
                    this.topics = res.result.data.map(topic => ({
                        ...topic,
                        isFavorited: this.starredTopics.includes(topic._id)
                    }));
                } else {
                    console.error('获取题库数据失败:', res.result.msg);
                }
            } catch (error) {
                console.error('获取题库数据失败:', error);
            }
        },
        async fetchUserStarredTopics() {
            try {
                const res = await uniCloud.callFunction({
                    name: 'getUserStarredTopics',
                    data: {
                        user_id: this.currentUserId
                    }
                });
                if (res.result.code === 0) {
                    this.starredTopics = res.result.data.starred_topics || [];
                    this.fetchTopics(); // 获取题库数据
                } else {
                    console.error('获取用户收藏题库数据失败:', res.result.msg);
                }
            } catch (error) {
                console.error('获取用户收藏题库数据失败:', error);
            }
        },
        async toggleFavorite(topic) {
            try {
                const action = topic.isFavorited ? 'remove' : 'add';
                const res = await uniCloud.callFunction({
                    name: 'collect_topic',
                    data: {
                        topic_id: topic._id,
                        action: action,
                        user_id: this.currentUserId // 添加 user_id
                    }
                });
                if (res.result.code === 0) {
                    topic.isFavorited = !topic.isFavorited;
                    uni.showToast({
                        title: res.result.msg,
                        icon: 'success'
                    });
                } else {
                    uni.showToast({
                        title: res.result.msg || '操作失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                uni.showToast({
                    title: '网络错误',
                    icon: 'none'
                });
            }
        },
        openLink(link) {
            if (link) {
                try {
                    const encodedLink = encodeURIComponent(link);
                    uni.navigateTo({
                        url: `/pages/webview/webview?url=${encodedLink}`
                    });
                } catch (error) {
                    console.error('URL 编码失败:', error);
                    uni.showToast({
                        title: '无效的链接',
                        icon: 'none'
                    });
                }
            } else {
                uni.showToast({
                    title: '无效的链接',
                    icon: 'none'
                });
            }
        },
        // 添加获取当前用户的方法
        getCurrentUser() {
            const user = uni.getStorageSync('currentUser');
            console.log('获取到的 currentUser:', user); // 调试信息

            if (user && user.user_id) {
                this.currentUserId = user.user_id;
                console.log('已获取用户信息:', user);
                this.fetchUserStarredTopics(); // 获取用户收藏题库数据
            } else {
                // 未登录，跳转到登录页面
                uni.showToast({ title: '请先登录', icon: 'none' });
                uni.navigateTo({ url: '/pages/login/login' });
            }

            console.log('当前用户ID:', this.currentUserId);
        }
    },
    onLoad() {
        this.getCurrentUser(); // 调用获取用户方法
    }
};
</script>

<style scoped>
page {
    background-color: #f6f8fa;
}
.status_bar {
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
}
.flex_space {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.tabs {
    background-color: #fff;
    padding: 0 30rpx;
    font-weight: bold;
    border-bottom: 1px solid #e1e1e1;
    color: rgb(203, 203, 203);
}
.tabs>view {
    padding-top: 20rpx;
    padding-bottom: 15rpx;
}
.tab_active {
    color: rgb(189, 49, 36);
    border-bottom: 2px solid rgb(189, 49, 36);
}
.list {
    padding: 0 30rpx;
}
.item {
    background-color: #fff;
    margin-top: 30rpx;
    padding: 30rpx;
    border-radius: 20rpx;
    box-shadow: 1px 2px 6px 1px rgb(143 139 139 / 10%);
    display: flex;
}
.item_index {
    width: 120rpx;
    height: 120rpx;
    margin-right: 20rpx;
}
.item_body {
    flex: 1;
}
.item_title {
    margin-bottom: 20rpx;
}
.favorite-button {
    margin-top: 10rpx;
    height: 40px;
    width: 80px;
    border: none;
    border-radius: 10px;
    background-color: rgb(189, 49, 36);
    color: #fff;
    cursor: pointer;
    font-size: 16px;
}
.favorited {
    background-color: rgb(189, 49, 36);
}
</style>