const db = uniCloud.database();

exports.main = async (event, context) => {
  const { userId } = event;  // 获取传递的用户ID

  try {
    // 检查用户是否存在
    const userResult = await db.collection('users').doc(userId).get();
    console.log('User result:', userResult);  // 打印用户信息
    if (userResult.data.length === 0) {
      return { success: false, message: '用户不存在' };  // 如果没有找到用户
    }

    const user = userResult.data[0];  // 获取用户数据

    // 获取当前时间戳和今天日期
    const startTime = Date.now();  // 当前时间戳（毫秒）
    const startDate = new Date().toISOString().split('T')[0];  // 获取今天的日期（格式：yyyy-MM-dd）

    // 确保study_users集合存在
    const studyUsersCollection = db.collection('study_users');

    // 先查询是否已经存在该用户的自习记录
    const existingRecord = await studyUsersCollection.doc(userId).get();
    console.log('Existing record:', existingRecord);  // 打印已有记录

    if (existingRecord.data.length > 0) {
      // 如果用户已有自习记录，更新该记录的时间戳
      const updateResult = await studyUsersCollection.doc(userId).update({
        startTime: startTime,  // 更新自习开始时间
        startDate: startDate   // 更新自习日期
      });

      console.log('Update result:', updateResult);  // 打印更新结果

      if (updateResult.updated === 1) {
        return {
          success: true,
          message: '自习记录已更新',
          data: {
            userId,
            nickname: user.nickname,
            avatarUrl: user.avatarUrl,
            startTime: startTime,  // 返回自习开始时间戳
            startDate: startDate   // 返回自习开始日期
          }
        };
      } else {
        return { success: false, message: '更新自习记录失败', error: updateResult };
      }
    } else {
      // 如果用户没有自习记录，初始化创建一条记录
      const result = await studyUsersCollection.add({
        nickname: user.nickname,  // 从用户信息中获取昵称
        avatarUrl: user.avatarUrl,  // 从用户信息中获取头像
        startTime: startTime,  // 使用当前时间戳作为自习开始时间
        startDate: startDate,  // 使用今天日期作为自习开始日期
        createTime: startTime  // 创建时间，使用时间戳
      });

      console.log('Insert result:', result);  // 打印插入结果

      if (result.inserted === 1) {
        return {
          success: true,
          message: '用户自习记录已创建',
          data: {
            userId,
            nickname: user.nickname,
            avatarUrl: user.avatarUrl,
            startTime: startTime,  // 返回自习开始时间戳
            startDate: startDate   // 返回自习开始日期
          }
        };
      } else {
        return { success: false, message: '创建自习记录失败', error: result };
      }
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
