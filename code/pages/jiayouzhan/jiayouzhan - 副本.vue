<template>
  <view class="container">
	<view style="height: 20px;"></view>
    <!-- Header with title and search button -->
    <view class="header">
      <text class="title">小研圈</text>
      <icon type="search" size="24" class="search-icon" />
    </view>

    
    <!-- Tab Navigation -->
    <view class="tab-bar">
      <view class="tab-container" @click="setActiveTab('求解答')">
        <text class="tab" :class="{ active: activeTab === '求解答' }">求解答</text>
        <view v-if="activeTab === '求解答'" class="underline"></view>
      </view>
      <view class="tab-container" @click="setActiveTab('加油站')">
        <text class="tab" :class="{ active: activeTab === '加油站' }">加油站</text>
        <view v-if="activeTab === '加油站'" class="underline"></view>
      </view>
      <view class="tab-container" @click="setActiveTab('关注')">
        <text class="tab" :class="{ active: activeTab === '关注' }">关注</text>
        <view v-if="activeTab === '关注'" class="underline"></view>
      </view>
    </view>
    <view v-if="activeTab === '求解答'">
		<scroll-view scroll-y="true" class="post-list" v-if="activeTab === '求解答'">
		      <view v-for="(post, index) in posts" :key="index" class="post">
		        <view class="post-container">
		          <view class="post-header">
		            <image :src="post.authorAvatar" class="author-avatar" @error="handleImageError"/>
		
		            <view class="post-author-info">
		              <text class="post-author">{{ post.author }}</text>
		              <text class="post-date">{{ post.date }}</text>
		            </view>
		          </view>
		          <view class="post-content">
		            <text>{{ post.content }}</text>
					
		<view class="post-images" v-if="post.images.length">
		  <image v-for="(img, idx) in post.images" :src="img" :key="idx" class="post-image" @error="handleImageError" />
		</view>
		
		          </view>
		          <view class="post-actions">
		            <text class="followers-count">{{ post.followersCount }} 人正在关注</text>
		            <button class="answer-button"@click="navigateTo('postxijie')">回答</button>
		          </view>
		        </view>
		      </view>
		    </scroll-view>
		
		<!-- 在底部导航栏外面添加一个新图片元素，右下方 -->
		<view class="bottom-right-img" @click="navigateTo('publish')">
		  <image src="/static/0000.png" class="image-icon" />
		</view><!-- 图片可以更改 -->
    </view>
	<view v-if="activeTab === '加油站'">
		   <scroll-view  :scroll-y="true" style="height: calc(100vh - 180px);">
	  	   <!-- 横幅区域 -->
	  	   <view class="banner">
	  	     <!-- 显示横幅标题 -->
	  	     <view class="banner-title">21天高数模拟卷打卡活动招募令</view>
	  	     <!-- 显示横幅副标题 -->
	  	     <view class="banner-subtitle">每日一模拟，不模拟就淘汰～</view>
	  	     <view class="banner-bootom">
	  			 <!-- 显示另一横幅副标题 -->
	  			 <view class="banner-subtitle_min">来吧，一起坚持21天，做行动派！</view>
	  			 <view class="banner_btn">
					 <router-link to="/pages/jiayouzhan/jiayouzhan" style="color: white;text-decoration: none;">
						 了解详情
					 </router-link>
				 </view>
	  		 </view>
	  	   </view>
	  		
	  		<view class="jyz_li_box">
	  			<view class="jyz_li" v-for="(item,index) in jyzs" :key="item._id">
	  				   <view class="jyz_li_left">
	  					   <image :src="item.data.user_pho"></image>
	  				   </view>
	  				   <view class="jyz_li_right">
	  						<view class="jyz_li_userAndtime">
	  						   <view>{{ item.data.user_id }}</view>
	  						   <view>{{ item.data.chat_time }}</view>
	  						</view>
	  						<view class="jyz_li_desc">
	  							{{ item.data.user_chat }}
	  						</view>
	  						
	  						<view class="jyz_li_images">
	  							<image v-for="(jitem,jindex) in item.data.user_chat_pho" :src="jitem" mode="aspectFill" :key="jitem"></image>
	  						</view>
	  						
	  						 <view class="jyz_li_buts">
	  							  <view class="jyz_li_buts_item" >
	  									<image src="../../static/heart.png" class="jyz_li_buts_action-icon" />
	  									<!-- <image src="../../static/heart-filled.png"></image> -->
	  									<text class="jyz_li_action-text">{{ item.data.user_liked }}</text>
	  							  </view>
	  							  <view class="jyz_li_buts_item">
	  									<image src="../../static/star.png" class="jyz_li_buts_action-icon" />
	  									<!-- <image src="../../static/star-filled.png" class="jyz_li_buts_action-icon" /> -->
	  									<text class="jyz_li_action-text">{{ item.data.user_collected }}</text>
	  							  </view>
	  							  <view class="jyz_li_buts_item">
	  									<image src="../../static/chat.png" class="jyz_li_buts_action-icon" />
	  									<text class="jyz_li_action-text">{{ item.data.user_comment }}</text>
	  							  </view>
	  							  <view class="jyz_li_buts_item">
	  									<image src="../../static/star.png" class="jyz_li_buts_action-icon" />
	  									<text class="jyz_li_action-text">{{ item.data.user_forward }}</text>
	  							  </view>
	  						</view> 
	  						
	  				</view>
	  				<view class="jyz_li_post">host</view>
	  			</view>
	  		</view>
	  	    </scroll-view>  
	  </view>
 

   
   <view v-if="activeTab === '关注'">
	   <!-- 用户头像横向排列 -->
	   <view class="user-list">
	     <view class="user-item" v-for="user in users" :key="user.username">
	       <image :src="user.avatar" class="user-avatar"></image>
	       <text class="user-name">{{ user.username }}</text>
	     </view>
	   </view>
	   <!-- New Content Section -->
	   <view class="new-content">
	     <view class="content-item" @click="setActiveContent('求解答')">
	       <view :class="['content-border', { 'active-border': activeContent === '求解答' }]">
	         <image src="/static/求解答帖.png" class="content-image" />
	       </view>
	     </view>
	     <view class="content-item" @click="setActiveContent('加油站')">
	       <view :class="['content-border', { 'active-border': activeContent === '加油站' }]">
	         <image src="/static/加油站帖.png" class="content-image" />
	       </view> 
	     </view>
	   </view>
	   
	   <!-- Post Content -->
	   <scroll-view scroll-y="true" class="post-list" v-if="activeContent === '加油站'">
	     <view v-for="(post, index) in posts" :key="index" class="post">
	       <view class="post-container">
	         <view class="post-header">
	           <image :src="post.authorAvatar" class="author-avatar" />
	           <view>
	             <text class="post-author">{{ post.author }}</text>
	             <text class="post-date">{{ post.date }}</text>
	           </view>
	         </view>
	         <view class="post-content">
	           <text>{{ post.content }}</text>
	           <view class="post-images">
	             <image v-for="(img, idx) in post.images" :src="img" :key="idx" class="post-image" />
	           </view>
	         </view>
	         <view class="post-actions">
	           <view @click="toggleLike(post)">
	             <image :src="post.liked ? '/static/heart-filled.png' : '/static/heart.png'" class="action-icon" />
	           </view>
	           <view @click="toggleStar(post)">
	             <image :src="post.starred ? '/static/star-filled.png' : '/static/star.png'" class="action-icon" />
	           </view>
	           <view>
	             <image src="/static/chat.png" class="action-icon" />
	           </view>
	         </view>
	       </view>
	     </view>
	   </scroll-view>
	   <!-- Question Content -->
	   <scroll-view scroll-y="true" class="question-list" v-if="activeContent === '求解答'">
	     <view v-for="(question, index) in questions" :key="index" class="question">
	       <view class="question-container">
	         <view class="question-header">
	           <image :src="question.authorAvatar" class="author-avatar" />
	           <view>
	             <text class="question-author">{{ question.author }}</text>
	             <text class="question-date">{{ question.date }}</text>
	           </view>
	         </view>
	         <view class="question-content">
	           <text>{{ question.content }}</text>
	           <view class="question-images">
	             <image v-for="(img, idx) in question.images" :src="img" :key="idx" class="question-image" />
	           </view>
	         </view>
	         <view class="question-actions">
	           <view @click="toggleLike(question)">
	             <image :src="question.liked ? '/static/heart-filled.png' : '/static/heart.png'" class="action-icon" />
	           </view>
	           <view @click="toggleStar(question)">
	             <image :src="question.starred ? '/static/star-filled.png' : '/static/star.png'" class="action-icon" />
	           </view>
	           <view class="answer-button" @click="answerQuestion(question)">
	             <text class="answer-text">回答</text>
	           </view>
	         </view>
	       </view>
	     </view>
	   </scroll-view>
   </view>
