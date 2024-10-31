<template>
  <div class="store-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <image class="back-icon" src="/static/back-icon.png" @click="goBack" />
      <h1 class="title">小福铺</h1>
      <image class="search-icon" src="/static/search.png" @click="openSearch" />
    </div>

    <!-- 选项卡切换 -->
    <div class="tab-bar">
      <div :class="['tab', activeTab === 'welfare' ? 'active' : '']" @click="switchTab('welfare')">研福利</div>
      <div :class="['tab', activeTab === 'exchanged' ? 'active' : '']" @click="switchTab('exchanged')">已兑换</div>
    </div>

    <!-- 商品列表 -->
    <div v-if="activeTab === 'welfare'" class="item-list">
      <div class="item-card" v-for="(item, index) in welfareItems" :key="index">
        <image class="item-image" :src="item.image" />
        <div class="item-info">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-author">{{ item.author }}</div>
          <div class="item-price" @click="openExchangePopup(item)">{{ item.price }}福币</div>
        </div>
      </div>
    </div>

    <!-- 确认兑换的弹窗 -->
    <div v-if="showExchangePopup" class="popup">
      <div class="popup-content">
        <h3>确认兑换</h3>
        <p>{{ selectedItem.title }}</p>
        <p>余额： FUB {{ userBalance }}</p>
        <button @click="closePopup">取消</button>
        <button @click="confirmExchange">确定</button>
      </div>
    </div>

    <!-- 兑换成功的弹窗 -->
    <div v-if="showSuccessPopup" class="popup">
      <div class="popup-content">
        <h3>兑换成功 (＾︿＾)</h3>
        <p>{{ selectedItem.title }}</p>
        <p>余额： FUB {{ userBalance }}</p>
        <button @click="modifyAddress">点击填写楼号#</button>
      </div>
    </div>

    <!-- 修改收件地址的弹窗 -->
    <div v-if="showModifyAddressPopup" class="popup">
      <div class="popup-content">
        <h3>收件地址</h3>
        <input v-model="address" placeholder="输入收件地址" />
        <button @click="confirmModifyAddress">确认修改</button>
      </div>
    </div>

    <!-- 确认收件的弹窗 -->
    <div v-if="showConfirmReceivePopup" class="popup">
      <div class="popup-content">
        <h3>感谢填写（･≧︿≦）</h3>
        <p>小研将在一星期内为您派送，请注意查收&gt;&lt;</p>
        <button @click="closePopup">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'welfare',
      welfareItems: [
        {
          title: '2025考研政治背读手册',
          author: '肖秀荣 编',
          price: 1221,
          image: '/static/zz.jpg',
        },
        {
          title: '2025王道考研数据结构',
          author: '王道 编',
          price: 408,
          image: '/static/sjjg.jpg',
        },
      ],
      showExchangePopup: false,
      showSuccessPopup: false,
      showModifyAddressPopup: false,
      showConfirmReceivePopup: false,
      selectedItem: null,
      userBalance: 2240,
      address: '',
    };
  },
  methods: {
    goBack() {
      // 返回上一页的逻辑
      this.$router.go(-1);
    },
    openSearch() {
      // 打开搜索的逻辑
      console.log('搜索按钮点击');
    },
    switchTab(tab) {
      this.activeTab = tab;
    },
    openExchangePopup(item) {
      this.selectedItem = item;
      this.showExchangePopup = true;
    },
    closePopup() {
      this.showExchangePopup = false;
      this.showSuccessPopup = false;
      this.showModifyAddressPopup = false;
      this.showConfirmReceivePopup = false;
    },
    confirmExchange() {
      if (this.userBalance >= this.selectedItem.price) {
        this.userBalance -= this.selectedItem.price;
        this.showExchangePopup = false;
        this.showSuccessPopup = true;
      } else {
        alert('福币不足');
      }
    },
    modifyAddress() {
      this.showSuccessPopup = false;
      this.showModifyAddressPopup = true;
    },
    confirmModifyAddress() {
      this.showModifyAddressPopup = false;
      this.showConfirmReceivePopup = true;
    },
  },
};
</script>

<style scoped>
.store-page {
  padding: 20px;
  background-color: #ffffff;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.back-icon,
.search-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.tab-bar {
  display: flex;
  margin: 20px 0;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  color: #666;
}

.tab.active {
  color: #e74c3c;
  border-bottom: 2px solid #e74c3c;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-card {
  display: flex;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 80px;
  height: 100px;
  border-radius: 5px;
  margin-right: 15px;
}

.item-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-title {
  font-size: 16px;
  font-weight: bold;
}

.item-author {
  font-size: 14px;
  color: #999;
}

.item-price {
  font-size: 14px;
  color: #e74c3c;
  font-weight: bold;
  align-self: flex-end;
  cursor: pointer;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 80%;
  max-width: 300px;
}

.popup-content h3 {
  color: #e74c3c;
  margin-bottom: 20px;
}

.popup-content p {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.popup-content input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.popup-content button {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.popup-content button:nth-child(3) {
  background-color: #e74c3c;
  color: #ffffff;
}
</style>
