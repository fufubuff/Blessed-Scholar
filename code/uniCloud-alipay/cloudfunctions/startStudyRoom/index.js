const db = uniCloud.database();

exports.main = async (event, context) => {
  const { userId } = event;  // 获取传递的用户ID

  try {
    // 检查用户是否存在
    const userResult = await db.collection('users').doc(userId).get();
    if (userResult.data.length === 0) {
      return { success: false, message: '用户不存在' };  // 如果没有找到用户
    }

    const user = userResult.data[0];  // 获取用户数据

    // 使用 Intl.DateTimeFormat 获取正确的日期
    const currentDate = new Date();
    const timeZone = 'Asia/Shanghai'; // UTC+8

    const formatter = new Intl.DateTimeFormat('zh-CN', {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const parts = formatter.formatToParts(currentDate);
    const year = parts.find(part => part.type === 'year').value;
    const month = parts.find(part => part.type === 'month').value;
    const day = parts.find(part => part.type === 'day').value;

    const startDate = `${year}-${month}-${day}`; // 'YYYY-MM-DD' 格式
    console.log('今天日期是:', startDate);

    // 生成随机ID
    const generateRandomId = () => {
      return Math.random().toString(36).substr(2, 9);  // 生成一个9位的随机ID
    };

    const randomId = generateRandomId();  // 生成随机ID

    // 确保 study_users 集合存在
    const studyUsersCollection = db.collection('study_users');

    // 插入新记录
    const result = await studyUsersCollection.add({
      _id: randomId,  // 使用随机生成的ID作为记录的ID
      userId: userId,  // 存储用户ID
      nickname: user.nickname,  // 从用户信息中获取昵称
      avatarUrl: user.avatarUrl,  // 从用户信息中获取头像
      startTime: currentDate,  // 使用当前时间作为自习开始时间
      startDate: startDate,  // 使用今天日期作为自习开始日期
      createTime: currentDate  // 创建时间，使用当前时间
    });

    // 判断是否插入成功
    if (result && result.id) {
      console.log('自习记录创建成功，记录ID:', result.id);
      return {
        success: true,
        message: '用户自习记录已创建',
        data: {
          userId,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          startTime: currentDate,
          startDate: startDate,
          randomId: randomId
        }
      };
    } else {
      console.error('插入记录失败，返回结果:', result);
      return { success: false, message: '创建自习记录失败', error: result };
    }

  } catch (error) {
    console.error('云函数执行失败:', error);
    return {
      success: false,
      message: '云函数执行失败',
      error: error.message || error
    };
  }
};
