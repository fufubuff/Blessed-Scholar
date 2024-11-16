<template>
  <div class="study-analysis">
    <!-- 顶部叠加圆角背景 -->
    <div class="background-wrapper">
      <div class="pink-background"></div>
      <div class="white-background">
        <!-- 显示的内容 -->
        <div class="content">
          <p v-text="currentPageContent"></p>
        </div>
        <!-- 小图标 -->
        <img src="/static/infotag.png" alt="Icon" class="icon" />
      </div>
    </div>

    <!-- 翻页按钮 -->
    <div class="pagination-button" @click="handlePageChange">
      <img :src="pageButtonImage" alt="Page Button" class="next-page-icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudyAnalysis',
  data() {
    return {
      // 假设有一段完整的文本内容
      fullContent: 
	  "(先手动填写后续调入接口每日更新)考研冲刺阶段学情分析:进入考研冲刺阶段，时间紧迫，任务繁重，学生们的学习状态和复习策略至关重要。冲刺阶段的学情主要体现在三个方面：知识掌握情况、解题能力提升、心理状态调节。首先，知识掌握情况是考研复习的基础。在冲刺阶段，考生应已完成对教材和笔记的系统复习，重点是巩固基础知识和查漏补缺。针对各科目，考生需要复习大纲范围内的所有知识点，尤其是易错题型和薄弱环节。各科目要做到精确细致，尤其是数学和英语，这两科的题目难度较大，复习时要通过大量的真题演练来强化记忆和理解。其次，解题能力的提升是冲刺阶段的重要任务。在这一阶段，考生不仅要注重知识点的掌握，更要通过做题来提升解题技巧。考研模拟题和历年真题是重要的练习资源，通过大量做题，能够帮助考生熟悉考试的题型和解题方法，提高应试能力。此外，解题的过程中，考生还应学会总结经验，归纳出各类题型的解题思路和技巧，这对于提高解题速度和准确度具有重要意义。最后，心理状态的调节是冲刺阶段不可忽视的因素。由于考研的压力较大，许多考生在冲刺阶段容易出现焦虑、紧张等情绪，影响复习效率。为了保持良好的心理状态，考生需要科学安排作息时间，保证足够的休息和睡眠。同时，可以通过适当的运动和放松活动来调节情绪，减轻压力。此外，考生要学会调整心态，保持乐观积极的情绪，避免陷入过度焦虑和自我怀疑的困境。综上所述，考研冲刺阶段是一个知识巩固、解题能力提升和心理调节并重的关键阶段。考生要在有限的时间内，合理规划复习内容，强化解题训练，调节心态，才能在考研中取得理想的成绩。",
      currentPage: 0,  // 当前页
      pageSize: 250,   // 每页最多字数
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
      return this.currentPage < totalPages - 1 ? '/static/nextpage.png' : '/static/backpage.png';
    }
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
    }
  }
}
</script>

<style scoped>
.study-analysis {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  background-color: #f0f0f0; /* 浅灰色背景 */
  height: 100vh; /* 使用100%视窗高度 */
  justify-content: flex-start; /* 置顶，避免垂直居中 */
}

.background-wrapper {
  position: relative;
  margin-top: 20px;
  width: 75%; /* 占屏幕的75% */
  height: 75%; /* 高度也占屏幕的75% */
}

.pink-background {
  background-color: #f0dddd; /* 设定背景颜色为粉色 */
  border-radius: 20px;
  position: absolute;
  top: -2%;
  left: 11.5%;
  width: 100%; /* 100%宽度 */
  height: 100%; /* 100%高度 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.white-background {
  background-color: #ffffff; /* 白色 */
  border-radius: 20px;
  width: 100%; /* 占满父容器的宽度 */
  height: 100%; /* 占满父容器的高度 */
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center; /* 居中内容 */
  padding-left: 20px; /* 图标间距 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.content {
  width: 100%; /* 内容宽度占满 */
  padding-right: 20px;
  word-wrap: break-word; /* 确保文本不会溢出 */
  line-height: 1.5; /* 设置行高为1.6，调整行间距 */
}

.icon {
  width: 20px; /* 调整图片大小 */
  height: auto; /* 自动调整高度，保持比例 */
  position: absolute;
  top: 0%;
  right: 10%; /* 根据需要调整 */
}

.pagination-button {
  
  margin-top: 20px;
  cursor: pointer;
}

.next-page-icon {
  width: 40px; /* 设置按钮图片的大小 */
  height: auto;
}
</style>