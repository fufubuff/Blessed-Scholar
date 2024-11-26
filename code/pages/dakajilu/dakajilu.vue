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
              <text class="description">{{ record.content }}</text>
            </view>
            <!-- 图片列表 -->
            <view class="image-list">
              <image
                class="record-image"
                v-for="(img, imgIndex) in record.images"
                :key="imgIndex"
                :src="img"
              ></image>
            </view>
          </view>
          <!-- 点赞部分 -->
          <view class="footer">
            <view class="like-container">
              <image
                class="like-icon-filled"
                src="/static/点赞.png"
                @click="likeRecord(index)"
              />
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
      records: [], // 存储打卡记录数据
    };
  },
  onLoad() {
    this.getStudyReports();
  },
  methods: {
    // 获取打卡记录
    async getStudyReports() {
      const userId = uni.getStorageSync('user_id');
      if (!userId) {
        uni.showToast({
          title: '未找到用户ID',
          icon: 'none',
        });
        return;
      }

      try {
        const res = await uniCloud.callFunction({
          name: 'getStudyReports', // 调用云函数
          data: { user_id: userId },
        });

        console.log('云函数响应:', res); // 调试用

        if (res.result.code === 0) {
          const records = res.result.data; // 获取到的打卡记录

          // 收集所有图片的 fileID，并过滤掉无效的 fileID
          const allFileIDs = [];
          records.forEach(record => {
            if (record.images && Array.isArray(record.images)) {
              record.images.forEach(img => {
                if (typeof img === 'string' && img.trim() !== '') {
                  allFileIDs.push(img);
                }
              });
            }
          });

          if (allFileIDs.length > 0) {
            // 转换所有 fileID 为 tempFileURL
            const fileList = allFileIDs; // 直接使用字符串数组

            // 调用 getTempFileURL 并传递字符串数组
            const fileURLRes = await uniCloud.getTempFileURL({
              fileList,
            });

            console.log('getTempFileURL 响应:', fileURLRes); // 调试用

            if (fileURLRes.fileList && fileURLRes.fileList.length > 0) {
              // 假设 fileURLRes.fileList 的顺序与 fileList 一致
              const fileIDtoURL = {};
              fileURLRes.fileList.forEach((file, index) => {
                const originalFileID = fileList[index];
                if (file.tempFileURL) {
                  fileIDtoURL[originalFileID] = file.tempFileURL;
                }
              });

              // 替换 records 中的图片路径
              records.forEach(record => {
                if (record.images && Array.isArray(record.images)) {
                  record.images = record.images.map(img => fileIDtoURL[img] || img);
                }
              });

              this.records = records; // 更新打卡记录
            } else {
              throw new Error('获取图片临时链接失败');
            }
          } else {
            // 如果没有图片，直接更新记录
            this.records = records;
          }
        } else {
          uni.showToast({
            title: res.result.msg || '获取失败',
            icon: 'none',
          });
        }
      } catch (error) {
        console.error('获取打卡记录失败:', JSON.stringify(error, null, 2));
        uni.showToast({
          title: `获取打卡记录失败，请重试: ${error.message || '未知错误'}`,
          icon: 'none',
        });
      }
    },

    // 点赞逻辑
    likeRecord(index) {
      this.records[index].likes++; // 增加点赞数量
      // 如果需要同步到数据库，请在此处添加相应逻辑
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
  justify-content: flex-end;
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
