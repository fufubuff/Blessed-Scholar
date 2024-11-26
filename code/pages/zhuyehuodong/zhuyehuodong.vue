<template>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

  <view class="container">
    <!-- 头部 -->
      <view class="header" @click="navigateTo('beijinggenghuan')">
        <!-- 动态绑定背景图片 -->
        <image class="background-image" :src="backgroundImage" mode="aspectFill"></image>
        <image class="overlay-image" src="/static/background1.png"></image>
        <image
          class="settings-icon"
          src="/static/shezhi.png"
          @click.stop="navigateToSettings"
        ></image>
      </view>
     
    <!-- 个人资料 -->
    <view class="profile">
      <view class="avatar-container">
        <image class="avatar" :src="avatarUrl"></image>
      </view>
      <view class="profile-info">
        <text class="username" @click="navigateTo('bianjiziliao')">{{ username }}</text>
        <text class="intro" @click="navigateTo('bianjiziliao')">{{ signature }}</text>
        <text class="following" @click="navigateTo('guanzhu')">你正在关注 <text class="red-text">{{ following }}</text></text>
        <text class="stats" @click="navigateTo('fensi')">有人在意你 <text class="red-text">{{ followers }}</text></text>
        <text class="fubi" @click="navigateToMyFub">福币 <text class="red-text">{{ fub }}</text></text>
        <view class="ranking-container" @click="navigateToLeaderboard">
			<image class="fubipaihangbang" src="/static/排行榜.png"></image>
		</view>
	  </view>
    </view>

    <!-- 按钮 -->
    <view class="button-container">
      <view class="tab-button" :class="{ active: activeButton === '规划树' }" @click="activateButton('规划树')">规划树</view>
      <view class="tab-button" :class="{ active: activeButton === '加油站' }" @click="activateButton('加油站')">加油站</view>
      <view class="tab-button" :class="{ active: activeButton === '回答' }" @click="activateButton('回答')">回答</view>
      <view class="tab-button" :class="{ active: activeButton === '打卡' }" @click="activateButton('打卡')">打卡</view>
     
	  <view class="tab-button" :class="{ active: activeButton === '收藏' }" @click="activateButton('收藏')">收藏</view>
    <view class="tab-button" :class="{ active: activeButton === '活动' }" @click="activateButton('活动')">活动</view>
	</view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 打卡内容 -->
      <view v-if="activeButton === '打卡'" class="check-in-section">
        <view class="check-in-card">
          <!-- 累计打卡 -->
          <view class="check-in-summary">
            <image src="/static/target-icon.png" class="summary-icon"></image>
            <text class="check-in-title">你已累计打卡</text>
            <text class="check-in-days">{{ punchDays }}</text>
          </view>
          <view class="check-in-divider"></view>
          <!-- 今日语律 -->
          <view class="check-in-today">
            <view class="today-summary">
              <image src="/static/quote-icon.png" class="summary-icon"></image>
              <text class="check-in-today-title">今日语录</text>
              <text class="check-in-today-subtitle">研小fu为你助力！</text>
            </view>
            <!-- 显示随机语录 -->
                      <text class="check-in-quote">{{ randomQuote || '加载中...' }}</text>
          </view>
          <!-- 查看打卡记录按钮 -->
          <view class="check-in-record">
            <text @click="navigateTo('dakajilu')" class="check-in-record-link">点击查看打卡记录</text>
          </view>
        </view>
      </view>
	  
     <!-- 规划树内容 -->
    
       <view v-if="activeButton === '规划树'" class="skill-tree-section">
         <image src="/static/jinengshu.png" class="skill-tree-image" alt="规划树图片"></image>
         
         
           <!-- 切换风格按钮 -->
           <button 
             @click="toggleStyle" 
             class="style-toggle-button"
             :class="{ 'active': activeButton === '规划树' }">
             {{ activeButton === '规划树' ? '查看规划' : '返回' }}
           </button>
         
         <!-- 每个圆圈点击时触发编辑 -->
        
           <view 
             v-for="(skill, index) in skills" 
             :key="index" 
             :style="{ top: skill.top + 'px', left: skill.left + 'px' }" 
             class="skill-circle" 
             @click="startEditing(index)">
             {{ skill.name }}  <!-- 显示技能名称 -->
           </view>
         
         <!-- 编辑弹框 -->
         <view v-if="isEditing" class="edit-overlay">
           <view class="edit-container">
             <text class="edit-title">{{ currentSkillName }}的计划</text>
             <input v-model="newText" class="edit-input" placeholder="输入新的规划目标" />
             <button @click="saveChanges" class="save-button">保存</button>
             <button @click="cancelEdit" class="cancel-button">取消</button>
           </view>
         </view>
		</view>
		
		<view v-if="activeButton === '表格树'" class="skill-table-section">
			<p class="encouragement-message">
			  计划是心的地图，走好每一步，未来就会更美好！<br>
			  ——from 小研(｡♥‿♥｡)
			</p>

		  <!-- 切换风格按钮 -->
		  <button @click="toggleStyle" 
		          class="style-toggle-button"
		          :class="{' tab-button': true, 'active': activeButton === '规划树' }">
		    <i class="fas fa-arrow-left back-arrow"></i>
		    {{ activeButton === '规划树' ? '查看规划' : '' }}
		  </button>


		  <table class="skill-table">
		    <thead>
		      <tr>
		        <th>规划日期</th>
		        <th>规划目标</th>  <!-- 新增更新时间列 -->
		      </tr>
		    </thead>
		   <tbody>
		         <tr v-for="(skill, index) in skills" :key="index">
		           <td>{{ skill.name }}</td>
		           <td>{{ skill.plan || '未设置计划' }}</td>  <!-- 显示计划 -->
		         </tr>
		       </tbody>
		  </table>
		
		
       </view>


      <!-- 加油站内容 -->
      <view v-if="activeButton === '加油站'">
        <!-- 加油站的内容 -->
      </view>

      <!-- 回答内容 -->
      <view v-if="activeButton === '回答'">
        <!-- 回答的内容 -->
      </view>
	  

      <view v-if="activeButton === '收藏'" class="collection-section">
		  
          <!-- 收藏子选项卡 -->
          <view class="sub-tab-container">
            <view class="sub-tab-button" :class="{ active: activeSubTab === '题库' }" @click="activateSubTab('题库')">题库</view>
            <view class="sub-tab-button" :class="{ active: activeSubTab === '课程' }" @click="activateSubTab('课程')">课程</view>
            <view class="sub-tab-button" :class="{ active: activeSubTab === '快讯' }" @click="activateSubTab('快讯')">快讯</view>
            <view class="sub-tab-button" :class="{ active: activeSubTab === '加油站' }" @click="activateSubTab('加油站')">加油站</view>
            <view class="sub-tab-button" :class="{ active: activeSubTab === '求解答' }" @click="activateSubTab('求解答')">求解答</view>
          </view>
          <!-- 收藏内容卡片 -->
          <view class="collection-content">
			  
            <view v-for="(item, index) in filteredCollectionItems" :key="index" class="collection-card">
              
				<view class="collection-header">
				  <view class="title-line"></view> <!-- 添加一个竖线装饰 -->
				  <text class="collection-title">{{ item.title }}</text>
				  <image src="/static/more.png" class="more-icon"></image>
				</view>
             
              <text class="publisher">发布人：{{ item.publisher }}</text>
            </view>
          </view>
        </view>
      </view>
	    <view v-if="activeButton === '活动'" class="activity-section">
	            <view v-for="(activity, index) in activities" :key="index" class="activity-card" :class="{'active': activity.status === '正在参与', 'ended': activity.status === '已结束'}">
	              <!-- 左侧的竖线装饰 -->
	              <view class="left-line"></view>
	              <!-- 活动标题 -->
	              <text class="activity-title">{{ activity.title }}</text>
	              <!-- 更多图标 -->
	              
	              <!-- 发起人信息 -->
	              <text class="initiator">发起人：{{ activity.initiator }}</text>
	              <!-- 活动状态 -->
	              <view class="status-label">{{ activity.status }}</view>
	            </view>
	          </view>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
		punchDays: 0, // 存储打卡天数
		
		activeButton: '打卡',
		      randomQuote: '' , // 存储随机语录
		activeButton: '表格树',
		      skills: [
		        { name: '技能1', left: 100, top: 200, updateDate: null },
		        { name: '技能2', left: 150, top: 250, updateDate: null }
		      ],
		activeButton: '规划树', // 当前激活的按钮
		     isEditing: false, // 是否处于编辑状态
		     newText: '', // 新输入的文本内容
		     editingIndex: null, // 当前编辑的技能索引
		     skills: [
		             { name: 'DAY1', top: 155, left: 29,plan: '' },
		             { name: 'DAY2', top: 190, left: 82 ,plan: '' },
		             { name: 'DAY3', top: 195, left: 240 ,plan: '' },
		             { name: 'DAY4', top: 160, left: 300 ,plan: '' },
		             { name: 'DAY5', top: 115, left: 89 ,plan: '' },
		             { name: 'DAY6', top: 107, left: 178 ,plan: '' },
		             { name: 'DAY7', top: 88, left: 260 ,plan: '' },
		             { name: '总计划', top: 4, left: 180 ,plan: '' },
					 { name: '周计划', top: 50, left:113 ,plan: '' },
		           ], // 八个技能的数据
		username: '', // 用户昵称
		avatarUrl: '', // 用户头像URL
		backgroundImage: '',
		signature: '', // 用户个性签名
		following: 0, // 关注人数
		followers: 0, // 粉丝人数
		fub: 0, // 福币数
		
	  activeButton: '收藏', // 默认选中“收藏”
	        // 新增活动列表数据
	        activities: [
	          {
	            title: '21天高数模拟卷打卡活动',
	            initiator: '小研',
	            status: '正在参与',
	          },
	          {
	            title: '考研助力企划',
	            initiator: '小研',
	            status: '已结束',
	          },],
			  
      activeButton: '收藏', // 默认选中“收藏”
      activeSubTab: '题库', // 默认选中“题库”子选项卡
      collectionItems: [
            {
              type: '题库',
              title: '2024年考研数1',
              publisher: '小研',
            },
            {
              type: '课程',
              title: '高数精讲',
              publisher: '小研',
            },
      ],
    };
  },
  
 
 computed: {
   filteredCollectionItems() {
     return this.collectionItems.filter(item => item.type === this.activeSubTab);
   },
 },

  mounted() {
    this.fetchUserInfo();
	 // 页面加载时调用获取随机语录的函数
	    this.fetchRandomQuote();
  },
   
   
    
  methods: {
	  // 调用云函数获取随机语录
	      async fetchRandomQuote() {
	        try {
	          const res = await uniCloud.callFunction({
	            name: 'getRandomQuote',
	          });
	          // 检查返回的结果
	          if (res.result.code === 200) {
	            this.randomQuote = res.result.data || '没有语录数据';  // 防止空值
	          } else {
	            this.randomQuote = '没有语录数据';
	          }
	        } catch (error) {
	          this.randomQuote = '加载失败，请稍后再试';
	          console.error('云函数调用失败:', error);
	        }
	      },
	    
	  // 切换风格的函数
	    toggleStyle() {
	      if (this.activeButton === '规划树') {
	        this.activeButton = '表格树';
	      } else {
	        this.activeButton = '规划树';
	      }
	    },
	 
	   
	      updateSkill(index, newName, newX, newY) {
	        const currentDate = new Date().toLocaleString();  // 获取当前日期时间
	        this.skills[index].name = newName;
	        this.skills[index].left = newX;
	        this.skills[index].top = newY;
	        this.skills[index].updateDate = currentDate;  // 更新日期
	      },
	  // 获取每个技能圆圈的位置和样式
	  getSkillCircleStyle(index) {
	    const skill = this.skills[index];
	    return {
	      position: 'absolute',
	      left: `${skill.x}px`,
	      top: `${skill.y}px`,
	      width: '30px',
	      height: '30px',
	      borderRadius: '50%',
	      backgroundColor: '#4CAF50',
	      cursor: 'pointer',
	    };
	  },
	  
	  // 开始编辑某个技能
	  
	  startEditing(index) {
		  this.currentSkillName = this.skills[index].name; 
	        this.editingIndex = index;  // 设置当前编辑的技能索引
	        this.newText = this.skills[index].plan;  // 加载技能名称到编辑框
	        this.isEditing = true;  // 显示编辑框
	      },
	  
	  // 取消编辑
	  cancelEdit() {
	    this.isEditing = false;
	  },
	  
	  saveChanges() {
	        if (this.newText.trim() === '') {
	          alert('请输入有效的技能名称');
	          return;
	        }
	        // 保存修改到 skills 数组
	        this.skills[this.editingIndex].plan = this.newText;
	        this.isEditing = false;  // 退出编辑模式
	        this.editingIndex = null;  // 清空编辑索引
	        alert('修改已保存！');
	      },
	  
	  // 加载本地存储的数据
	  loadFromLocalStorage() {
	    const savedSkills = localStorage.getItem('skills');
	    if (savedSkills) {
	      this.skills = JSON.parse(savedSkills);
	    }
	  },
	  
	  openMoreOptions(item) {
	      // 打开更多操作菜单，可能是编辑、删除、分享等功能
	      console.log('更多操作', item);
	    },
	  activateSubTab(subTab) {
	      this.activeSubTab = subTab;
	    },
    async fetchUserInfo() {
      try {
        const userId = uni.getStorageSync('user_id'); // 从本地存储获取 user_id
        console.log('获取的user_id:', userId);
        if (!userId) {
          // 如果没有 user_id，跳转到登录页面
          uni.navigateTo({
            url: '/pages/login/login' // 根据你的登录页面路径调整
          });
          return;
        }
    
        // 调用云函数 getUserInfo 获取用户信息
        const response = await uniCloud.callFunction({
          name: 'getUserInfo',
          data: { user_id: userId }
        });
    
        if (response.result) {
          const userInfo = response.result.data;
          console.log('用户信息:', userInfo);
          
          this.username = userInfo.nickname;
          this.avatarUrl = userInfo.avatarUrl;
          this.signature = userInfo.signature;
          this.following = userInfo.following; // 关注人数
          this.followers = userInfo.followers; // 粉丝人数
		  this.punchDays = userInfo.punch;
    
          // 获取背景图片URL
          this.backgroundImage = userInfo.backgroundUrl; // 如果没有背景图URL，使用默认背景
    
        
          // 调用云函数获取福币信息
          const fubResponse = await uniCloud.callFunction({
            name: 'getUserFubInfo',
            data: { user_id: userId }
          });
    
          if (fubResponse.result.code === 0) {
            const fubInfo = fubResponse.result.data;
            this.fub = fubInfo.fub; // 福币数
          } else {
            console.error('获取福币信息失败:', fubResponse.result.msg);
          }
        } else {
          console.error(response.result ? response.result.msg : '获取用户信息失败');
        }
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    },


   navigateTo(page) {
       // 定义页面映射
       const pageMap = {
         'guanzhu': '/pages/guanzhu/guanzhu',
         'fensi': '/pages/fensi/fensi',
         'bianjiziliao': '/pages/bianjiziliao/bianjiziliao',
         'index': '/pages/index/index',
         'dakajilu': '/pages/dakajilu/dakajilu',
         'aihelper': '/pages/aihelper/aihelper' // 新增 aihelper 页面映射
         // 根据需要添加更多映射
       };
   
       const targetUrl = pageMap[page] || `/pages/${page}/${page}`;
   
       uni.navigateTo({
         url: targetUrl
       });
    },
	navigateToMyFub() {
	  const userId = uni.getStorageSync('user_id'); // 获取当前用户的 user_id
	  uni.navigateTo({
	    url: `/pages/myFub/myFub?user_id=${userId}` // 跳转到 myFub 页面
	  });
	},
    navigateToSettings() {
          uni.navigateTo({
            url: '/pages/shezhi/shezhi',
          });
        },
    navigateToLeaderboard() {
      uni.navigateTo({
        url: '/pages/leaderboard/leaderboard'
      });
    },
	activateButton(button) {
	    this.activeButton = button;
	    if (button === '收藏') {
	      this.activeSubTab = '题库'; // 点击“收藏”时，默认选中“题库”子选项卡
	    }
	  },
	  
	  
  }
}
</script>

