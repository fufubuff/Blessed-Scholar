'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { userid } = event;
  console.log('收到的 userid:', userid); // 打印 userid
  if (!userid) {
    return {
      code: 1,
      message: '缺少参数userid'
    };
  }
  try {
    // 获取用户信息
    const userRes = await db.collection('users')
      .where({ userid: userid }) // 假设 users 集合的主键是 userid
      .get();
    console.log('用户查询结果:', userRes); // 打印用户查询结果
    if (userRes.data.length === 0) {
      return {
        code: 1,
        message: '用户不存在'
      };
    }
    const user = userRes.data[0];

    // 获取用户的帖子 from 'posts' 集合
    const postsRes1 = await db.collection('posts')
      .where({ "user_id": userid })
      .get();
    console.log('posts集合查询结果:', postsRes1); // 打印帖子查询结果
    const posts1 = postsRes1.data;

    // 获取用户的帖子 from 'POST_CARD' 集合
    const postsRes2 = await db.collection('POST_CARD')
      .where({ 'data.user_id': userid })
      .get();
    console.log('POST_CARD集合查询结果:', postsRes2); // 打印帖子查询结果
    const posts2 = postsRes2.data.map(item => {
      const data = item.data;
      return {
        _id: item._id, // 添加这一行
        userid: data.user_id,
        author: data.nickname,
        authorAvatar: data.user_pho,
        date: data.chat_time,
        content: data.user_chat,
        images: data.user_chat_pho,
        liked: data.user_liked,
        collected: data.user_collected,
        comments: data.user_comment,
        forward: data.user_forward,
        // 添加其他需要的字段
      };
    });

    // 合并两个帖子数组
    const posts = posts1.concat(posts2);

    // 根据日期排序（假设帖子有 date 字段）
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      code: 0,
      data: {
        user,
        posts
      }
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return {
      code: 1,
      message: '获取用户信息失败',
      error: error.message || error
    };
  }
};