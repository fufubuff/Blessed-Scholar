const db = uniCloud.database();

exports.main = async (event, context) => {
  const { account } = event;

  try {
    const result = await db.collection('users').where({ account }).get();
    if (result.data.length > 0) {
      const user = result.data[0];
      return {
        success: true,
        data: {
          nickname: user.nickname,  // 确保提取nickname
          avatarUrl: user.avatarUrl,
          gender: user.gender,
          birthday: user.birthday,
          school: user.school,
          major: user.major,
          year: user.year,
          signature: user.signature, // 确保提取signature
          followingCount: user.followingCount || 0, // 确保提取关注人数
          followersCount: user.followersCount || 0 // 确保提取粉丝人数
        },
        message: '用户信息获取成功'
      };
    } else {
      return {
        success: false,
        message: '未找到该用户'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: '查询用户信息时出现错误',
      error
    };
  }
};
