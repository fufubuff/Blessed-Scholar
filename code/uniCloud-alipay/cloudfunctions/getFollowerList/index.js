'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const userid = '671f7a904b6f6298c45f491f';

  // 获取 followerId 为当前用户的关注列表
  const followersRes = await db.collection('followers')
    .where({
      followerId: userid
    })
    .get();

  const followeeIds = followersRes.data.map(item => item.followeeId);

  // 根据 followeeIds 获取用户信息
  const usersRes = await db.collection('users')
    .where({
      _id: db.command.in(followeeIds)
    })
    .get();

  // 组装关注列表数据
  const followerList = usersRes.data.map(user => ({
    username: user.nickname,
    avatar: user.avatarUrl,
	userid: user._id
  }));

  // 返回数据
  return {
    code: 0,
    data: followerList
  };
};