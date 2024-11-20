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
      .where({ userid: userid }) // 假设 users 集合的主键是 _id
      .get();
    console.log('用户查询结果:', userRes); // 打印用户查询结果
    if (userRes.data.length === 0) {
      return {
        code: 1,
        message: '用户不存在'
      };
    }
    const user = userRes.data[0];

    // 获取用户的帖子
    const postsRes = await db.collection('posts').where({ userid }).get();
    console.log('帖子查询结果:', postsRes); // 打印帖子查询结果
    const posts = postsRes.data;

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