</view>
    <!-- Bottom Navigation Bar -->
</template>

<script>
export default {
  data() {
    return {
	  jyzs:[],
      activeTab: '加油站', // 当前激活的标签
      posts: [ // 帖子数据数组
        {
          author: 'Patisseris Land',
          date: '刚刚发布',
          content: '有没有小伙伴觉得张字老师的高数课，有关概念讲解的有点点难...',
          images: ['/static/logo.png'], // 帖子包含的图片
          followersCount: 15, // 关注人数
          liked: false, // 是否已点赞
          starred: false // 是否已收藏
        },
        {
          author: '柯小布',
          date: '4分钟前',
          content: '各位大佬们有没有英语阅读的学习方法，想用提高一下。赐赐',
          images: [], // 没有图片
          followersCount: 10,
          liked: false,
          starred: false
        },
        {
          author: '骑鱼吃小鱼',
          date: '6分钟前',
          content: '现在数学分指南二刷结束，是看81绝还是看题源...',
          images: [], // 没有图片
          followersCount: 10,
          liked: false,
          starred: false
        }
      ],
      activeNav: '小研圈', // 默认激活的导航项
      activeTab: '加油站', // 默认激活的标签
      activeContent: '', // 默认激活的内容
      users: [
        { username: 'mx', avatar: '/static/mx.jpg'},
        { username: 'hxy', avatar: '/static/hxy.jpg' },
        { username: 'sjh', avatar: '/static/sjh.jpg' },
        { username: 'zmx', avatar: '/static/zmx.jpg' },
        { username: 'xh', avatar: '/static/xh.jpg' },
        { username: 'ly', avatar: '/static/hxy.jpg' },
        { username: 'cl', avatar: '/static/cl.jpg' },
        { username: 'xff', avatar: '/static/xff.jpg' },
      ],
      posts: [
        {
          author: 'mx',
          authorAvatar: '/static/mx.jpg',
          date: '2024-10-18',
          content: '第二周，21天模拟，我已经打卡14天，坚持就是胜利呀~ #21天高数模拟卷打卡#',
          images: [
            '/static/logo.png',
            '/static/logo.png',
            '/static/logo.png'
          ],
          liked: false,
          starred: false,
          type: '加油站'
        },
        // 可以添加更多的帖子对象
      ],
      questions: [
        {
          author: 'hxy',
          authorAvatar: '/static/hxy.jpg',
          date: '2024-10-19',
          content: '求解答：如何解决这个数学问题？',
          images: [
            '/static/logo.png'
          ],
          liked: false,
          starred: false,
          type: '求解答'
        },
        // 可以添加更多的求解答帖子对象
      ]
    };
  },
  async onLoad() {
  	   let res=await uniCloud.callFunction({
  	   	name:"getPsot_CARD"
  	   });
	   this.jyzs=res.result.data;
	   console.log(res);
  },
  methods: {
    setActiveTab(tab) { // 设置激活的标签
      this.activeTab = tab;
	  if (tab === '求解答') {
	      uni.navigateTo({
	        url: '/pages/qiujieda/qiujieda' // 跳转到求解答页面
	      });
	    }
	  		if (tab === '加油站') {
	  		    uni.navigateTo({
	  		      url: '/pages/jiayouzhan/jiayouzhan' // 跳转到求解答页面
	  		    });
	  		  }
    },
    setActiveContent(content) {
      this.activeContent = content;
    },
navigateTo(page) {
  this.activeNav = page;
  const pageMap = {
    'attention': '/pages/attention/attention',
    'qiujieda': '/pages/qiujieda/qiujieda',
    'guanzhu': '/pages/guanzhu/guanzhu',
    'fensi': '/pages/fensi/fensi',
    'bianjiziliao': '/pages/bianjiziliao/bianjiziliao',
    'index': '/pages/index/index',
    'dakajilu': '/pages/dakajilu/dakajilu',
    'aihelper': '/pages/aihelper/aihelper', // 新增 aihelper 页面映射
    // 根据需要添加更多映射
  };
  const targetUrl = pageMap[page] || `/pages/${page}/${page}`;  // 如果没有在 pageMap 中找到，则默认跳转
  uni.navigateTo({
    url: targetUrl
  });
}
,
    toggleLike(post) {
      post.liked = !post.liked;
    },
    toggleStar(post) {
      post.starred = !post.starred;
    },
    answerQuestion(question) {
      // 回答问题的逻辑
    },
navigateTo(page) {
  this.activeNav = page;
  if (page === 'attention') {
    uni.navigateTo({
      url: '/pages/attention/attention'
    });
  } else if (page === 'qiujieda') {
    uni.navigateTo({
      url: '/pages/qiujieda/qiujieda'
    });
  } else {
    uni.navigateTo({
      url: `/pages/${page}/${page}`
    });
  }
}
}
};
</script>

