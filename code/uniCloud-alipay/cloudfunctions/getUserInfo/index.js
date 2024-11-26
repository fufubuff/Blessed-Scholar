// 云函数：getUserInfo
exports.main = async (event, context) => {
  const db = uniCloud.database();
  const { user_id } = event; // 从事件参数获取 user_id
  
  if (!user_id) {
    return {
      code: 1,
      msg: '缺少user_id'
    };
  }

  try {
    // 查询用户信息
    const userCollection = db.collection('users');
    const userInfo = await userCollection.doc(user_id).get();

    if (userInfo.data.length === 0) {
      return {
        code: 1,
        msg: '用户未找到'
      };
    }

    // 获取用户信息
    const user = userInfo.data[0];
    console.log('查询到的用户信息:', user);
    
    let avatarUrl = user.avatarUrl;
    let backgroundUrl = user.backgroundUrl || ''; // 如果没有背景图，返回空字符串
    
    // 如果 avatarUrl 是 fileID，获取临时 URL
    if (avatarUrl && !avatarUrl.startsWith('http://') && !avatarUrl.startsWith('https://')) {
      const result = await uniCloud.getTempFileURL({
        fileList: [avatarUrl]
      });

      if (result.fileList && result.fileList[0].tempFileURL) {
        avatarUrl = result.fileList[0].tempFileURL;
        
        // 更新用户记录，将新的 tempFileURL 写入 avatarUrl 字段
        await db.collection('users').doc(user_id).update({
          avatarUrl: avatarUrl
        });
      } else {
        return {
          code: 2,
          msg: "获取 tempFileURL 失败"
        };
      }
    }

    // 返回用户的头像、昵称、个性签名、背景图片等信息
    return {
      code: 0,
      msg: '获取成功',
      data: {
        avatarUrl: avatarUrl, // 用户头像
        nickname: user.nickname,   // 用户昵称
        signature: user.signature, // 用户个性签名
        birthday: user.birthday,   // 用户生日
        gender: user.gender,
        school: user.school,       // 用户学校
        major: user.major,         // 用户专业
        year: user.year,           // 用户年级
        following: user.following, // 用户关注的人列表
        followers: user.followers, // 关注此用户的人列表
        mutuals: user.mutuals,     // 与此用户互关的人列表
        backgroundUrl: backgroundUrl ,// 用户背景图片
		punch: user.punch,
      }
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return {
      code: 1,
      msg: '获取失败'
    };
  }
};
