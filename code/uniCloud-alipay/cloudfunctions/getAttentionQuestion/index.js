'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const userid = '671f7a904b6f6298c45f491f';

  // 获取当前用户的关注列表
  const followersRes = await db.collection('followers')
    .where({
      followerId: userid,
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

  // 查询 posts 集合中，user_id 在关注列表中的帖子
  const questionsRes = await db.collection('posts')
    .where({
      user_id: db.command.in(followeeIds),
    })
    .get();

  return {
    code: 0,
    data: questionsRes.data,
  };
};