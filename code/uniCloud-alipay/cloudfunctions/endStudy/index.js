const db = uniCloud.database();

exports.main = async (event, context) => {
  const { userId, randomId } = event;  // 获取传递过来的 userId 和 randomId
  
  console.log('接收到的用户ID:', userId);
  console.log('接收到的随机ID:', randomId);

  if (!userId || !randomId) {
    return { success: false, message: '缺少用户ID或记录ID' };  // 如果没有传递必要参数
  }

  try {
    // 检查用户是否存在
    const userResult = await db.collection('users').doc(userId).get();
    console.log('用户查询结果:', userResult);

    if (userResult.data.length === 0) {
      return { success: false, message: '用户不存在' };  // 如果没有找到用户
    }

    const user = userResult.data[0];  // 获取用户数据

    // 获取当前时间戳
    const endTime = Date.now();  // 当前时间戳（毫秒）

    // 确保 study_users 集合存在
    const studyUsersCollection = db.collection('study_users');

    // 查询该用户的自习记录，根据 randomId 和用户ID，允许查询已结束的记录
    const existingRecord = await studyUsersCollection
      .where({
        _id: randomId,  // 根据传入的随机ID查询
        userId: userId   // 确保是该用户的记录
      })
      .get();

    console.log('查询到的自习记录:', existingRecord);  // 打印查询到的自习记录

    if (existingRecord.data.length === 0) {
      // 如果没有记录，说明记录未找到
      return { success: false, message: '没有找到该自习记录' };
    }

    const record = existingRecord.data[0];  // 获取自习记录

    // 如果记录已结束（即 endTime 不为空），可以返回已结束的状态
    if (record.endTime) {
      return {
        success: false,
        message: '该自习记录已经结束',
        data: {
          userId,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          startTime: record.startTime,  // 自习开始时间
          endTime: record.endTime,  // 自习结束时间
          studyDuration: record.studyDuration  // 学习时长（秒）
        }
      };
    }

    // 如果 endTime 为空，表示记录未结束，则更新记录的结束时间
    const studyDuration = Math.floor((endTime - record.startTime) / 1000); // 转为秒

    // 更新该记录，加入结束时间和学习时长
    const updateResult = await studyUsersCollection.doc(record._id).update({
      endTime: endTime,  // 结束时间
      studyDuration: studyDuration  // 学习时长（秒）
    });

    console.log('更新结果:', updateResult);  // 打印更新结果

    if (updateResult.updated === 1) {
      return {
        success: true,
        message: '学习结束，记录已更新',
        data: {
          userId,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          startTime: record.startTime,  // 自习开始时间
          endTime: endTime,  // 自习结束时间
          studyDuration: studyDuration  // 学习时长（秒）
        }
      };
    } else {
      return { success: false, message: '更新自习记录失败', error: updateResult };
    }

  } catch (error) {
    console.error('云函数执行失败:', error);  // 输出错误信息
    return {
      success: false,
      message: '云函数执行失败',
      error: error.message
    };
  }
};
