<template>
	<view>
		<!-- 导航 -->
		<view class="uni-page-head status_bar" style="top: 0;">
			<view class="flex_space" style="flex:1">
				<svg @click="toBack" width="26" height="26" viewBox="0 0 32 32"><path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="#000000"></path></svg>
				<view class="uni-page-head__title">小研快讯</view>
				<image style="width: 67rpx;height: 57rpx;" src="../../static/search.png" @click="toSearch"></image>
			</view>
		</view>
		<view style="height: 44px;"></view>
		<view class="list">
			<view class="item" @click="toDetail">
				<view class="title">注意：25考研各省市网上确认时间及要求</view>
				<view class="flex_space content">
					<view style="margin-right: 15rpx;">
						<view class="desc">提醒：预报名阶段已提交报名信息的考生无需重复报名, 未报名的考...</view>
						<view style="margin-top: 20rpx;color:#a5a4a4">2024-10-17</view>
					</view>
					<image class="img" src="https://tpcdn.pointpen.cn/temp/3147e1c70b714c96be73f9f3458c057d.png" mode=""></image>
				</view>
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
			toSearch(){
				uni.navigateTo({
					url:'/pages/study/search'
				})
			},
			toBack(){
				uni.navigateBack()
			},
			toDetail(){
				uni.navigateTo({
					url:'/pages/study/detail'
				})
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
.list{
	padding:0 30rpx;
	
}
.item{
	background-color: #fff;
	margin-top: 30rpx;
	padding: 30rpx;
	border-radius: 20rpx;
	box-shadow: 1px 2px 6px 1px rgb(143 139 139 / 10%);
}
.title{
	font-weight: bold;
	
}
.content{
	font-size: 28rpx;
	align-items: normal;
	margin-top: 20rpx;
}
.desc{
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	/*! autoprefixer: off */
	-webkit-box-orient: vertical;

}
.img{
	width: 400rpx;
	border-radius: 10rpx;
	height: 150rpx;
	
}
</style>
