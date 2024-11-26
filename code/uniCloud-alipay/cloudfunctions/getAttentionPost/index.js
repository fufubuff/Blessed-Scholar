'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const { user_id } = event; // 从事件参数获取 user_id

  // 获取当前用户的关注列表
  const followersRes = await db.collection('followers')
    .where({
      followerId: user_id,
    })
    .get();

  const followeeIds = followersRes.data.map(item => item.followeeId);

  if (followeeIds.length === 0) {
    // 如果没有关注任何人，返回空数组
    return {
      code: 0,
      data: [],
    };
  }

  // 查询发布者为关注列表用户的帖子
  const postsRes = await db.collection('POST_CARD')
    .where({
      'data.user_id': db.command.in(followeeIds),
    })
    .get();

  return {
    code: 0,
    data: postsRes.data,
  };
};