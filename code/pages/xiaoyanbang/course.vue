<template>
	<view>
		<!-- 导航 -->
		<view class="uni-page-head status_bar" style="top: 0;">
			<view class="flex_space" style="flex:1">
				<svg @click="toBack" width="26" height="26" viewBox="0 0 32 32"><path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="#000000"></path></svg>
				<view class="uni-page-head__title">课程中心</view>
				<image style="width: 67rpx;height: 57rpx;" src="../../static/search.png" @click="toSearch"></image>
			</view>
		</view>
		<view style="height: 44px;"></view>
		<view class="flex_space tabs">
			<view @click="switchTab(index)" :class="{'tab_active':index==activeIndex}" v-for="(item,index) in tabs">{{item}}</view>
		</view>
		<view class="list">
			<view class="item" v-for="item in 10">
				<image class="item_index" src="https://tpcdn.pointpen.cn/temp/3147e1c70b714c96be73f9f3458c057d.png" mode="aspectFill"></image>
				<view class="item_body">
					<view class="item_title">计算机组成原理</view>
					<view style="color:#a5a4a4">24-10-28</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs:['专业课','英语','数学','思政'],
				activeIndex:0,
			}
		},
		methods: {
			toSearch(){
				uni.navigateTo({
					url:'/pages/study/search'
				})
			},
			toBack(){
				uni.navigateBack()
			},	
			switchTab(index){
				this.activeIndex = index;
			}
		}
	}
</script>

<style scoped>
page{
	background-color: #f6f8fa;
}
.status_bar{
	background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);
}
.flex_space{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.tabs{
	background-color: #fff;
	padding:0 30rpx;
	font-weight: bold;
	border-bottom: 1px solid #e1e1e1;
	color:rgb(203, 203, 203);
}
.tabs>view{
	padding-top: 20rpx;
	padding-bottom: 15rpx;
}
.tab_active{
	color:rgb(189,49,36);
	border-bottom: 2px solid rgb(189,49,36);
}
.list{
	padding:0 30rpx;
	
}
.item{
	background-color: #fff;
	margin-top: 30rpx;
	padding: 30rpx;
	border-radius: 20rpx;
	box-shadow: 1px 2px 6px 1px rgb(143 139 139 / 10%);
	display: flex;
}
.item_index{
	width: 120rpx;
	height: 120rpx;
	margin-right: 20rpx;
}
.item_title{
	margin-bottom: 20rpx;
}
</style>