<style scoped>
	.post-list {
	  flex: 1; /* 占据剩余空间 */
	  overflow-y: auto; /* 纵向滚动 */
	}
	
	.post {
	  background-color: #fff; /* 帖子背景色 */
	  padding: 10px; /* 内边距 */
	  border-radius: 10px; /* 圆角 */
	  margin-bottom: 10px; /* 下边距 */
	  border: 2px solid #FFFFFF; /* 帖子边框 */
	  border-bottom: 2px solid #bd3124;
	}
	
	.post-container {
	  padding: 10px; /* 内边距 */
	}
	
	.post-header {
	  display: flex; /* 水平方向排列 */
	  align-items: center; /* 垂直居中对齐 */
	}
	
	.author-avatar {
	  width: 30px; /* 头像宽度 */
	  height: 30px; /* 头像高度 */
	  border-radius: 50%; /* 圆形头像 */
	  margin-right: 10px; /* 右边距 */
	}
	
	.post-author-info {
	  display: flex; /* 垂直方向排列 */
	  flex-direction: column; /* 垂直排列 */
	}
	
	.post-author {
	  font-weight: bold; /* 作者姓名加粗 */
	}
	
	.post-date {
	  color: #999; /* 日期颜色 */
	  font-size: 12px; /* 日期字体大小 */
	}
	
	.post-content {
	  margin-top: 10px; /* 上边距 */
	}
	
	.post-images {
	  display: flex; /* 水平方向排列 */
	  margin-top: 10px; /* 上边距 */
	  width: 100px; /* 图标宽度 */
	}
	
	.post-image {
	  width: 70px; /* 图片宽度 */
	  height: 70px; /* 图片高度 */
	  margin-right: 5px; /* 右边距 */
	  border-radius: 4px; /* 圆角 */
	}
	
	.post-actions {
	  display: flex; /* 水平方向排列 */
	  justify-content: space-between; /* 均匀分配 */
	  margin-top: 10px; /* 上边距 */
	  align-items: center; /* 垂直居中对齐 */
	}
	
	.followers-count {
	  color: #bd3124; /* 关注人数颜色 */
	  font-size: 14px; /* 字体大小 */
	}
	.answer-button {
	  background-color: #f8f8f8; /* 按钮背景色 */
	  color: #bd3124; /* 按钮文字颜色 */
	  padding: 6px 12px; /* 内边距 */
	  border-radius: 15px; /* 圆角 */
	  font-weight: bold; /* 加粗按钮文字 */
	  border: none; /* 无边框 */
	  cursor: pointer; /* 鼠标悬停时为指针形状 */
	}
	
	.bottom-nav {
	  display: flex; /* 水平方向排列 */
	  justify-content: space-around; /* 均匀分配 */
	  align-items: center; /* 垂直居中对齐 */
	  background-color: #fff; /* 背景色 */
	  height: 60px; /* 高度 */
	  position: fixed; /* 固定在底部 */
	  bottom: 0; /* 距离底部0 */
	  width: 100%; /* 宽度100% */
	}
	
	.nav-item {
	  display: flex; /* 水平方向排列 */
	  flex-direction: column; /* 垂直方向排列 */
	  align-items: center; /* 居中对齐 */
	}
	
	.nav-item.active {
	  border: 2px solid red; /* 激活项添加红色边框 */
	}
	.nav-icon {
	  width: 24px; /* 图标宽度 */
	  height: 24px; /* 图标高度 */
	}
	.nav-item .activeIcon {
	  filter: brightness(0) saturate(100%) invert(38%) sepia(72%) saturate(445%) hue-rotate(0deg) brightness(102%) contrast(101%); /* 变为红色 */
	}
	.nav-text {
	  font-size: 12px; /* 字体大小 */
	  margin-top: 5px; /* 图标和文本之间的间距 */
	}
	
	.bottom-nav {
	  display: flex;
	  flex-direction: row;
	  justify-content: space-around;
	  align-items: center;
	  height: 60px; /* 导航栏高度 */
	  background-color: #FFFFFF; /* 导航栏背景颜色 */
	  border-top: 1px solid white; /* 导航栏上方的黑色水平线 */
	  position: fixed; /* 固定在底部 */
	  bottom: 0;
	  width: 100%;
	}
	
	
	/* 导航项样式 */
	.nav-item {
	  display: flex;
	  flex-direction: row;
	  flex-direction: column;
	  align-items: center;
	}
	.nav-item.active {
	  border: 2px solid red; /* 激活态红色边框 */
	}
	
	/* 导航图标样式 */
	.nav-icon {
	  width: 24px;
	  height: 24px;
	}
	
	/* 导航文本样式 */
	.nav-text {
	  margin-top: 5px;
	  font-size: 12px;
	  color: #000000;
	}
	
	/* 修改第三个导航项的样式为圆角矩形填充为暗红色 */
	.nav-item:nth-child(3) {
	  width: 70px; /* 圆角矩形的宽度 */
	  height: 40px; /* 圆角矩形的高度 */
	  background-color: #bd3124; /* 填充颜色为暗红色 */
	  border-radius: 15px; /* 圆角半径为20px */
	  justify-content: center; /* 垂直居中 */
	  align-items: center; /* 水平居中 */
	}
	
	/* 第三个导航项中的加号样式 */
	.nav-item:nth-child(3)::before {
	  content: '+'; /* 加号字符 */
	  color: white; /* 加号颜色为白色 */
	  font-size: 24px; /* 加号大小 */
	  font-weight: bold; /* 加号加粗 */
	}
	
	/* 移除第三个导航项的图片 */
	.nav-item:nth-child(3) .nav-icon {
	  display: none;
	}
	.bottom-right-img {
	  position: fixed; /* 固定在屏幕右下角 */
	  right: 37px; /* 距离右边10px */
	  bottom: 77px; /* 距离底部10px */
	  z-index: 9999; /* 确保在最上层 */
	}
	
	.image-icon {
	  width: 60px; /* 你可以根据需要调整图片的大小 */
	  height: 60px;
	}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #F8F8F8;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  background-color: white;
  align-items: center;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
