const db = uniCloud.database();

exports.main = async (event, context) => {
  // 使用 Intl.DateTimeFormat 获取指定时区的当前日期
  const currentDate = new Date();
  const timeZone = 'Asia/Shanghai'; // UTC+8 时区

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

  const today = `${year}-${month}-${day}`; // 格式化为 'YYYY-MM-DD'
  console.log('调整后的日期:', today);

  try {
    // 查询数据库中的 study_users 集合，筛选出 startDate 等于 today 的数据
    const studyUsers = await db.collection('study_users')
      .where({
        startDate: today  // 使用调整后的日期进行筛选
      })
      .get();

    console.log('查询到的学习记录:', JSON.stringify(studyUsers));

    // 如果没有查询到符合条件的数据，返回错误信息
    if (!studyUsers || !studyUsers.data || studyUsers.data.length === 0) {
      console.log('没有符合条件的数据');
      return { error: '没有符合条件的学习记录' };
    }

    // 获取所有符合条件的用户数据
    const userList = studyUsers.data;
    let result = [];

    // 用来累加每个用户的总学习时长
    const userMap = new Map();

    // 遍历每个用户的数据，合并学习时长
    for (let user of userList) {
      console.log('正在处理用户:', user.nickname);

      let totalStudyDuration = 0;

      // 累加学习时长字段
      if (user.studyDuration) {
        console.log('找到学习时长:', user.studyDuration);
        if (typeof user.studyDuration === 'number' && !isNaN(user.studyDuration) && user.studyDuration > 0) {
          totalStudyDuration += user.studyDuration;
        } else {
          console.log('无效的学习时长数据:', user.studyDuration);
        }
      }

      // 如果用户有学习记录，累加所有学习记录的学习时长
      if (user.studyRecords && Array.isArray(user.studyRecords)) {
        console.log('用户的学习记录:', user.studyRecords);

        // 累加每条学习记录的 studyDuration 字段
        totalStudyDuration += user.studyRecords.reduce((total, record) => {
          console.log('当前学习记录:', record);
          const duration = record.studyDuration;

          if (typeof duration === 'number' && !isNaN(duration) && duration > 0) {
            console.log('有效的学习时长:', duration);
            return total + duration;
          }

          // 如果没有 studyDuration 字段，但有 startTime 和 endTime，计算时长
          if (record.startTime && record.endTime) {
            const calculatedDuration = (record.endTime - record.startTime) / 1000; // 秒
            console.log('计算的学习时长:', calculatedDuration);
            if (calculatedDuration > 0) {
              return total + calculatedDuration;
            }
          }

          console.log('无效的学习时长数据，跳过：', duration);
          return total;
        }, 0);
      }

      // 从用户数据中获取 userId，注意根据实际字段名调整
      const userId = user.userId || user.user_id || user._id;

      // 如果用户已经存在，则更新总学习时长
      if (userMap.has(userId)) {
        let existingData = userMap.get(userId);
        existingData.totalStudyDuration += totalStudyDuration;
        userMap.set(userId, existingData);
      } else {
        // 如果用户不存在，则将当前用户数据添加到 map
        userMap.set(userId, {
          userId: userId,
          nickname: user.nickname || '未知用户',
          avatarUrl: user.avatarUrl || '/static/default-avatar.jpg',
          totalStudyDuration: totalStudyDuration,
        });
      }
    }

    // 将 Map 转换为数组
    result = Array.from(userMap.values());

    console.log('返回的排行榜数据:', result);

    return result;
  } catch (error) {
    console.error('获取学习数据失败:', error);
    return { error: '获取学习数据失败', details: error };
  }
};
