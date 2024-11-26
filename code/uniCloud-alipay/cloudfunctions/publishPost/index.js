'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { title, content, images, user_id } = event;

  console.log('收到的发布帖子请求:', event);

  if (!user_id) {
    console.warn('未提供 user_id');
    return {
      success: false,
      message: '用户未授权',
    };
  }

  // 获取用户详细信息，使用 user_id 进行匹配
  const usersCollection = db.collection('users');
  const userRes = await usersCollection.where({ userid: user_id }).get(); // 注意字段名称

  if (userRes.data.length === 0) {
    console.warn('用户信息未找到', user_id);
    return {
      success: false,
      message: '用户信息未找到',
    };
  }

  const currentUser = userRes.data[0];
  console.log('当前用户信息:', currentUser);

  // 获取当前日期
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD

  // 构建帖子数据，确保字段名称与 schema 一致
  const data = {
    user_id: currentUser.user_id, // 使用正确的字段名称
    nickname: currentUser.nickname || '匿名',
    user_pho: currentUser.avatarUrl || '', // 正确映射 avatarUrl
    chat_time: formattedDate,
    title: title, // 添加标题
    user_chat: content,
    user_liked: 0,
    user_comment: 0,
    user_forward: 0,
    user_chat_pho: images || [],
    user_collected: 0,
    liked_users: [],
    collected_users: [],
    comments: [],
  };

  const postData = {
    data: data,
    action: 'add', // 指定操作类型，根据 schema
  };

  console.log('准备插入的帖子数据:', postData);

  try {
    const res = await db.collection('POST_CARD').add(postData);
    console.log('插入结果:', res);
    if (res.id) {
      // 获取插入的帖子数据
      const insertedPost = await db.collection('POST_CARD').doc(res.id).get();
      console.log('插入的帖子数据:', insertedPost);

      return {
        success: true,
        data: insertedPost.data[0], // 返回包含帖子的 data 字段
      };
    } else {
      console.warn('数据库插入失败');
      return {
        success: false,
        message: '发布失败，请稍后重试',
      };
    }
  } catch (error) {
    console.error('发布帖子出错:', error);
    return {
      success: false,
      message: '发布失败，服务器错误',
    };
  }
};