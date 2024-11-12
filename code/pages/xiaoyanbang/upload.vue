<template>
	<view>
		<!-- 导航 -->
		<view class="uni-page-head status_bar" style="top: 0;">
			<view class="flex_space" style="flex:1">
				<svg width="26" height="26" viewBox="0 0 32 32"><path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="#000000"></path></svg>
				<view class="uni-page-head__title">上传资料</view>
				<view style="margin-right: 10rpx;" class="color">发布</view>
			</view>
		</view>
		<view style="height: 44px;"></view>
		<view class="form">
			<view class="form-title">
				<image style="width: 34rpx;height: 34rpx;" src="../../static/information.png"></image>
				<input class="input-title" placeholder="资料标题" />
			</view>
			<view class="form-item">
				<view class="label">资料类型选择</view>
				<picker style="flex:1;text-align: right;" @change="bindPickerChange" :value="index" :range="infoTypes">
					<view class="uni-input">{{index==-1?'请选择':infoTypes[index]}}</view>
				</picker>
			</view>
			<view class="form-item">
				<view class="label">上传文件列表</view>
				<view>添加</view>
			</view>
			<view class="form-item">
				<view class="label">上传资料封面</view>
				<view>上传</view>
			</view>
			<view>
				<view class="label">资料内容</view>
				<textarea placeholder="资料内容" class="form-content" />
			</view>
		</view>
	</view>
</template>

<script scoped>
	export default {
		data() {
			return {
				index:-1,
			 infoTypes:['小研快讯','小研题库-专业课','课程中心-专业课']
			}
		},
		methods: {
			 bindPickerChange: function(e) {
			    this.index = e.detail.value
			},
			toSearch(){
				uni.navigateTo({
					url:'/pages/study/search'
				})
			},
			switchTab(index){
				this.activeIndex = index;
			}
		}
	}
</script>

<style>
page{
	background-color: #fff;
}
.color{
	color:rgb(189,49,36);
}
.status_bar{
	background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);
}
.flex_space{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.form{
	padding:0 30rpx;
	margin-top: 20rpx;
}
.form-title{
	display: flex;
	align-items: center;
	border-bottom: 1px solid rgb(189,49,36);;
}
.input-title{
	padding:15rpx 0;
	flex: 1;
	margin-left: 15rpx;
}
.label{
	color:rgb(189,49,36);
}
.form-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin:40rpx 0;
}
.form-content{
	width: 100%;
	margin-top: 20rpx;
	border: 1px solid #e1e1e1;
}
</style>
