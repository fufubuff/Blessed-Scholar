<template>
  <div class="product-page">
    <!-- 图片和标题区域 -->
    <div class="header">
      <div class="top-left">
        <div class="year-tag">2025</div>
        <div class="tags">
          <div class="official-tag">
            <span>官方直营店</span>
            <span>依据新大纲</span>
          </div>
          <div class="promo-banner">
            <span>福小研指定店 现货速发</span>
          </div>
          <div class="shipping-info">
            <span>顺丰包邮</span>
          </div>
        </div>
      </div>
      <img class="product-image" src="/static/zz.jpg" alt="肖秀荣背诵手册" />
      <div class="product-title">肖秀荣背诵手册</div>
    </div>

    <div class="gifts">
      <div class="gift-item">
        <span>🎁 2025肖秀荣考研政治背诵手册 肖肖诵笔记冲刺时政形势与政策 核心考案...</span>
      </div>
    </div>

    <div class="gift-description">
      <span>🎉 赠送：肖老190题+带背音频+真题</span>
    </div>

    <div class="price-info">
      <div class="price">
        <span>¥19.8</span>
        <span class="sold-count">已售 8万+</span>
      </div>
    </div>

    <div class="promotions">
      <button>加赠</button>
      <button>云闪付满减</button>
      <button>商品券满60减5</button>
    </div>

    <!-- 浮窗描述 -->
    <div v-if="showFloatingText" class="floating-text">
      <span>24小时内300+人已买，145人评价‘纸张品质好’，超过3000条评价</span>
    </div>

    <div class="logistics">
      <div class="shipping">
        <span>预计今天发货，后天送达 上海 快递：免运费</span>
      </div>
      <div class="guarantees">
        <span>买贵必赔</span>
        <span>退货宝</span>
        <span>假一赔四</span>
        <span>极速退款 7天无理由</span>
      </div>
    </div>

    <div class="buttons">
      <button class="add-to-cart" @click="addToCart">加入购物车</button>
      <button class="buy-now" @click="openBuyNowPopup">立即购买</button>
    </div>

    <!-- 购买弹窗 -->
    <div v-if="showBuyNowPopup" class="popup">
      <div class="popup-content buy-now-popup">
        <h3>立即购买</h3>
        <p class="item-title">{{ productTitle }}</p>
        <p class="balance">福币余额： FUB {{ userBalance }}</p>
        <p>售价：1221 福币</p>
        <div class="button-group">
          <button class="cancel-button" @click="closePopup">取消</button>
          <button class="confirm-button" @click="openPaymentMethodPopup">确定</button>
        </div>
      </div>
    </div>

    <!-- 支付方式选择弹窗 -->
    <div v-if="showPaymentMethodPopup" class="popup">
      <div class="popup-content payment-method-popup">
        <h3>选择支付方式</h3>
        <button class="confirm-button" @click="payWithFub">福币支付</button>
        <button class="confirm-button" @click="payWithAlipay">支付宝支付</button>
        <button class="cancel-button" @click="closePopup">取消</button>
      </div>
    </div>

    <!-- 福币支付弹窗 -->
    <div v-if="showFubPaymentPopup" class="popup">
      <div class="popup-content fub-payment-popup">
        <h3>福币支付</h3>
        <p class="item-title">{{ productTitle }}</p>
        <p class="balance">福币余额： FUB {{ userBalance }}</p>
    
        <!-- 新增的提示内容 -->
        <p v-if="userBalance < price" class="alert-text">福币余额不足，无法完成支付。</p>
        <p v-else class="alert-text">确认支付 {{ price }} 福币吗？</p>
    
        <div class="button-group">
          <button class="cancel-button" @click="closePopup">取消</button>
          <button v-if="userBalance >= price" class="confirm-button" @click="confirmFubPayment">确认支付</button>
          <button v-else class="confirm-button" disabled>余额不足</button>
        </div>
      </div>
    </div>
    <!-- 支付宝支付弹窗 -->
    <div v-if="showAlipayPopup" class="popup">
      <div class="popup-content alipay-popup">
        <h3>支付宝支付</h3>
        <p class="item-title">{{ productTitle }}</p>
        <p>支付信息：待填写</p>
        <div class="button-group">
          <button class="cancel-button" @click="closePopup">取消</button>
          <button class="confirm-button" @click="confirmAlipayPayment">确认支付</button>
        </div>
      </div>
    </div>

    <!-- 加入购物车弹窗 -->
    <div v-if="showAddToCartPopup" class="popup">
      <div class="popup-content add-to-cart-popup">
        <h3>已加入购物车</h3>
        <p>{{ productTitle }} 已成功加入购物车</p>
        <div class="button-group">
          <button class="cancel-button" @click="closeAddToCartPopup">关闭</button>
          <button class="confirm-button" @click="goToCart">查看购物车</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductPage",
  data() {
    return {
      price: 1221,
      soldCount: 80000,
      userBalance: 10000, // 假设用户福币余额
      productTitle: "肖秀荣背诵手册", // 商品标题
      showFloatingText: true, // 控制浮窗是否显示
      showBuyNowPopup: false, // 控制购买弹窗显示
      showPaymentMethodPopup: false, // 控制支付方式选择弹窗显示
      showFubPaymentPopup: false, // 控制福币支付弹窗显示
      showAlipayPopup: false, // 控制支付宝支付弹窗显示
      showAddToCartPopup: false, // 控制加入购物车弹窗显示
    };
  },
  methods: {
    openBuyNowPopup() {
      this.showBuyNowPopup = true;
    },
    closePopup() {
      this.showBuyNowPopup = false;
      this.showPaymentMethodPopup = false;
      this.showFubPaymentPopup = false;
      this.showAlipayPopup = false;
      this.showAddToCartPopup = false;
    },
    openPaymentMethodPopup() {
      this.showBuyNowPopup = false;
      this.showPaymentMethodPopup = true;
    },
    payWithFub() {
      if (this.userBalance >= this.price) {
        this.showPaymentMethodPopup = false;
        this.showFubPaymentPopup = true;
      } else {
        alert("福币余额不足");
      }
    },
    confirmFubPayment() {
      alert("支付成功！");
      this.closePopup();
    },
    payWithAlipay() {
      this.showPaymentMethodPopup = false;
      this.showAlipayPopup = true;
    },
    confirmAlipayPayment() {
      alert("支付成功！");
      this.closePopup();
    },
    addToCart() {
      this.showAddToCartPopup = true;
    },
    closeAddToCartPopup() {
      this.showAddToCartPopup = false;
    },
    goToCart() {
      alert("跳转到购物车页面");
    },
  },
  mounted() {
    // 页面加载后，10秒钟后隐藏浮窗
    setTimeout(() => {
      this.showFloatingText = false;
    }, 10000);
  },
};
</script>

