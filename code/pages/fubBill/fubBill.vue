<template>
  <view class="bill-list">
    <view class="bill-item" v-for="(item, index) in transactions" :key="index">
      <view class="description">
        <text>{{ item.description }}</text>
        <text :class="item.amount > 0 ? 'amount positive' : 'amount negative'">
          {{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
        </text>
      </view>
      <view class="date">{{ item.date }}</view>
    </view>
  </view>
</template>

<script>
export default {
data() {
  return {
    transactions: [] // 存储福币交易记录
  };
},
async created() {
  await this.fetchTransactions(); // 获取交易数据
},
methods: {
  async fetchTransactions() {
    try {
      const userId = uni.getStorageSync('user_id'); // 从本地存储获取 user_id
      if (!userId) {
        throw new Error('user_id is not available');
      }
      console.log("Retrieved user_id:", userId); // 调试输出 user_id

      const response = await uniCloud.callFunction({
        name: 'getUserTransactions',
        data: { user_id: userId }
      });

      console.log("Cloud function response:", response); // 调试输出云函数响应

      if (response.result && response.result.code === 0) {
        this.transactions = response.result.data;
      } else {
        console.error('Failed to fetch transactions:', response.result.msg);
      }
    } catch (error) {
      uni.showToast({ title: '获取交易记录失败', icon: 'none' });
      console.error('Error fetching transactions:', error);
    }
  }
}
};
</script>

<style>
.bill-list {
padding: 10px;
}

.bill-item {
padding: 10px;
border-bottom: 1px solid #eaeaea;
}

.description {
display: flex;
justify-content: space-between;
}

.amount {
font-weight: bold;
}

.amount.positive {
color: green;
}

.amount.negative {
color: red;
}

.date {
color: #999;
font-size: 12px;
}
</style>