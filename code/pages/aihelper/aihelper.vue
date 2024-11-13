<template>
   <view :class="['ai-helper', selectedAssistantClass]">
     <!-- AI 助手名称 -->
     <view class="assistant-name">
       <template v-if="!editingNickname">
         <text>{{ assistantNickname }}</text>
         <button @click="editingNickname = true">编辑昵称</button>
       </template>
       <template v-else>
         <input
           v-model="assistantNickname"
           @blur="editingNickname = false"
           placeholder="输入助手昵称"
         />
       </template>
     </view>
    <!-- 用户选择 AI 助手性格 -->
    <view class="assistant-selector">
      <text>选择 AI 助手性格：</text>
      <picker mode="selector" :range="assistantOptions" @change="changeAssistant">
        <view class="picker">
          <text>{{ selectedAssistantLabel }}</text>
        </view>
      </picker>
    </view>

    <!-- 用户选择帮助类型 -->
    <view class="help-selector">
      <text>选择帮助类型：</text>
      <picker mode="selector" :range="helpOptions" @change="changeHelp">
        <view class="picker">
          <text>{{ selectedHelpLabel }}</text>
        </view>
      </picker>
    </view>

    <!-- 聊天记录显示区域 -->
    <scroll-view class="chat-history" scroll-y :scroll-into-view="scrollIntoView">
      <view
        v-for="(message, index) in messages"
        :key="index"
        :class="message.sender === 'user' ? 'chat-item user' : 'chat-item ai'"
      >
        <image
          v-if="message.sender === 'user'"
          class="avatar"
          :src="userAvatarUrl"
        ></image>
        <image
          v-else
          class="avatar"
          :src="getAssistantAvatar()"
        ></image>
        <view class="message-content">
          <text>{{ message.content }}</text>
        </view>
      </view>
      <!-- 用于自动滚动到底部 -->
      <view :id="bottomId"></view>
    </scroll-view>

    <!-- 输入消息区域 -->
    <view class="message-input">
      <input
        type="text"
        v-model="userInput"
        @confirm="sendMessage"
        :placeholder="inputPlaceholder"
      />
      <button @click="sendMessage" :disabled="!userId">发送</button>
    </view>

    <!-- 日期选择器查看聊天记录 -->
    <view class="history-selector">
      <text>查看历史聊天记录：</text>
      <picker mode="date" @change="loadHistory">
        <view class="picker">
          <text>{{ selectedDate }}</text>
        </view>
      </picker>
   </view>
   
   
	<view class="custom-assistant-selector">
	  <text>定制我的助手性格：</text>
	  <button @click="goToCustomizeAssistant">定制性格</button>
  </view>
  
  
   </view>
</template>