.search-icon {
  font-size: 13px;
  color: #666;
}
.tab-bar {
  display: flex;
  flex-direction: row;
  font-weight: bold;
  justify-content: space-around;
  background-color: #f8f8f8;
  padding: 10px 0;
  position: relative;
}
.tab-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tab {
  color: #666;
  font-size: 15px;
  position: relative;
}
.tab.active {
  color: red;
}
.underline {
  width: 100%;
  height: 2px;
  background-color: red;
  margin-top: 5px;
}
.profile-row {
  display: flex; 
  flex-direction: row;
  padding-top: 0px ;
  background-color: #FFFFFF;
  overflow-x: auto; /* 允许横向滚动 */
  align-items: center; /* 垂直居中 */
  padding-left: 20px; /* 离左边界一定距离 */
}
.profile-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}
.profile-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.username {
  font-size: 18px;
  color: #333;
}
.new-content {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: #f8f8f8;
  padding-top: 5px ;
  padding-bottom: 5px;
}
.content-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content-border {
  width: 130px;
  height: 40px;
  border: 2px solid #999; /* 深灰色边框 */
  border-radius: 15px; /* 圆角矩形 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.active-border {
  border-color: #bd3124; /* 激活时边框变红 */
}
.content-image {
  width: 30px;
  height: 30px;
}
.post-list {
  flex: 1;
  overflow-y: auto; /* 允许纵向滚动 */
}
.post {
  background-color: #ffffff;
  padding: 6px;
  margin: 6px ;
  border-radius: 8px;
}
.post-container {
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 10px; /* 减小内边距 */
  margin-bottom: 10px;
  border: 2px solid #bd3124; /* 枣红色边框 */
}
.post-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px; /* 减小底部边距 */
}
.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}
.post-author {
  font-weight: bold;
}
.post-date {
  color: #999;
  font-size: 8px;
}
.post-content {
  font-size: small;
  margin-top: 5px; /* 减小顶部边距 */
}
.post-images {
  display: flex;
  flex-direction: row;
  margin-top: 5px; /* 减小顶部边距 */
}
.post-image {
  width: 70px;
  height: 70px;
  margin-right: 5px;
  border-radius: 4px;
}
.post-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 5px; /* 减小顶部边距 */
}
.action-icon {
  width: 24px;
  height: 24px;
}
.question-list {
  flex: 1;
  overflow-y: auto; /* 允许纵向滚动 */
}
.question {
  background-color: #ffffff;
  padding: 6px;
  margin: 6px ;
  border-radius: 8px;
}
.question-container {
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 10px; /* 减小内边距 */
  margin-bottom: 10px;
  border: 2px solid #bd3124; /* 枣红色边框 */
}
.question-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px; /* 减小底部边距 */
}
.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}
.question-author {
  font-weight: bold;
}
.question-date {
  color: #999;
  font-size: 8px;
}
.question-content {
  font-size: small;
  margin-top: 5px; /* 减小顶部边距 */
}
.question-images {
  display: flex;
  flex-direction: row;
  margin-top: 5px; /* 减小顶部边距 */
}
.question-image {
  width: 70px;
  height: 70px;
  margin-right: 5px;
  border-radius: 4px;
}
.question-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 5px; /* 减小顶部边距 */
}
.answer-button {
  background-color: #bd3124;
  border-radius: 15px;
  padding: 5px 23px;
}
.answer-text {
  color: white;
  font-size: 14px;
}

