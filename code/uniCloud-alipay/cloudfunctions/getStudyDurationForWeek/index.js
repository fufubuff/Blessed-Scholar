const db = uniCloud.database();

exports.main = async (event, context) => {
  // 获取参数
  const { user_id, weekStart, weekEnd } = event;  // weekStart 和 weekEnd 格式应该是 "YYYY-MM-DD"
  
  console.log('收到的 user_id 参数:', user_id);
  console.log('收到的 weekStart 参数:', weekStart);
  console.log('收到的 weekEnd 参数:', weekEnd);

  if (!user_id || !weekStart || !weekEnd) {
    return {
      code: 1,
      msg: '缺少必要的参数'
    };
  }

  // 直接使用传入的日期字符串
  const weekStartFormatted = weekStart;
  const weekEndFormatted = weekEnd;

  console.log('使用的 weekStart:', weekStartFormatted);
  console.log('使用的 weekEnd:', weekEndFormatted);

  try {
    // 查询数据库中的 study_users 集合，筛选出符合条件的数据
    const res = await db.collection('study_users')
      .where({
        userId: user_id,  // 匹配数据库中的 userId 字段
        startDate: db.command.gte(weekStartFormatted).and(db.command.lte(weekEndFormatted))  // startDate 在 weekStart 和 weekEnd 之间
      })
      .get();

    console.log('查询到的学习记录:', JSON.stringify(res.data));  // 输出查询到的学习记录

    // 如果没有查询到符合条件的数据，返回提示信息
    if (!res.data || res.data.length === 0) {
      console.log('没有符合条件的数据');
      return {
        code: 0,
        totalStudyDuration: 0,  // 学习时长为 0
        msg: '在指定的一周内没有学习记录'
      };
    }

    const records = res.data;

    let totalStudyDuration = 0;

    // 遍历记录，累加学习时长
    for (let record of records) {
      // 累加 studyDuration 字段
      if (record.studyDuration && typeof record.studyDuration === 'number' && !isNaN(record.studyDuration) && record.studyDuration > 0) {
        totalStudyDuration += record.studyDuration;
        console.log('累加的学习时长:', record.studyDuration);
      }

      // 如果有 studyRecords，进一步累加每条记录的 studyDuration
      if (record.studyRecords && Array.isArray(record.studyRecords)) {
        record.studyRecords.forEach(item => {
          if (item.studyDuration && typeof item.studyDuration === 'number' && !isNaN(item.studyDuration) && item.studyDuration > 0) {
            totalStudyDuration += item.studyDuration;
            console.log('累加的学习记录时长:', item.studyDuration);
          } else if (item.startTime && item.endTime) {
            const duration = (item.endTime - item.startTime) / 1000; // 计算秒数
            if (duration > 0) {
              totalStudyDuration += duration;
              console.log('计算的学习记录时长:', duration);
            }
          } else {
            console.log('无效的学习记录:', item);
          }
        });
      }
    }

    console.log('总学习时长（秒）:', totalStudyDuration);

    return {
      code: 0,
      totalStudyDuration: totalStudyDuration,  // 返回总学习时长，单位为秒
      msg: '成功获取一周的学习时长'
    };
  } catch (error) {
    console.error('获取学习数据失败:', error);  // 输出详细错误信息
    return {
      code: 2,
      msg: '获取学习数据失败',
      details: error.message
    };
  }
};