<style scoped>
.skill-tree-section {
  position: relative;
  width: 100%;
  height: 300px;
}

.skill-tree-image {
  width: 100%;
  height: 100%;
}

.skill-circle {
  position: absolute;
  width: 36px;  /* 增加圆圈的大小 */
  height: 36px;
  border-radius: 50%;
  background-color: rgba(82, 188, 197, 1);  /* 修改透明度，0.6表示60%的不透明度 */
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center; /* 居中内容 */
  color: white;
  font-size: 7px;
  font-weight: bold;
}


.edit-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
}

.edit-container {
  background-color: white;
  padding: 28px;
  border-radius: 8px;
  width: 200px; /* 调整宽度，让它变长 */
}


.edit-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.edit-input {
  width: 100%;
  padding: 4px;
  margin-bottom: 15px;
}

.save-button, .cancel-button {
  padding: 0px 10px;
  background-color: #0075af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.cancel-button {
  background-color: #9e2b22;
}

.save-button:hover, .cancel-button:hover {
  opacity: 0.8;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  margin: 0; /* Reset any default margins */
  padding: 0; /* Reset any default padding */
}

.header {
  position: relative;
  width: 100%;
  height: 200px; /* 保持高度不变 */
  text-align: center;
  color: #fff;
  background-image: url('/static/background1.png'), url('/static/background.png');
  background-position: center top, center top; /* 保持背景图像位置不变 */
  background-size: cover, cover; /* 保持背景图像大小不变 */
  margin: 0; /* 移除默认外边距 */
  padding: 0; /* 移除默认内边距 */
  /* 新增样式以移除顶部留白 */
  top: 0; /* 将头部容器固定在顶部 */
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* 其他样式 */
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.overlay-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.settings-icon {
	z-index: 1000;
}

.background-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.profile {
  display: flex;
  width: 80%;  /* 控制宽度为父容器宽度的90%，留出两侧空白以形成间隙 */
  height: 90px; /* 设置新的高度 */
  align-items: center;
  margin-top: 120px; /* 上移，部分覆盖头部容器 */
  margin-bottom: 20px; /* 下边距 */
  margin-left: 5%; /* 左边距 */
  margin-right: 5%; /* 右边距，确保左右间距相等，也可调整为具体px值 */
  background-color: #FFF; /* 背景颜色为白色 */
  padding: 20px 20px 20px 20px; /* 内边距，确保内容不会紧贴边缘，上下左右均为20px */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 阴影效果，增加立体感 */
  border-radius: 15px; /* 边框圆角，设置为15px，制造圆角效果 */
  position: absolute; /* 相对定位，允许内部的avatar-container绝对定位相对于此元素 */
  z-index: 2;
}

.avatar-container {
  width: 70px;
  height: 70px;
  border-radius: 35px; /* Half of width and height to make it round */
  overflow: hidden;
  border: 2px solid #FFFFFF; /* White border around the avatar */
  box-shadow: 0 2px 4px rgba(0,0,0,0.25); /* Shadow for depth */
  position: absolute;
  left: 20%;
  transform: translateX(-50%); /* Move it half outside the left border */
  top: -35%; /* Increase this value to move the avatar down */
  z-index: 2;
}

.avatar {
  width: 100%;
  height: 100%;
}

.profile-info {
  display: flex;
  flex-direction: column; /* 设置为垂直排列 */
  align-items: flex-start; /* 左对齐 */
  margin-left: 50px; /* Make space for the avatar */
}

.username {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  position: absolute; /* 或者使用 absolute，根据你的布局需求 */
  left: 30px; /* 向左移动 10px */
  bottom: 65px; /* 向下移动 10px */
}

.intro {
  position: absolute; /* 绝对定位 */
  top: 75px; /* 顶部位置 */
  left: 30px; /* 左侧位置 */
  font-size: 12px;
  color: #333;
}

.following {
  position: absolute; /* 绝对定位 */
  top: 100px; /* 顶部位置 */
  left: 30px; /* 左侧位置 */
  font-size: 12px;
  color: #666;
}

/* 修改 .stats 文本样式 */
.stats {
  position: absolute; /* 绝对定位 */
  top: 100px; /* 顶部位置 */
  left: 130px; /* 左侧位置 */
  font-size: 12px;
  color: #666;
}

.following1 {
  position: absolute; /* 绝对定位 */
  top: 100px; /* 顶部位置 */
  left: 230px; /* 左侧位置 */
  font-size: 12px;
  color: #666;
}
.fubi {
  position: absolute; /* 绝对定位 */
  top: 100px; /* 顶部位置 */
  left: 220px; /* 左侧位置 */
  font-size: 12px;
  color: #666;
}

.fubipaihangbang {
  width: 6%;
  height: 13%;
  position: absolute;
  top: 100px;
  left: 290px;
  z-index: 12;
}

/* 红色数字样式 */
.red-text {
  font-size: 14px;
  color: #bd402f; /* 设置字体颜色为红色 */
  font-weight: bold;
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
  margin-top: 150px;
  margin-left: -20px; /* 负值使元素向左移动，调整数值达到理想位置 */
}

.skill-tree-section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 150px; /* 确保规划树内容与顶部有合适的间距 */
}