.user-list {
  display: flex;
  flex-direction: row; /* 横向排列 */
  overflow-x: auto; /* 横向滚动 */
  padding: 10px;
}

.user-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.user-name {
  margin-top: 5px;
  font-size: 12px;
  color: #333;
}


.bottom-nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 60px; /* 导航栏高度 */
  background-color: #FFFFFF; /* 导航栏背景颜色 */
  border-top: 1px solid white; /* 导航栏上方的黑色水平线 */
  position: fixed; /* 固定在底部 */
  bottom: 0;
  width: 100%;
}

/* 导航项样式 */
.nav-item {
  display: flex;
  flex-direction: row;
  flex-direction: column;
  align-items: center;
}
.nav-item.active {
  border: 2px solid red; /* 激活态红色边框 */
}

/* 导航图标样式 */
.nav-icon {
  width: 24px;
  height: 24px;
}

/* 导航文本样式 */
.nav-text {
  margin-top: 5px;
  font-size: 12px;
  color: #000000;
}

/* 修改第三个导航项的样式为圆角矩形填充为暗红色 */
.nav-item:nth-child(3) {
  width: 70px; /* 圆角矩形的宽度 */
  height: 40px; /* 圆角矩形的高度 */
  background-color: #bd3124; /* 填充颜色为暗红色 */
  border-radius: 15px; /* 圆角半径为20px */
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
}