<style scoped>
.product-page {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: auto;
  padding: 10px;
  background-color: #fff;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
}

.top-left {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 分配空间 */
  width: 100%;
}

.year-tag {
  background-color: red;
  color: white;
  padding: 5px;
  font-weight: bold;
  margin-right: 10px;
}

.tags {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  gap: 8px;
  font-size: 12px;
}

.official-tag, .promo-banner, .shipping-info {
  background-color: #f0f0f0;
  padding: 3px 6px;
  border-radius: 4px;
}

.product-image {
  width: 100%;
  height: auto;
  margin-top: 10px;
}

.product-title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
}

.gifts {
  text-align: left; /* 左对齐文字 */
  margin-top: 10px;
}

.gift-item {
  font-size: 16px;
  font-weight: bold;
}

.gift-description {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  color: #ff6600;
}

.price-info {
  background-color: red;
  color: white;
  padding: 18px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin-top: 12px;
}

.promotions {
  display: flex;
  justify-content: flex-start;
  gap: 5px;
  padding: 7px 0;
}

.promotions button {
  background-color: #ff6600;
  color: white;
  padding: 3px 8px;
  border: none;
  border-radius: 5px;
  font-size: 10px;
}

.product-description {
  padding: 15px;
  font-size: 17px;
  color: #000000;
}

.floating-text {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  z-index: 10;
}

.logistics {
  padding: 6px;
  font-size: 12px;
}

.guarantees {
  display: flex;
  justify-content: space-around;
  font-size: 12px;
  color: #ff8198;
}

.buttons {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  margin-top: 6px;
}
.alert-text {
  color: #ff4d4d;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

button[disabled] {
  background-color: #e0e0e0;
  color: #9e9e9e;
}

button {
  padding: 12px;
  font-size: 12px;
  cursor: pointer;
}

.add-to-cart {
  background-color: #ff9e9e;
}

.buy-now {
  background-color:#ff9e9e ;
  color: white;
}
</style>
