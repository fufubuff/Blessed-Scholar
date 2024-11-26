<template>
  <div class="study-analysis">
    <!-- 学情报告标题 -->
    <h1 class="report-title">学情分析报告</h1>

    <!-- 学习薄弱点板块 -->
    <section class="report-section">
      <h2 class="section-title">学习薄弱点</h2>
      <p>{{ weakness }}</p>
    </section>

    <!-- 当前学习状况板块 -->
    <section class="report-section">
      <h2 class="section-title">当前学习状况</h2>
      <p>{{ studySituation }}</p>
    </section>

    <!-- 打卡天数板块 -->
    <section class="report-section">
      <h2 class="section-title">打卡天数</h2>
      <p>{{ punch }} 天</p>
    </section>

 

    <!-- 今日任务板块 -->
    <section class="report-section">
      <h2 class="section-title">今日任务</h2>
      <ul>
        <li v-for="(task, index) in tasks" :key="index">
          {{ index + 1 }}. {{ task.name || '未命名任务' }}
        </li>
      </ul>
    </section>

    <!-- AI 生成的学情分析板块 -->
    <section class="report-section">
      <h2 class="section-title">AI 学情分析</h2>
      <!-- 分页显示 AI 分析内容 -->
      <div class="ai-analysis-content">
        <p v-html="currentPageContent"></p>
      </div>
      <!-- 翻页按钮 -->
      <div class="pagination-button" @click="handlePageChange">
        <img :src="pageButtonImage" alt="Page Button" class="next-page-icon" />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'StudyAnalysis',
  data() {
    return {
      fullContent: '',
      currentPage: 0,
      pageSize: 250,
      userId: '', // 将通过 uni.getStorageSync 获取
      // 新增的数据属性
      weakness: '',
      studySituation: '',
      punch: 0,
      signature: '',
      tasks: [],
    };
  },
  computed: {
    // 计算当前页的内容
    currentPageContent() {
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      return this.fullContent.slice(start, end);
    },
    // 计算当前按钮的图标
    pageButtonImage() {
      const totalPages = Math.ceil(this.fullContent.length / this.pageSize);
      return this.currentPage < totalPages - 1
        ? '/static/nextpage.png'
        : '/static/backpage.png';
    },
  },
  methods: {
    // 翻页或返回
    handlePageChange() {
      const totalPages = Math.ceil(this.fullContent.length / this.pageSize);
      if (this.currentPage < totalPages - 1) {
        this.currentPage += 1; // 下一页
      } else {
        this.currentPage = 0; // 回到第一页
      }
    },
    // 获取数据并生成学情分析
    async fetchDataAndGenerateAnalysis() {
      try {
        // 获取用户 ID
        const storedUserId = uni.getStorageSync('user_id');
        if (storedUserId) {
          this.userId = storedUserId;
        } else {
          // 如果未获取到 userId，可以提示用户登录或进行其他处理
          uni.showToast({
            title: '未获取到用户信息，请先登录',
            icon: 'none',
          });
          return;
        }

        // 调用云函数，获取学情分析和用户数据
        const res = await uniCloud.callFunction({
          name: 'generateStudyAnalysis', // 云函数的名称
          data: {
            userId: this.userId,
          },
        });

        console.log('云函数调用结果：', res); // 输出云函数返回的完整结果

        if (res.result && res.result.success) {
          // 将返回的数据赋值给组件的属性
          this.fullContent = res.result.data.analysis;
          this.weakness = res.result.data.weakness;
          this.studySituation = res.result.data.studySituation;
          this.punch = res.result.data.punch;
          this.signature = res.result.data.signature;
          this.tasks = res.result.data.tasks;
        } else {
          console.error(
            '获取学情分析失败：',
            res.result ? res.result.message : '无返回结果'
          );
          console.error('云函数完整返回：', res); // 输出完整的返回结果
          uni.showToast({
            title: '获取学情分析失败',
            icon: 'none',
          });
        }
      } catch (error) {
        console.error('调用云函数失败：', error);
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
        });
      }
    },
  },
  mounted() {
    this.fetchDataAndGenerateAnalysis();
  },
};
</script>

<style scoped>
.study-analysis {
  padding: 20px;
  background-color: #f0f0f0;
  overflow-y: auto;
  height: 100vh; /* 确保页面可滚动 */
}

.report-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  color: #333333;
}

.report-section {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 22px;
  margin-bottom: 15px;
  color: #555555;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 5px;
}

.section-section p {
  font-size: 16px;
  color: #666666;
  line-height: 1.6;
}

.ai-analysis-content {
  min-height: 150px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.pagination-button {
  margin-top: 10px;
  cursor: pointer;
  text-align: center;
}

.next-page-icon {
  width: 30px;
  height: auto;
}
</style>
