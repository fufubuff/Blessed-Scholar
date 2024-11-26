// 云函数 getPunchStatus 
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

  try {
    // 查询用户当天是否已打卡
    const userRes = await punchCollection.where({
      user_id: user_id,
      date: today
    }).get();

    if (userRes.data.length > 0) {
      return {
        code: 0,
        msg: '今天已打卡'
      };
    } else {
      return {
        code: 2,
        msg: '今天未打卡'
      };
    }
  } catch (error) {
    console.error('获取打卡状态失败:', error);
    return {
      code: 3,
      msg: '获取打卡状态失败，请重试'
    };
  }
};