<script>
export default {
  data() {
    return {
      // AI 助手选项和对应的CSS类
      assistantOptions: [
        '温柔知性的大姐姐',
        '温柔学长大哥哥',
        '逼你学习的霸道总裁',
        '看淡人生的睿智老者',
		'技术人员黄小fu',
      ],
      assistantClasses: [
        'assistant-sister',
        'assistant-brother',
        'assistant-huangxiaofu',
        'assistant-ceo',
        'assistant-wiseelder',
      ],
      selectedAssistantIndex: 0,
      selectedAssistantLabel: '温柔知性的大姐姐',
      selectedAssistantClass: 'assistant-sister',

      // 帮助类型选项
      helpOptions: [
        '鼓励安慰',
        '情感咨询',
        '疑难解答',
        '规划建议',
      ],
      selectedHelpIndex: 0,
      selectedHelpLabel: '鼓励安慰',

      // 用户输入和聊天记录
      userInput: '',
      messages: [],
      selectedDate: '',
      bottomId: 'bottom',
      scrollIntoView: '',
      userId: '', // 用户ID

      // AI 助手昵称编辑
      assistantNickname: 'AI 助手', // 默认昵称
      editingNickname: false,
	  userAvatarUrl: '/static/hxy.jpg'
    };
  },
  computed: {
    // 根据选择的性格动态设置输入框的占位符
    inputPlaceholder() {
      return `${this.assistantNickname} 正在等待您的问题...`;
    },
  },
  methods: {
  async loadInitialState() {
    // 异步加载数据...
    const assistantIndex = await new Promise((resolve, reject) => {
      uni.getStorage({
        key: 'selectedAssistantIndex',
        success: (res) => resolve(res.data),
        fail: () => reject('未找到保存的助手性格选择')
      });
    });
    const savedIndex = uni.getStorageSync('selectedAssistantIndex');
    console.log('Loaded Assistant Index:', savedIndex); // 确认加载的值
    if (savedIndex !== undefined) {
      this.selectedAssistantIndex = assistantIndex;
      this.selectedAssistantLabel = this.assistantOptions[assistantIndex];
      this.selectedAssistantClass = this.assistantClasses[assistantIndex];
    }

    // 加载用户输入
    const userInput = await new Promise((resolve, reject) => {
      uni.getStorage({
        key: 'userInput',
        success: (res) => resolve(res.data),
        fail: () => reject('未找到保存的用户输入')
      });
    });

    if (userInput !== undefined) {
      this.userInput = userInput;
    }
  },
    saveAssistantSelection(index) {
        this.selectedAssistantIndex = index;
        // 同步保存
        uni.setStorageSync('selectedAssistantIndex', index);
      },
    
      // 保存用户的输入
      saveUserInput(input) {
        this.userInput = input;
        // 异步保存
        uni.setStorage({
          key: 'userInput',
          data: input,
          success: function () {
            console.log('用户输入保存成功');
          }
        });
      },
    // 保存昵称
    async saveNickname() {
      this.editingNickname = false;
      // 重新让助手进行自我介绍
      this.messages = [];
      await this.assistantIntroduce();
    },
    // 切换 AI 助手性格
    async changeAssistant(e) {
      this.selectedAssistantIndex = e.detail.value;
      this.selectedAssistantLabel = this.assistantOptions[this.selectedAssistantIndex];
      this.selectedAssistantClass = this.assistantClasses[this.selectedAssistantIndex];
      // 切换性格时清空当前聊天记录
	  uni.setStorageSync('selectedAssistantIndex', this.selectedAssistantIndex);
	  console.log('Saving Assistant Index:', this.selectedAssistantIndex);
      this.messages = [];
      // 让助手重新自我介绍
      await this.assistantIntroduce();
    },

    // 切换帮助类型
    async changeHelp(e) {
      this.selectedHelpIndex = e.detail.value;
      this.selectedHelpLabel = this.helpOptions[this.selectedHelpIndex];
      // 切换帮助类型时，清空聊天记录并让助手重新自我介绍
      this.messages = [];
      await this.assistantIntroduce();
    },
     goToCustomizeAssistant() {
        // 这里假设你已经有一个定制页面的路由设置
        uni.navigateTo({
          url: '/pages/customizeAI/customizeAI',
        });
      },
    // 发送消息
    async sendMessage() {
      if (this.userInput.trim() === '') return;

      // 将用户消息添加到聊天记录
      this.messages.push({
        sender: 'user',
        content: this.userInput,
      });

      try {
        // 调用云函数获取回复
        const res = await uniCloud.callFunction({
          name: 'chat',
          data: {
            question: this.userInput,
            assistantRole: this.getAssistantRoleDescription(),
            helpType: this.selectedHelpLabel,
            userId: this.userId,
            assistantNickname: this.assistantNickname,
          },
        });

        if (res.result && res.result.success) {
          const aiReply = res.result.data;

          // 将 AI 回复添加到聊天记录
          this.messages.push({
            sender: 'ai',
            content: aiReply,
          });

          // 自动滚动到底部
          this.$nextTick(() => {
            this.scrollIntoView = this.bottomId;
          });
        } else {
          throw new Error(res.result.message || '获取回复失败');
        }
      } catch (error) {
        console.error('API 调用失败：', error);
        this.messages.push({
          sender: 'ai',
          content: '抱歉，我无法获取回复，请稍后再试。',
        });
      }

      // 清空用户输入
      this.userInput = '';
    },

    // 生成助手角色描述
    getAssistantRoleDescription() {
      switch (this.selectedAssistantLabel) {
        case '温柔知性的大姐姐':
          return '温柔知性的大姐姐，耐心地回答用户的考研问题，提供情感支持和专业建议，模拟一个校园女神一样善解人意能提供各种情绪价值';
        case '温柔学长大哥哥':
          return '温柔学长大哥哥，耐心地回答用户的考研问题，提供情感支持和专业建议，模拟一个校园男神一样如沐春风，能提供情绪价值';
        case '技术人员黄小fu(做软件工程很疲惫的性格）':
          return '技术人员黄小fu，做软件工程很疲惫，对生活感到疲倦,对张栋老师很尊敬，建议考生去上张栋的软件工程解答疑惑，告诉考生做完软件工程实践这个世界上已经没有困难的事情了';
        case '逼你学习的霸道总裁':
          return '霸道总裁，霸道地逼着用户学习，语气比较强硬，必须让考生做完每天的作业，推动复习计划的完成。';
        case '看淡人生的睿智老者':
          return '看淡人生的睿智老者，给予深刻的人生见解，有种淡淡的遗世独立感觉，喜欢灌鸡汤。';
        default:
          return '耐心且专业的考研助手';
      }
    },

    // 获取 AI 助手的头像
    getAssistantAvatar() {
      switch (this.selectedAssistantLabel) {
        case '温柔知性的大姐姐':
          return '/static/assistant-sister.jpg';
        case '温柔学长大哥哥':
          return '/static/assistant-brother.jpg';
        case '技术人员黄小fu(做软件工程很疲惫的性格）':
          return '/static/huangxiaofu.jpg';
        case '逼你学习的霸道总裁':
          return '/static/assistant-ceo.jpg';
        case '看淡人生的睿智老者':
          return '/static/assistant-wiseelder.jpg';
        default:
          return '/static/logo.jpg';
      }
    },

    // 加载指定日期的聊天记录
    async loadHistory(e) {
      if (e) {
        this.selectedDate = e.detail.value;
      }
      try {
        const res = await uniCloud.callFunction({
          name: 'getChatHistory',
          data: {
            userId: this.userId,
            date: this.selectedDate,
            assistantRole: this.selectedAssistantLabel,
            helpType: this.selectedHelpLabel,
          },
        });

        if (res.result && res.result.success) {
          this.messages = res.result.data;
        } else {
          this.messages = [];
        }
      } catch (err) {
        console.error('加载聊天记录失败：', err);
        this.messages = [];
      }
    },

    // 助手自我介绍
    async assistantIntroduce() {
      try {
        // 调用云函数获取自我介绍
        const res = await uniCloud.callFunction({
          name: 'chat',
          data: {
            question: '', // 无实际问题
            assistantRole: this.getAssistantRoleDescription(),
            helpType: this.selectedHelpLabel,
            userId: this.userId,
            assistantNickname: this.assistantNickname,
            isIntroduction: true, // 标记为自我介绍
          },
        });

        if (res.result && res.result.success) {
          const aiIntro = res.result.data;

          // 将 AI 自我介绍添加到聊天记录
          this.messages.push({
            sender: 'ai',
            content: aiIntro,
          });

          // 自动滚动到底部
          this.$nextTick(() => {
            this.scrollIntoView = this.bottomId;
          });

          // 根据帮助类型主动提供建议
          await this.provideProactiveHelp();
        } else {
          throw new Error(res.result.message || '获取自我介绍失败');
        }
      } catch (error) {
        console.error('获取自我介绍失败：', error);
        this.messages.push({
          sender: 'ai',
          content: '抱歉，我无法进行自我介绍，请稍后再试。',
        });
      }
    },

    // 主动提供帮助建议
    async provideProactiveHelp() {
      let proactiveQuestion = '';
      switch (this.selectedHelpLabel) {
        case '鼓励安慰':
          proactiveQuestion = '在备考过程中遇到困难时，你有哪些鼓励和安慰的话语可以帮助用户保持积极心态？你可以分享一些成功案例或者提供一些积极的心理调节方法，帮助他们减轻压力和焦虑。';
          break;
        case '情感咨询':
          proactiveQuestion = '用户在备考期间可能会面临哪些情感问题？你如何提供支持和建议？考虑到备考的压力可能会影响情绪和人际关系，你可以提供一些缓解压力的技巧或是建议如何有效地与家人和朋友沟通。';
          break;
        case '疑难解答':
          proactiveQuestion = '用户在备考过程中可能会遇到哪些疑难问题？你如何帮助他们解决这些问题？你可以提供一些常见问题的解决策略，或是建议一些有用的学习资源和工具。';
          break;
        case '规划建议':
          proactiveQuestion = '你如何帮助用户制定有效的备考计划？有哪些建议可以提高备考效率？考虑到不同的学习风格和时间管理需求，你可以提供个性化的学习计划建议，以及如何平衡学习和休息的技巧。';
          break;
        default:
          proactiveQuestion = '请问你有什么需要帮助的吗？我可以提供学习资源、备考策略或心理支持等多方面的帮助。';
      }

      try {
        // 调用云函数获取主动帮助建议
        const res = await uniCloud.callFunction({
          name: 'chat',
          data: {
            question: proactiveQuestion,
            assistantRole: this.getAssistantRoleDescription(),
            helpType: this.selectedHelpLabel,
            userId: this.userId,
            assistantNickname: this.assistantNickname,
            isIntroduction: false, // 标记为非自我介绍
          },
        });

        if (res.result && res.result.success) {
          const proactiveHelp = res.result.data;

          // 将 AI 主动帮助建议添加到聊天记录
          this.messages.push({
            sender: 'ai',
            content: proactiveHelp,
          });

          // 自动滚动到底部
          this.$nextTick(() => {
            this.scrollIntoView = this.bottomId;
          });
        } else {
          throw new Error(res.result.message || '获取主动帮助建议失败');
        }
      } catch (error) {
        console.error('获取主动帮助建议失败：', error);
        this.messages.push({
          sender: 'ai',
          content: '抱歉，我无法提供帮助建议，请稍后再试。',
        });
      }
    },

    // 获取当前日期，格式为 YYYY-MM-DD
    getCurrentDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (`0${date.getMonth() + 1}`).slice(-2);
      const day = (`0${date.getDate()}`).slice(-2);
      return `${year}-${month}-${day}`;
    },

    // 获取用户ID
    async getUserId() {
      // 尝试从本地存储获取 user_id
      const storedUserId = uni.getStorageSync('user_id');
      if (storedUserId) {
        this.userId = storedUserId;
        this.selectedDate = this.getCurrentDate();
    
        // 从云数据库中获取用户的 avatarUrl
        try {
          const db = uniCloud.database();
          const res = await db.collection('users').doc(this.userId).get();
          if (res.result.data && res.result.data.length > 0) {
            this.userAvatarUrl = res.result.data[0].avatarUrl || '/static/hxy.jpg';
          } else {
            // 如果没有找到用户，使用默认头像
            this.userAvatarUrl = '/static/logo.jpg';
          }
        } catch (err) {
          console.error('获取用户头像失败：', err);
          this.userAvatarUrl = '/static/logo.jpg';
        }
    
        await this.loadHistory();
        // 助手进行自我介绍
        await this.assistantIntroduce();
        return;
      }
    
      // 如果本地存储没有 user_id，提示登录
      console.error('获取用户ID失败: user_id 不存在');
      uni.showToast({
        title: '请先登录',
        icon: 'none',
      });
      // 跳转到登录页面
      uni.navigateTo({
        url: '/pages/login/login',
      });
    },
    },
  mounted() {
    // 调用 getUserId 方法获取用户ID
	this.loadInitialState();
    this.getUserId();
	
  },
};
</script>


