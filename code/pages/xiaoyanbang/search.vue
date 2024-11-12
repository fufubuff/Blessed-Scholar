<template>
	<view>
		<view class="top">
			<!-- 搜索栏 -->
			<view class="status_bar flex_space">
			    <svg @click="toBack" width="26" height="26" viewBox="0 0 32 32"><path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="#000000"></path></svg>
			   <input class="uni-input" focus placeholder="为研友加急搜索中" />
			   <image style="width: 48rpx;height: 48rpx;" src="../../static/search_active.png"></image>
			</view>
			<view class="flex_space" style="margin-bottom:20rpx;">
				<view class="item">
					<image style="width:35rpx;height: 35rpx;margin-right: 5rpx;" src="../../static/information.png"></image>
					<view>资料</view>
				</view>
				<view class="item">
					<image style="width:35rpx;height: 35rpx;margin-right: 5rpx;" src="../../static/gas_station.png"></image>
					<view>加油站</view>
				</view>
				<view class="item">
					<image style="width:35rpx;height: 35rpx;margin-right: 5rpx;" src="../../static/ask_qusetion.png"></image>
					<view>求解答</view>
				</view>
				<view class="item">
					<image style="width:35rpx;height: 35rpx;margin-right: 5rpx;" src="../../static/Alerts.png"></image>
					<view>快讯</view>
				</view>
				<view class="item">
					<image style="width:35rpx;height: 35rpx;margin-right: 5rpx;" src="../../static/user.png"></image>
					<view>用户</view>
				</view>
			</view>
		</view>
		<view style="background-color: #f6f8fa;height: 40rpx;"></view>
		<view class="top">
			<view class="flex_space">
				<view class="title">历史记录</view>
				<svg xmlns="http://www.w3.org/2000/svg" class="fill" viewBox="0 0 32 32" width="20" height="20"><defs></defs><g><path d="M25.6 8.864h-9.344c-3.296 0-6.592-0.032-9.888 0-1.664 0.032-2.048 0.448-1.824 2.080 0.864 6.336 1.76 12.672 2.688 19.008 0.224 1.696 0.64 2.048 2.368 2.048h13.28c1.888 0 2.304-0.48 2.528-2.336 0.736-6.080 1.504-12.192 2.272-18.24 0.288-2.112 0-2.528-2.080-2.56zM11.072 28.64c-1.056 0.16-1.472-0.704-1.568-1.632-0.544-4.384-1.024-8.768-1.536-13.152-0.096-0.864 0.16-1.6 1.056-1.76 1.024-0.16 1.504 0.544 1.6 1.44 0.352 2.592 0.64 5.184 0.96 7.776 0.224 1.792 0.416 3.584 0.608 5.376 0.096 0.928-0.032 1.824-1.12 1.952zM17.504 27.008c0 0.896-0.384 1.696-1.344 1.664-1.056 0-1.344-0.832-1.344-1.792 0.032-2.176 0-4.352 0-6.496h-0.032c0-2.176 0.032-4.32 0-6.496 0-0.928 0.16-1.824 1.248-1.888 1.12-0.032 1.44 0.832 1.44 1.76 0.032 4.416 0.032 8.832 0.032 13.248zM24.448 13.984c-0.544 4.384-1.088 8.768-1.664 13.12-0.096 0.896-0.576 1.664-1.536 1.504-1.056-0.128-1.248-0.992-1.088-1.952 0.288-2.144 0.512-4.288 0.8-6.432s0.544-4.288 0.8-6.432c0.128-0.928 0.384-1.792 1.504-1.728 1.088 0.096 1.28 0.992 1.184 1.92zM13.6 2.752c0.512-2.656 0.8-2.944 2.592-2.656 3.072 0.48 3.168 0.576 2.752 3.552 2.368 0.416 4.736 0.864 7.136 1.248 1.024 0.16 1.952 0.416 1.792 1.696-0.192 1.344-1.312 1.184-2.24 1.024-5.504-0.928-11.008-1.888-16.512-2.848-1.184-0.192-2.4-0.448-3.584-0.608-0.96-0.16-1.536-0.64-1.376-1.632 0.192-1.024 0.96-1.248 1.856-1.088 2.528 0.448 5.056 0.896 7.584 1.312z"></path></g></svg>
			</view>
			<view  class="flex_space history_list">
				<view class="item_text" v-for="item in 10">内容1</view>
			</view>
		</view>
		<view class="top" style="margin-top: 30rpx;">
			<view class="flex_space">
				<view class="title">猜你想搜</view>
			</view>
			<view  class="flex_space history_list">
				<view class="item_text">内容1</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			toBack(){
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
page{
	
	font-size: 27rpx;
	background-color: #fff;
	
}
.top{
	
	padding: 0 30rpx;
	padding-top: 20rpx;
}
.uni-input{
	background-color: #f6f8fa;
	padding: 12rpx 30rpx;
	flex: 1;
	margin:0 40rpx;
	border-radius: 50rpx;
	font-size: 30rpx;
}
.flex_space{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.item{
	font-weight: bold;
	color:rgb(189, 49, 36);
	display: flex;
	align-items: center;
}
.status_bar{
	margin-bottom: 30rpx;
}
.title{
	font-size: 32rpx;
}
.history_list{
	
	justify-content: normal;
	flex-wrap: wrap;
}
.item_text{
	margin-top: 20rpx;
	margin-right: 10rpx;
	padding: 5rpx 20rpx;
	border: 1px solid #ccc;
	border-radius: 50rpx;
}
.fill{
	fill:rgb(189, 49, 36);
}
</style>
