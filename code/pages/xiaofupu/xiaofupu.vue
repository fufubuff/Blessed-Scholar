<template>

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
          <div class="item-price" @click="openExchangePopup(item)">
            <span class="price-circle">{{ item.price }}福币</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 已兑换商品列表 -->
    <div v-if="activeTab === 'exchanged'" class="item-list">
      <div v-if="exchangedItems.length" class="item-card" v-for="(item, index) in exchangedItems" :key="index">
        <image class="item-image" :src="item.image" />
        <div class="item-info">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-author">{{ item.author }}</div>
          <div class="item-price">
            <span class="price-circle">{{ item.price }}福币</span>
          </div>
        </div>
      </div>
      <div v-else class="no-items">暂无已兑换商品</div>
    </div>

    <!-- 确认兑换的弹窗 -->
    <div v-if="showExchangePopup" class="popup">
      <div class="popup-content exchange-popup">
        <h3>确认兑换</h3>
        <p class="item-title">{{ selectedItem.title }}</p>
        <p class="balance">余额： FUB {{ userBalance }}</p>
        <div class="button-group">
          <button class="cancel-button" @click="closePopup">取消</button>
          <button class="confirm-button" @click="confirmExchange">确定</button>
        </div>
      </div>
    </div>

    <!-- 兑换成功的弹窗 -->
    <div v-if="showSuccessPopup" class="popup">
      <div class="popup-content success-popup">
        <h3>兑换成功 (＾︿＾)</h3>
        <p class="item-title">{{ selectedItem.title }}</p>
        <p class="balance">余额： FUB {{ userBalance }}</p>
        <button class="confirm-button" @click="modifyAddress">点击填写楼号#</button>
      </div>
    </div>

    <!-- 修改收件地址的弹窗 -->
    <div v-if="showModifyAddressPopup" class="popup">
      <div class="popup-content address-popup">
        <h3>收件地址</h3>
        <input class="address-input" v-model="address" placeholder="输入收件地址" />
        <button class="confirm-button" @click="confirmModifyAddress">确认修改</button>
      </div>
    </div>

    <!-- 确认收件的弹窗 -->
    <div v-if="showConfirmReceivePopup" class="popup">
      <div class="popup-content receive-popup">
        <h3>感谢填写 (･≧︿≦)</h3>
        <p>小研将在一星期内为您派送，请注意查收&gt;&lt;</p>
        <button class="confirm-button" @click="closePopup">确认</button>
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
      exchangedItems: [],
      showExchangePopup: false,
      showSuccessPopup: false,
      showModifyAddressPopup: false,
      showConfirmReceivePopup: false,
      selectedItem: null,
	  userBalance: 0, // 用户福币余额
      address: '11#451',
    };
  },
  async created() {
      // 获取用户福币余额
      await this.fetchUserBalance();
      
    },
  methods: {
	  
	  // 获取用户福币余额
	      async fetchUserBalance() {
	        try {
	          const userId = uni.getStorageSync('user_id'); // 获取当前用户ID
	          const response = await uniCloud.callFunction({
	            name: 'getUserFubInfo',
	            data: { user_id: userId }
	          });
	  
	          if (response.result.code === 0) {
	            this.userBalance = response.result.data.fub; // 更新福币余额
	          } else {
	            uni.showToast({ title: '获取福币信息失败', icon: 'none' });
	          }
	        } catch (error) {
	          console.error('Error fetching user balance:', error);
	          uni.showToast({ title: '获取福币余额失败', icon: 'none' });
	        }
	      },
		  
    goBack() {
      this.$router.go(-1);
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
	
    // 确认兑换操作
        async confirmExchange() {
          if (this.selectedItem.price > this.userBalance) {
            uni.showToast({ title: '福币余额不足，无法兑换', icon: 'none' });
            return;
          }
    
          const userId = uni.getStorageSync('user_id'); // 获取当前用户ID
          const { id, title, price } = this.selectedItem;
          const date = new Date().toISOString().split('T')[0]; // 格式化日期为 'YYYY-MM-DD'
    
          // 1. 更新福币余额
            try {
              const updateScoreResponse = await uniCloud.callFunction({
                name: 'updateUserScore',
                data: {
                  user_id: userId,
                  scoreChange: -price // 扣除兑换的福币
                }
              });
          
              if (updateScoreResponse.result.code === 0) {
                // 2. 更新前端余额
                this.userBalance -= price; // 直接更新前端的余额
                uni.showToast({ title: '兑换成功', icon: 'success' });
          
                // 3. 生成交易记录
                const transactionResponse = await uniCloud.callFunction({
                  name: 'addTransactionRecord',
                  data: {
                    user_id: userId,
                    description: `兑换${title}`,
                    amount: -price, // 扣除福币
                    date: date
                  }
                });
          
                if (transactionResponse.result.code !== 0) {
                  uni.showToast({ title: '交易记录添加失败', icon: 'none' });
                }
          
                // 4. 将已兑换商品添加到已兑换列表
                      this.exchangedItems.push(this.selectedItem); // 将兑换的商品加入已兑换列表
                
                      // 5. 关闭兑换弹窗
                      this.showExchangePopup = false;
                
                      // 6. 显示填写收件地址的弹窗
                      this.showModifyAddressPopup = true; // 弹出地址填写弹窗
                
                    } else {
                      uni.showToast({ title: '福币更新失败', icon: 'none' });
                    }
                  } catch (error) {
                    console.error('Error during exchange:', error);
                    uni.showToast({ title: '兑换失败', icon: 'none' });
                  }
          },
		  
		  // 确认修改地址后，显示确认收件弹窗
		  async confirmModifyAddress() {
		    if (!this.address.trim()) {
		      uni.showToast({ title: '请输入收件地址', icon: 'none' });
		      return;
		    }
			
		  // 7. 显示确认收件的弹窗
		    this.showModifyAddressPopup = false; // 关闭修改地址弹窗
		    this.showConfirmReceivePopup = true; // 显示确认收件弹窗	  
	}
  }
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

.price-circle {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  border-radius: 20px;
  font-size: 14px;
}

.no-items {
  text-align: center;
  color: #999;
  font-size: 16px;
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
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  width: 80%;
  max-width: 300px;
}

.exchange-popup h3,
.success-popup h3,
.address-popup h3,
.receive-popup h3 {
  color: #e74c3c;
  font-size: 18px;
  margin-bottom: 15px;
}

.item-title,
.balance {
  font-size: 16px;
  color: #333;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.cancel-button,
.confirm-button {
  background-color: transparent;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.cancel-button {
  color: #333;
}

.confirm-button {
  color: #e74c3c;
}

.address-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin: 20px 0;
}
</style>
