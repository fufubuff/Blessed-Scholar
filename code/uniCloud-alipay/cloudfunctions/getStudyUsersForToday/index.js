const db = uniCloud.database();

exports.main = async (event, context) => {
  // 获取今天的日期
  const today = event.today || new Date().toISOString().split('T')[0];
  console.log('收到的 today 参数:', today);

  try {
    // 查询数据库中的 study_users 集合，筛选出 startDate 等于 today 的数据
    const studyUsers = await db.collection('study_users')
      .where({
        startDate: today  // 使用 startDate 字段来筛选
      })
      .get();

    console.log('查询到的学习记录:', JSON.stringify(studyUsers));  // 输出查询到的学习记录

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
      console.log('正在处理用户:', user.nickname);  // 输出当前用户的信息

      let totalStudyDuration = 0;

      // 累加学习时长字段
      if (user.studyDuration) {
        console.log('找到学习时长:', user.studyDuration);  // 输出学习时长
        if (typeof user.studyDuration === 'number' && !isNaN(user.studyDuration) && user.studyDuration > 0) {
          totalStudyDuration += user.studyDuration;  // 累加学习时长
        } else {
          console.log('无效的学习时长数据:', user.studyDuration);  // 输出无效数据
        }
      }

      // 如果用户有学习记录，累加所有学习记录的学习时长
      if (user.studyRecords && Array.isArray(user.studyRecords)) {
        console.log('用户的学习记录:', user.studyRecords);  // 输出学习记录

        // 累加每条学习记录的 studyDuration 字段
        totalStudyDuration += user.studyRecords.reduce((total, record) => {
          console.log('当前学习记录:', record);  // 输出每一条学习记录
          const duration = record.studyDuration;

          if (typeof duration === 'number' && !isNaN(duration) && duration > 0) {
            console.log('有效的学习时长:', duration);  // 输出有效的学习时长
            return total + duration;  // 累加有效的学习时长
          }

          // 如果没有 studyDuration 字段，但有 startTime 和 endTime，计算时长
          if (record.startTime && record.endTime) {
            const calculatedDuration = (record.endTime - record.startTime) / 1000; // 秒
            console.log('计算的学习时长:', calculatedDuration);  // 输出计算的学习时长
            if (calculatedDuration > 0) {
              return total + calculatedDuration;  // 累加计算的学习时长
            }
          }

          console.log('无效的学习时长数据，跳过：', duration);  // 如果是无效数据，跳过
          return total;  // 无效时跳过，不累加
        }, 0);
      }

      // 如果用户已经存在，则更新总学习时长
      if (userMap.has(user.nickname)) {
        let existingData = userMap.get(user.nickname);
        existingData.totalStudyDuration += totalStudyDuration;
        userMap.set(user.nickname, existingData);
      } else {
        // 如果用户不存在，则将当前用户数据添加到 map
        userMap.set(user.nickname, {
          nickname: user.nickname || '未知用户',
          avatarUrl: user.avatarUrl || '/static/default-avatar.jpg',
          totalStudyDuration: totalStudyDuration,
        });
      }
    }

    // 将 Map 转换为数组
    result = Array.from(userMap.values());

    console.log('返回的排行榜数据:', result);  // 输出最终的排行榜数据

    return result;  // 返回最终结果
  } catch (error) {
    console.error('获取学习数据失败:', error);  // 输出详细错误信息
    return { error: '获取学习数据失败', details: error };  // 返回失败信息
  }
};