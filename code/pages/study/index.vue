<template>
	<view>
		<!-- 导航栏 -->
		<view class="status_bar">
		   <view class="status_title">小研帮</view>
		   <image style="width: 77rpx;height: 67rpx;" src="../../static/search.png" @click="toUrl('/pages/study/search')"></image>
		</view>
		<!-- 图片 -->
		<view>
			<image style="width: 100%;border-radius: 20rpx;" mode="widthFix" src="../../static/3147e1c70b714c96be73f9f3458c057d.jpg"></image>
		</view>
		<!-- 选项 -->
		<view class="tabs">
			<view class="tab" @click="toUrl('/pages/study/course')">
				<image class="tab_img" src="../../static/course_center.png"></image>
				<view>课程中心</view>
			</view>
			<view class="tab" @click="toUrl('/pages/study/topics')">
				<image class="tab_img" src="../../static/xiaoyan_topic.png"></image>
				<view>小研题库</view>
			</view>
			<view class="tab" @click="toUrl('/pages/study/list')">
				<image class="tab_img" src="../../static/xiaoyan_alerts.png"></image>
				<view>小研快讯</view>
			</view>
			<view class="tab" @click="toUrl('/pages/study/upload')">
				<image class="tab_img" src="../../static/xiaoyan_alerts.png"></image>
				<view>资料上传</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="list">
			<view class="item" v-for="item in 3">
				<image class="item_img" mode="aspectFill" src="../../static/3147e1c70b714c96be73f9f3458c057d.jpg"/>
				<view class="item_body">
					<view class="item_title">宋浩高等数学</view>
					<view class="item_desc">13次课程逆袭考研</view>
					<view class="item_btn">点击看课</view>
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
			toUrl(url){
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>

<style scoped>
page{
	padding: 0 30rpx;
	font-size: 27rpx;
}
.status_bar{
	margin-top: 20rpx;
	margin-bottom: 40rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.status_title{
	color: rgb(189, 49, 36);
	font-size: 35rpx;
	font-weight: bold;
}
.tabs{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.tab{
	text-align: center;
	color:rgb(189, 49, 36);
	margin-top: 30rpx;
	padding: 0 30rpx;
}
.tab_img{
	 width: 60rpx;height: 60rpx;
}
.list{
	margin-top: 30rpx;;
}
.item{
	position: relative;
	height: 270rpx;
	margin-bottom: 20rpx;
}
.item_img{
	height: 270rpx;
	width: 100%;border-radius: 20rpx;
}
.item_body{
	position: absolute;right:50rpx;top: 50rpx;text-align: right;
	color:#ccc;
}
.item_title{
	font-size: 40rpx;
	font-weight: bold;
}
.item_desc{
	margin-bottom: 10rpx;
}
.item_btn{
	color: #fff;
	background-color: rgb(189, 49, 36);
	border-radius: 100rpx;
	padding: 10rpx;
	display: inline;
	font-size: 25rpx;
}
</style>
