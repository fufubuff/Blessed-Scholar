// cloudfunctions/chat/index.js
'use strict';

const axios = require('axios');
const db = uniCloud.database();

// 从环境变量中获取 API 密钥
const API_KEY = 'sk-mvOc5002d4fec6492dda97092933450e3daea29ad09eYKtV'; // 推荐使用环境变量存储 API 密钥

exports.main = async (event, context) => {
  const { question, assistantRole, userId, isIntroduction = false, helpType, assistantNickname } = event;

  // 参数验证
  if (!userId || !assistantRole) {
    return {
      success: false,
      message: '缺少必要的参数：assistantRole 或 userId',
    };
  }

  // 从数据库获取用户信息
  let userInfo = {};
  try {
    const userRes = await db.collection('users').doc(userId).get();
    if (userRes.data && userRes.data.length > 0) {
      userInfo = userRes.data[0];
    } else {
      console.error('未找到用户信息');
      return {
        success: false,
        message: '未找到用户信息',
      };
    }
  } catch (error) {
    console.error('获取用户信息失败：', error);
    return {
      success: false,
      message: '获取用户信息失败',
      error: error.message,
    };
  }

  // 从数据库获取最近的聊天记录
  const chatHistoryCollection = db.collection('chat_history');
  let previousMessages = [];
  let chatHistoryRes = null; // 保存聊天记录查询结果
  try {
    chatHistoryRes = await chatHistoryCollection.where({
      user_id: userId,
      assistant_role: assistantRole,
    }).orderBy('date', 'desc').limit(1).get();

    if (chatHistoryRes.data && chatHistoryRes.data.length > 0) {
      previousMessages = chatHistoryRes.data[0].messages;
    }
  } catch (error) {
    console.error('获取聊天记录失败：', error);
    return {
      success: false,
      message: '获取聊天记录失败',
      error: error.message,
    };
  }

  // 构建消息列表
  let messages = [];

  // 添加助手的角色描述
  messages.push({
    role: 'system',
    content: `你是一位合格的考研助手，具有耐心，能够安慰人，帮助用户解答考研疑惑，提供情感支持和专业建议。你的性格是：${assistantRole}。`,
  });

  // 添加帮助类型提示
  if (helpType) {
    messages.push({
      role: 'system',
      content: `用户当前需要的帮助类型是：${helpType}。请根据这个类型来提供最合适的帮助。`,
    });
  }

  // 添加用户信息到系统提示中
  if (userInfo && userInfo.nickname) {
    messages.push({
      role: 'system',
      content: `用户的昵称是 ${userInfo.nickname}，专业是 ${userInfo.major || '未提供'}，学校是 ${userInfo.school || '未提供'}。请在回复中考虑这些信息。`,
    });
  }

  if (isIntroduction) {
    // 让助手进行自我介绍
    messages.push({
      role: 'assistant',
      content: `你好，我是${assistantNickname}，很高兴为你服务！作为一名${assistantRole}，我可以为你提供${helpType}方面的帮助。请问你有什么需要的吗？`,
    });
  } else if (question) {
    // 添加之前的对话
    for (let msg of previousMessages) {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    }

    // 添加当前用户的问题
    messages.push({
      role: 'user',
      content: question,
    });
  }

  // 控制消息长度，避免超过模型的上下文长度限制
  if (messages.length > 20) {
    messages = messages.slice(-20);
  }

  // 构建请求数据
  const payload = {
    model: 'gpt-4o', // 确保模型名称正确
    messages: messages,
    max_tokens: 1000,
  };

  // API 请求头
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`, // 使用环境变量中的 API_KEY
  };

  try {
    // 发送 POST 请求到 OpenAI API
    const response = await axios.post('https://api.gptsapi.net/v1/chat/completions', payload, { headers, timeout: 60000 });

    // 检查响应状态码
    if (response.status !== 200) {
      console.error(`API 请求失败，状态码：${response.status}`, response.data);
      return {
        success: false,
        message: `API 请求失败，状态码：${response.status}`,
        error: response.data,
      };
    }

    // 解析响应
    const answer = response.data.choices[0].message.content.trim();

    // 更新聊天记录
    if (!isIntroduction && question) {
      previousMessages.push({ sender: 'user', content: question });
    }
    previousMessages.push({ sender: 'ai', content: answer });

    // 更新数据库中的聊天记录
    if (chatHistoryRes.data && chatHistoryRes.data.length > 0) {
      // 更新已有记录
      const docId = chatHistoryRes.data[0]._id;
      await chatHistoryCollection.doc(docId).update({
        messages: previousMessages,
        date: new Date().toISOString().split('T')[0],
      });
    } else {
      // 创建新记录
      await chatHistoryCollection.add({
        user_id: userId,
        assistant_role: assistantRole,
        messages: previousMessages,
        date: new Date().toISOString().split('T')[0],
      });
    }

    return {
      success: true,
      data: answer,
    };
  } catch (error) {
    // 捕获并返回详细错误信息
    if (error.response) {
      // API 返回的错误响应
      console.error('API 调用失败：', error.response.data);
      return {
        success: false,
        message: 'API 调用失败',
        error: error.response.data,
      };
    } else if (error.request) {
      // 请求已发出但未收到响应
      console.error('API 调用失败：未收到响应', error.request);
      return {
        success: false,
        message: 'API 调用失败：未收到响应',
        error: error.request,
      };
    } else {
      // 其他错误
      console.error('API 调用失败：', error.message);
      return {
        success: false,
        message: 'API 调用失败',
        error: error.message,
      };
    }
  }
};