/* 第三个导航项中的加号样式 */
.nav-item:nth-child(3)::before {
  content: '+'; /* 加号字符 */
  color: white; /* 加号颜色为白色 */
  font-size: 24px; /* 加号大小 */
  font-weight: bold; /* 加号加粗 */
}

/* 移除第三个导航项的图片 */
.nav-item:nth-child(3) .nav-icon {
  display: none;
}


.banner{
	background-color: #636363;
	padding: 40rpx 30rpx 20rpx 20rpx;
	color: white;
	background-image: url("../../static/activitybg.jpg");
	background-size: cover;
}
.banner-title{
	font-size: 34rpx;
	font-weight: bold;
}
.banner-subtitle{
	margin-top: 45rpx;
}
.banner-bootom{
	margin-top: 20rpx;
	display: flex;
	justify-content: space-between;
}
.banner_btn{
	font-size: 24rpx;
	background-color: #914235;
	padding: 12rpx;
	border-radius: 30rpx;
}
.jyz_li_box{
	padding: 20rpx;
	
}

.jyz_li{
	background-color: white;
	padding: 30rpx;
	display: flex;
	position: relative;
	margin-bottom: 20rpx;
}
.jyz_li_post{
	position: absolute;
	right: 0rpx;
	top: 0rpx;
	background-color: #D47970;
	color: white; 
	padding: 10rpx;
	border-top-right-radius: 20rpx;
	border-bottom-left-radius: 20rpx;
}
.jyz_li_left image{
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
}
.jyz_li_left{
	flex-shrink: 0;
}
.jyz_li_right{
	flex: 1;
	padding-left: 30rpx;
}
.jyz_li_userAndtime{
	display: flex;
}
.jyz_li_userAndtime >view:nth-child(1){
	font-weight: bold;
	font-size: 30rpx;
}
 .jyz_li_userAndtime >view:nth-child(2){
 	font-size: 28rpx;
	margin-left: 20rpx;
	color: #CFCFCF;
 } 
 .jyz_li_desc{
	 margin-top: 30rpx;
	 margin-bottom: 30rpx;
	 font-size: 26rpx;
	 color: #6B6B6A;
	 padding-right: 10rpx;
 }
 .jyz_li_images{
	 display: flex;
	 flex-wrap: wrap;
 }
 .jyz_li_images image{
	 width: 200rpx;
	 height: 200rpx;
	 margin-right: 12rpx;
	 margin-bottom: 12rpx;
 }
 .jyz_li_buts{
	 margin-top: 40rpx;
 }
 .jyz_li_buts image{
	 width: 40rpx;
	 height: 40rpx;
 }
 .jyz_li_buts_item{
	 display: flex;
	 align-items: center;
 }
 .jyz_li_action-text{
	 margin-left: 10rpx;
	 color: #5B6B73;
 }
 .jyz_li_buts{
	 display: flex;
	 justify-content: space-between;
 }
</style>