<style scoped>
.ai-helper {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 确保高度为视口高度 */
  background-color: var(--background-color, #ffeaf0);
  transition: background-color 0.3s, color 0.3s;
}

/* 温柔知性的大姐姐 */
.assistant-sister {
  --primary-color: #ffccd5;
  --secondary-color: #ff6f91;
  --background-color: #ffeaf0;
  --chat-ai-bg: rgba(255, 240, 246, 0.8);
  --chat-background-image: url('/static/chat-bg-sister.jpg');
}

/* 温柔学长大哥哥 */
.assistant-brother {
  --primary-color: #cce5ff;
  --secondary-color: #3399ff;
  --background-color: #e6f2ff;
  --chat-ai-bg: rgba(240, 248, 255, 0.8);
  --chat-background-image: url('/static/chat-bg-brother.jpg');
}

/* 技术人员黄小fu */
.assistant-huangxiaofu {
  --primary-color: #d9d9d9;
  --secondary-color: #666666;
  --background-color: #f2f2f2;
  --chat-ai-bg: rgba(255, 255, 255, 0.8);
  --chat-background-image: url('/static/chat-bg-huangxiaofu.jpg');
}

/* 逼你学习的霸道总裁 */
.assistant-ceo {
  --primary-color: #ffebcc;
  --secondary-color: #ff9933;
  --background-color: #fff5e6;
  --chat-ai-bg: rgba(255, 240, 230, 0.8);
  --chat-background-image: url('/static/chatbgceo.jpg');
}

/* 看淡人生的睿智老者 */
.assistant-wiseelder {
  --primary-color: #ccffcc;
  --secondary-color: #66cc66;
  --background-color: #e6ffe6;
  --chat-ai-bg: rgba(240, 255, 240, 0.8);
  --chat-background-image: url('/static/chat-bg-wiseelder.jpg');
}


/* 应用动态样式 */
/* 应用动态样式 */ 
.ai-helper {
  background-color: var(--background-color);
}


/* 顶部 AI 助手昵称栏样式 */
.assistant-name {
  position: relative;
  text-align: center;
  font-size: 18px; /* 缩小字体大小 */
  font-weight: bold;
  padding: 5px; /* 减少内边距，缩短高度 */
  background-color:#f0f0f0; /* 暖白色背景 */
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ccc; /* 增加下边框，类似微信风格 */
}

.assistant-name text {
  flex-grow: 1;
  text-align: center;
}

.assistant-name button {
  position: absolute;
  top: 5px;  /* 将按钮向上移动 */
  right: 10px;
  padding: 2px 5px;
  font-size: 8px;  /* 缩小字体大小 */
  line-height: 16px;  /* 调整行高以垂直居中文本 */
  background-color: #f9f9f9; /* 浅白色背景 */
  color: #007aff; /* 蓝色文字 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 16px; /* 调整高度，使其更小一些 */
}

/* 输入框样式 */
.assistant-name input {
  font-size: 16px;
  font-weight: normal;
  color: #333;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 70%;
  margin: 0 auto; /* 居中 */
  background-color: #f9f9f9;
}

/* 选择器区域样式 */
.assistant-selector,
.help-selector {
  padding: 5px 10px; /* 减少内边距 */
  display: flex;
  align-items: center;
  background-color: #fdf5e6; /* 与昵称栏一致的暖白色背景 */
  border-bottom: 1px solid #ccc;
}

.assistant-selector text,
.help-selector text {
  margin-right: 10px;
  font-size: 16px;
  font-weight: bold; /* 加粗文字 */
  color: #333;
}

/* 将选择框改为小按钮 */
.picker-button {
  padding: 5px 10px;
  background-color: #007aff; /* 蓝色按钮 */
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.assistant-selector,
.help-selector {
  background-color: var(--primary-color);
  padding: 10px;
  display: flex;
  align-items: center;
}

.chat-history {
  flex: 1;
  padding: 10px;
  overflow-y: scroll;
  background-color: var(--chat-ai-bg);
  background-image: var(--chat-background-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.message-input {
  display: flex;
  padding: 10px;
  background-color: var(--primary-color);
  align-items: center;
}

.chat-item {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.chat-item.user {
  flex-direction: row-reverse;
}

.chat-item.ai {
  flex-direction: row;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px; /* 圆形头像 */
  margin: 0 5px;
}

.message-content {
  max-width: 70%;
  padding: 10px;
  border-radius: 15px; /* 圆润的消息气泡 */
  word-wrap: break-word;
  font-size: 16px;
  line-height: 1.5;
  background-color: rgba(255, 255, 255, 0.8); /* 半透明背景，提升可读性 */
}

.chat-item.user .message-content {
  background-color: rgba(196, 241, 190, 0.8); /* 半透明浅绿色 */
  color: #000;
}

.chat-item.ai .message-content {
  background-color: rgba(255, 255, 255, 0.8); /* 半透明白色 */
  color: #000;
  border: 1px solid var(--secondary-color); /* 动态边框色 */
}

.message-input {
  display: flex;
  padding: 10px;
  background-color: var(--primary-color);
  align-items: center;
}

.message-input input {
  flex: 1;
  padding: 8px 12px;  /* 调整内边距以匹配按钮 */
  border: 1px solid var(--secondary-color);
  border-radius: 20px;
  background-color: #fff;
  font-size: 16px;
  outline: none;
  height: 40px;  /* 设置高度 */
}

.message-input button {
  margin-left: 10px;
  padding: 8px 12px;  /* 保持与输入框的内边距一致 */
  background-color: var(--secondary-color);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;  /* 加粗按钮文字 */
  height: 40px;  /* 设置高度与输入框一致 */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;  /* 设置相对定位 */
}

.message-input button span {
  position: relative;
  top: -2px;  /* 将文字向上移动2px */
}

.history-selector {
  padding: 10px;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
}

.history-selector text {
  margin-right: 10px;
  font-size: 16px;
  color: #333;
}

.picker {
  padding: 5px 10px;
  border: 1px solid var(--secondary-color);
  border-radius: 20px;
  display: inline-block;
  background-color: #fff;
  font-size: 16px;
  color: #333;
}
.custom-assistant-selector {
  padding: 10px;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-assistant-selector text {
  margin-right: 10px;
  font-size: 16px;
  color: #333;
}

.custom-assistant-selector button {
  padding: 5px 10px;
  background-color: var(--secondary-color);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

</style>