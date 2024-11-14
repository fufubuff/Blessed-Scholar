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

    // 获取当前时间戳和今天日期
    const startTime = Date.now();  // 当前时间戳（毫秒）
    const startDate = new Date().toISOString().split('T')[0];  // 获取今天的日期（格式：yyyy-MM-dd）

    // 随机生成一个唯一的ID
    const generateRandomId = () => {
      return Math.random().toString(36).substr(2, 9);  // 生成一个9位的随机ID
    };

    const randomId = generateRandomId();  // 生成随机ID

    // 确保study_users集合存在
    const studyUsersCollection = db.collection('study_users');

    // 直接插入新记录，使用自定义的随机ID
    const result = await studyUsersCollection.add({
      _id: randomId,  // 使用随机生成的ID作为记录的ID
      userId: userId,  // 存储用户ID
      nickname: user.nickname,  // 从用户信息中获取昵称
      avatarUrl: user.avatarUrl,  // 从用户信息中获取头像
      startTime: startTime,  // 使用当前时间戳作为自习开始时间
      startDate: startDate,  // 使用今天日期作为自习开始日期
      createTime: startTime  // 创建时间，使用时间戳
    });

    // 打印插入后的详细结果
    console.log('Insert result:', result);  // 打印插入结果

    // 判断是否插入成功，改为检查返回结果的结构
    if (result && result.id) {  // 检查是否有返回id，确认插入成功
      console.log('自习记录创建成功，记录ID:', result.id);  // 打印成功插入的记录ID
      return {
        success: true,
        message: '用户自习记录已创建',
        data: {
          userId,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          startTime: startTime,  // 返回自习开始时间戳
          startDate: startDate,  // 返回自习开始日期
          randomId: randomId    // 返回生成的随机ID
        }
      };
    } else {
      console.error('插入记录失败，返回结果:', result);  // 打印失败的详细信息
      return { success: false, message: '创建自习记录失败', error: result };
    }

  } catch (error) {
    console.error('云函数执行失败:', error);  // 输出错误信息
    return {
      success: false,
      message: '云函数执行失败',
      error: error.message || error
    };
  }
};
