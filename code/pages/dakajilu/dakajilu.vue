<template>
  <view class="container">
    <!-- 页面标题 -->
    <view class="header">
      <text class="title">打卡记录</text>
    </view>

    <!-- 打卡记录列表 -->
    <view class="records">
      <view class="record" v-for="(record, index) in records" :key="index">
        <!-- 打卡日期 -->
        <view class="date">{{ record.date }}</view>

        <!-- 打卡内容 -->
        <view class="card">
          <view class="content">
            <view class="text-section">
              <text class="day-title">{{ record.title }}</text>
              <!-- 分割符 -->
              <view class="separator"></view>
              <text class="description">{{ record.description }}</text>
            </view>
            <!-- 图片列表 -->
            <view class="image-list">
              <image class="record-image" v-for="(img, imgIndex) in record.images" :key="imgIndex" :src="img"></image>
            </view>
          </view>
          <!-- 点赞部分 -->
          <view class="footer">
            <view class="like-container">
              <image class="like-icon-filled" src="/static/点赞.png" @click="likeRecord(index)" />
              <text class="like-count">{{ record.likes }}</text>
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
      records: [
        {
          date: '19/10',
          title: '打卡第三天!\n',
          description: '今日完成了：1. 数据结构第三章 2. 高数模拟卷1 3. 英语单词100个 4. 肖秀荣思政手册也开始背了...',
          images: [
            '/static/鸡汤1.jpg',
            '/static/鸡汤2.jpg',
            '/static/sjjg.jpg',
          ],
          likes: 9,
        },
        {
          date: '18/10',
          title: '打卡第二天!\n',
          description: '今日完成了：1. 数据结构第三章 2. 高数模拟卷1 3. 英语单词100个 4. 肖秀荣思政手册也开始背了...',
          images: [
            '/static/鸡汤1.jpg',
            '/static/鸡汤2.jpg',
            '/static/sjjg.jpg',
          ],
          likes: 9,
        },
      ],
    };
  },
  methods: {
    goBack() {
      // 返回到上一个页面
      uni.navigateBack();
    },
    likeRecord(index) {
      // 点赞逻辑
      this.records[index].likes++;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10px 0;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.records {
  width: 100%;
  margin-top: 10px;
}

.record {
  margin-bottom: 20px;
}

.date {
  font-size: 14px;
  color: #e74c3c;
  font-weight: bold;
  margin-bottom: 5px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content {
  display: flex;
  flex-direction: column;
}

/* 分割符样式 */
.separator {
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 10px 0;
}

.text-section {
  margin-bottom: 10px;
}

.day-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.image-list {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.record-image {
  width: 90px;
  height: 90px;
  border-radius: 5px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 使点赞部分靠右对齐 */
}

.like-container {
  display: flex;
  align-items: center;
}

.like-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  cursor: pointer;
}

.like-icon-filled {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  cursor: pointer;
}

.like-count {
  font-size: 14px;
  color: #666;
}
</style>
