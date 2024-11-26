<template>
    <view>
        <!-- 导航 -->
        <view class="uni-page-head status_bar" style="top: 0;">
            <view class="flex_space" style="flex:1">
                <svg @click="toBack" width="26" height="26" viewBox="0 0 32 32"><path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="#000000"></path></svg>
                <view class="uni-page-head__title">上传资料</view>
                <view @click="updateInformation" style="margin-right: 10rpx;" class="color">发布</view>
            </view>
        </view>
        <view style="height: 44px;"></view>
        <view class="form">
            <view class="form-title">
                <image style="width: 34rpx;height: 34rpx;" src="../../static/information.png"></image>
                <input v-model="title" class="input-title" placeholder="资料标题" />
            </view>
            <view class="form-item">
                <view class="label">资料类型选择</view>
                <picker style="flex:1;text-align: right;" @change="bindTypeChange" :value="typeIndex" :range="infoTypes">
                    <view class="uni-input">{{typeIndex==-1?'请选择':infoTypes[typeIndex]}}</view>
                </picker>
            </view>
            <view class="form-item">
                <view class="label">资料科目选择</view>
                <picker style="flex:1;text-align: right;" @change="bindSubjectChange" :value="subjectIndex" :range="subjectTypes">
                    <view class="uni-input">{{subjectIndex==-1?'请选择':subjectTypes[subjectIndex]}}</view>
                </picker>
            </view>
            <view class="form-item">
                <view class="label">上传资料封面</view>
                <view @click="chooseImage" style="background: rgb(229, 229, 229);height: 100rpx;width: 200rpx;text-align: center;line-height: 130rpx;">
                    <svg style="color:rgb(141, 158, 167);width:68rpx;height: 62rpx;" viewBox="0 0 32 32"><path fill="rgb(141, 158, 167)" fill-rule="evenodd" d="M23 10H10v12h13V10ZM10 8a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h13a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H10Z" clip-rule="evenodd"></path><path fill="rgb(141, 158, 167)" d="M15 13.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM11 22h3l4.58-4.2L23 21v-2.5l-3.25-2.32a2 2 0 0 0-2.53.15L11 22Z"></path></svg>
                </view>
            </view>
            <view class="form-item" style="align-items:flex-start">
                <image style="width: 40rpx;height: 40rpx;margin-top: 25rpx;" src="../../static/write.png"></image>
                <textarea v-model="content" placeholder="输入资料资源的查看或者下载链接..." class="form-content" />
            </view>
        </view>
    </view>
</template>

<script scoped>
    export default {
        data() {
            return {
                typeIndex: -1,
                subjectIndex: -1,
                infoTypes: ['小研题库', '课程中心'],
                subjectTypes: ['专业课', '英语', '数学', '思政'],
                title: '',
                content: '',
                coverUrl: '',
                _id: '' // 如果有需要更新的数据的 _id，可以在这里设置
            }
        },
        methods: {
            bindTypeChange: function(e) {
                this.typeIndex = e.detail.value;
            },
            bindSubjectChange: function(e) {
                this.subjectIndex = e.detail.value;
            },
            toSearch() {
                uni.navigateTo({
                    url: '/pages/study/search'
                })
            },
            toBack() {
            uni.navigateBack();
            },
            switchTab(index) {
                this.activeIndex = index;
            },
            async chooseImage() {
                try {
                    const { tempFilePaths } = await uni.chooseImage({
                        count: 1, // 限制选择一张图片
                        sourceType: ['album', 'camera'] // 可以选择相册或相机
                    });

                    if (!tempFilePaths.length) {
                        throw new Error('未选择图片');
                    }

                    const filePath = tempFilePaths[0];
                    const cloudPath = `backgrounds/${Date.now()}-${filePath.split('/').pop()}`;

                    const uploadRes = await uniCloud.uploadFile({
                        cloudPath,
                        filePath
                    });

                    if (!uploadRes.fileID) {
                        throw new Error('文件上传失败，未获取到 fileID');
                    }

                    // 获取文件的 URL
                    const fileUrlRes = await uniCloud.getTempFileURL({
                        fileList: [uploadRes.fileID]
                    });

                    if (fileUrlRes.fileList.length > 0 && fileUrlRes.fileList[0].tempFileURL) {
                        this.coverUrl = fileUrlRes.fileList[0].tempFileURL;
                        console.log('封面图片URL:', this.coverUrl);
                    } else {
                        throw new Error('获取文件URL失败');
                    }

                    uni.showToast({
                        title: '封面上传成功',
                        icon: 'success'
                    });
                } catch (error) {
                    uni.showToast({
                        title: error.message || '上传失败，请重试',
                        icon: 'none'
                    });
                }
            },
            async updateInformation() {
                const date = new Date().toISOString().split('T')[0];
                let subject = '';
                switch (this.subjectIndex) {
                    case 0:
                        subject = 'main';
                        break;
                    case 1:
                        subject = 'english';
                        break;
                    case 2:
                        subject = 'math';
                        break;
                    case 3:
                        subject = 'politics';
                        break;
                    default:
                        console.log('未选择有效的资料科目');
                        return;
                }

                let data = {
                    title: this.title,
                    subject: subject,
                    cover_url: this.coverUrl,
                    date: date,
                    link: this.content
                };

                let collectionName = '';
                if (this.infoTypes[this.typeIndex] === '课程中心') {
                    collectionName = 'course';
                    data.course_name = data.title;
                    delete data.title;
                } else if (this.infoTypes[this.typeIndex] === '小研题库') {
                    collectionName = 'topic';
                    data.topic_name = data.title;
                    delete data.title;
                } else {
                    console.log('未选择有效的资料类型');
                    return;
                }

                try {
                    const res = await uniCloud.callFunction({
                        name: 'updateInformation',
                        data: {
                            collection: collectionName,
                            data: data,
                            _id: this._id // 如果有 _id 则传递
                        }
                    });
                    console.log('发布成功:', res);
                } catch (error) {
                    console.error('发布失败:', error);
                }
				uni.reLaunch({
				    url: '/pages/study/index'
				});
            }
        }
    }
</script>

<style>
page {
    background-color: #fff;
}
.color {
    color: rgb(189, 49, 36);
}
.status_bar {
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
}
.flex_space {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.form {
    padding: 0 30rpx;
    margin-top: 20rpx;
}
.form-title {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(189, 49, 36);
}
.input-title {
    padding: 15rpx 0;
    flex: 1;
    margin-left: 15rpx;
}
.label {
    color: rgb(189, 49, 36);
}
.form-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 40rpx 0;
}
.form-content {
    width: 100%;
    margin-left: 20rpx;
    margin-top: 20rpx;
}
</style>