<template>
    <web-view :src="url"></web-view>
</template>

<script>
export default {
    data() {
        return {
            url: ''
        };
    },
    onLoad(options) {
        if (options.url) {
            try {
                this.url = decodeURIComponent(options.url);
            } catch (error) {
                console.error('URL 解码失败:', error);
                uni.showToast({
                    title: '无效的链接',
                    icon: 'none'
                });
            }
        }
    }
};
</script>

<style scoped>
web-view {
    width: 100%;
    height: 100%;
}
</style>