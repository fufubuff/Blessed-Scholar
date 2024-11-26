// 云函数 recordPunch 
exports.main = async (event, context) => {
  const { user_id } = event;

  if (!user_id) {
    return {
      code: 1,
      msg: '缺少用户ID'
    };
  }

  // 获取当前时间并调整时区（假设本地时区为中国时区，UTC+8）
  const currentDate = new Date();
  const localOffset = currentDate.getTimezoneOffset() * 60000;  // 获取时区偏移（单位：毫秒）
  const localTime = new Date(currentDate.getTime() - localOffset);  // 转换为本地时间
  const today = localTime.toISOString().split('T')[0];  // 获取本地日期，格式为 'YYYY-MM-DD'

  const db = uniCloud.database();
  const punchCollection = db.collection('punch');
  const usersCollection = db.collection('users'); // 获取 users 集合

  try {
    // 检查是否已打卡
    const existingPunch = await punchCollection.where({
      user_id: user_id,
      date: today
    }).get();

    if (existingPunch.data.length > 0) {
      return {
        code: 2,
        msg: '今天已经打卡过了',
      };
    }

    // 创建新的打卡记录
    await punchCollection.add({
      user_id: user_id,
      date: today,
      timestamp: new Date() // 使用 JavaScript 的 Date 对象
    });

    // 更新 users 集合中的 punch 字段
    const updateResult = await usersCollection.where({
      _id: user_id // 根据实际字段名调整，例如如果使用 _id，请改为 _id: user_id
    }).update({
      punch: db.command.inc(1) // 使用 $inc 操作符
    });

    if (updateResult.updated === 0) {
      // 如果没有更新任何记录，可能是用户不存在，尝试添加 punch 字段
      const addPunchResult = await usersCollection.where({
        _id: user_id
      }).update({
        punch: 1
      });

      if (addPunchResult.updated === 0) {
        // 如果仍然没有更新，返回错误
        return {
          code: 4,
          msg: '更新用户 punch 字段失败'
        };
      }
    }

    return {
      code: 0,
      msg: '打卡成功'
    };
  } catch (error) {
    console.error('打卡失败:', error);
    return {
      code: 3,
      msg: '打卡失败，请重试'
    };
  }
};
