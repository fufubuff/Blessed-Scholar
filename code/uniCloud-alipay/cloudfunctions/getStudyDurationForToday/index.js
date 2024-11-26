// 云函数：getStudyDurationForToday

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { user_id } = event; // 从 event 中获取 user_id

  if (!user_id) {
    return {
      code: 1,
      msg: '缺少用户ID'
    };
  }

  // 使用 Intl.DateTimeFormat 获取指定时区的当前日期
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', // UTC+8 时区
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find(part => part.type === 'year').value;
  const month = parts.find(part => part.type === 'month').value;
  const day = parts.find(part => part.type === 'day').value;

  const todayStr = `${year}-${month}-${day}`; // 格式化为 'YYYY-MM-DD'

  console.log('收到的 user_id 参数:', user_id);
  console.log('今天的日期:', todayStr);

  try {
    // 查询 study_users 集合中符合条件的记录
    const res = await db.collection('study_users')
      .where({
        userId: user_id,  // 注意：字段名称应与数据库中的字段一致
        startDate: todayStr
      })
      .get();

    console.log('查询到的学习记录:', JSON.stringify(res.data));

    if (!res.data || res.data.length === 0) {
      console.log('今天没有学习记录');
      return {
        code: 0,
        totalStudyDuration: 0,
        msg: '今天没有学习记录'
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
        for (let item of record.studyRecords) {
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
        }
      }
    }

    console.log('今日总学习时长（秒）:', totalStudyDuration);

    return {
      code: 0,
      totalStudyDuration: totalStudyDuration,  // 返回总学习时长，单位为秒
      msg: '成功获取今日的学习时长'
    };
  } catch (error) {
    console.error('获取学习数据失败:', error);
    return {
      code: 2,
      msg: '获取学习数据失败',
      details: error.message
    };
  }
};