.skill-tree-detail {
  width: 80%; /* 设置图片宽度以保证在各种屏幕上可见 */
  height: auto; /* 保持图片的宽高比 */
  max-width: 400px; /* 限制最大宽度，防止在大屏幕上过大 */
}

.button-container {
  position: absolute; /* Position can be absolute if needed */
  display: flex;
  border: none;
  box-shadow: none;
  justify-content: space-around;
  align-items: center;
  width: 100%; /* Adjustable width */
  height: 15px;
  padding: 10px 0;
  background-color: #FFFFFF;
  margin-top: 0px; /* Adjust this to move the container up or down */
  border-radius: 0px; /* Adjust border-radius for rounded corners */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Optional shadow for depth */
  bottom: 320px;
}

.tab-button {
  background-color: transparent !important; /* 确保背景透明 */
  border: none !important; /* 确保没有边框 */
  color: grey; /* 默认颜色为灰色 */
  padding: 10px 5px;
  font-size: 15px;
  font-weight: bold;
  outline: none;
}

.tab-button.active {
  color: #bd402f !important; /* 点击后文本颜色变为红色 */
}

.button-container button::before,
.button-container button::after {
  border: none !important;
  background: none !important;
}

.check-in-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin-top: 150px; /* 确保有合适的上间距 */
}

.check-in-card {
  width: 90%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 120px; /* 保证卡片与下方内容有一定的间距 */
}

.check-in-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.summary-icon {
  width: 24px;
  height: 24px;
  margin-right: 30px;
}

.check-in-title {
  font-size: 16px;
  color: #bd3124;
  font-weight: bold;
}

.check-in-days {
  font-size: 48px;
  font-weight: bold;
  color: #bd3124;
  margin-top: 5px;
}

.check-in-divider {
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 20px 0;
}

.check-in-today {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.today-summary {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.check-in-today-title {
  font-size: 16px;
  color: #bd3124;
  font-weight: bold;
  margin-right: 15px;
}

.check-in-today-subtitle {
  font-size: 10px;
  color: #666;
}

.check-in-quote {
  font-size: 18px;
  color: #333;
  font-style: italic;
  margin-top: 5px;
}

.check-in-record {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.check-in-record-link {
  font-size: 14px;
  color: #bd3124;
  text-decoration: underline;
  cursor: pointer;
}

.check-in-record-link:hover {
  color: #a0291e;
}

/* 收藏区域样式 */
.collection-section {
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
   margin-top: 130px; 
}

.collection-card {
  background-color: #fff; /* 白色背景 */
  border-radius: 10px; /* 圆角边框，10px 可根据需要调整 */
  padding: 15px; /* 内边距 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果，增加立体感 */
  margin-bottom: 15px; /* 卡片之间的间距 */
  position: relative;
}


.collection-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-line {
  width: 4px; /* 竖线宽度 */
  height: 20px; /* 竖线高度，根据需要调整 */
  background-color: #000; /* 竖线颜色，黑色 */
  margin-right: -180px; /* 竖线和标题之间的间距 */
  align-self: center; 
}

.collection-title {
  font-size: 16px;
  font-weight: bold;
  color: #333; /* 黑色字体 */
}

.more-icon {
  width: 20px;
  height: 20px;
}

.publisher {
  font-size: 14px;
  color: #888;
  margin-top: 10px;
}
/* 收藏子选项卡样式 */

.sub-tab-button {
  font-size: 14px;
  color: grey;
}

.sub-tab-button.active {
  color: black;
}

.more-icon {
  width: 20px;
  height: 20px;
  cursor: pointer; /* 鼠标移到图标上时显示手形指针，表示可点击 */
}
/* 修改未选中状态下的标签颜色为灰色 */

.sub-tab-container {
  display: inline-flex; /* 使用 inline-flex，让按钮靠左排列 */
  flex-wrap: wrap;      /* 如果按钮很多，允许换行 */
  background-color: #FFFFFF;
  padding: 10px;           /* 去掉多余的内边距 */
  margin: 0;            /* 去掉与上一行的外边距 */
  border-bottom: 1px solid #e0e0e0;
}

.sub-tab-button {
  font-size: 12px;
  color: grey;  /* 默认颜色为灰色 */
  cursor: pointer;  /* 鼠标变为手形指针，提示可以点击 */
  padding: 5px 10px; /* 设置适当的内边距 */
  margin: 6px 3px; /* 增加上下间距为 10px，左右间距为 10px */
  transition: color 0.3s ease; /* 添加过渡效果 */
}

.sub-tab-button.active {
  color: black;  /* 被激活时变为黑色 */
}

/* 活动模块样式 */
.activity-section {
  width: 100%;
  padding: 10px;
  margin-top: 130px; /* 根据需要调整与顶部的间距 */
}

.activity-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 左侧的竖线装饰 */
.left-line {
  width: 4px;
  height: 100%;
  background-color: #bd3124; /* 默认红色 */
  position: absolute;
  left: 0;
  top: 0;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

/* 活动标题样式 */
.activity-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-left: 10px; /* 给标题留出左侧空间，避免与竖线重叠 */
}

/* 更多图标样式 */


/* 发起人信息样式 */
.initiator {
  font-size: 9px;
  color: #888;
  margin-top: 10px;
  margin-left: 10px; /* 与标题左对齐 */
}

/* 活动状态标签样式 */
.status-label {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

/* 根据活动状态改变样式 */
.activity-card.active .status-label {
  color: #bd3124;
  border: 1px solid #bd3124;
}

.activity-card.ended .status-label {
  color: #888;
  border: 1px solid #888;
}
.settings-icon {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 20px;
  right: 10px;
  z-index: 10;
}

/* 根据活动状态改变左侧竖线的颜色 */
.activity-card.ended .left-line {
  background-color: #888;
}

.style-toggle-button {
  position: absolute;
  bottom: 260px; /* 保持底部偏移 */
  left: 12px;   /* 保持左侧偏移 */
  width: 20%;  /* 按钮宽度设置为更小的值 */
  padding: 2px 2px; /* 调整内边距，使按钮更紧凑 */
  font-size: 4px; /* 减小字体大小 */
  background-color: #051422; /* 仍保持背景颜色 */
  color:  #e7d49b;  /* 设置字体颜色 */
  border: none !important; /* 取消边框 */
  border-radius: 4px; /* 使圆角更小 */
  box-shadow: none !important; /* 去掉阴影 */
  font-weight: bold;  /* 设置字体加粗 */
}
/* 鼠标悬停时更改背景色 */
.style-toggle-button:hover {
  background-color: #9c9c9c; /* 背景色变深，增加交互感 */
}
.style-toggle-button:active {
  background-color: #005f8f;  /* 按下时的背景颜色 */
}


.skill-table-section {
  margin-top: 220px;
}

.skill-table {
  width: 97%;
  border-collapse: collapse;
  margin-left: 15px;  
  margin-right: 0;    
  border-radius: 10px;  /* 添加圆角 */
  overflow: hidden;     /* 确保圆角效果不被覆盖 */
}

.skill-table th, .skill-table td {
  border: 1px solid #c8acac;
  padding: 8px;
  text-align: center;  /* 将单元格内容水平居中 */
}

.style-toggle-button:hover {
  opacity: 0.8;
}

.skill-table th {
  background-color: #c8acac;
}
.encouragement-message {
  font-size: 13px;
  font-weight: bold;
  color: #d68c79;
  margin-left: 8px;  /* 向右对齐 */
  margin-right: 0; 
  margin-bottom: 5px;
  text-align: center;
}
/* back-arrow 样式 */
.back-arrow {
  color: #e1c3c3; /* 设置箭头的颜色 */
  font-size: 24px; /* 设置箭头的大小 */
  margin-right: 3px; /* 可以根据需要调整箭头和文字之间的间距 */
  margin-bottom: 1px;
  margin-top: 7px;  /* 向下移动箭头 */
}

</style>
