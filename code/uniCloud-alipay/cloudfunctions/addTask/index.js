const db = uniCloud.database();

exports.main = async (event, context) => {
  const { user_id, taskData } = event;

  // 获取当前时间并调整时区（假设本地时区为中国时区，UTC+8）
  const currentDate = new Date();
  const localOffset = currentDate.getTimezoneOffset() * 60000;  // 获取时区偏移（单位：毫秒）
  const localTime = new Date(currentDate.getTime() - localOffset);  // 转换为本地时间
  const formattedDate = localTime.toISOString().split('T')[0];  // 获取本地日期，格式为 'YYYY-MM-DD'

  try {
    const dailytasksCollection = db.collection('Tasks');

    // 打印传递的数据
    console.log('添加任务的用户ID:', user_id);
    console.log('添加任务的数据:', taskData);

    // 将任务数据添加到 dailytasks 表中
    const result = await dailytasksCollection.add({
      user_id,            // 用户ID
      name: taskData.name,  // 任务名称
      clock_in_time: taskData.clock_in_time,  // 打卡时间
      reminder_time: taskData.reminder_time,  // 提醒时间
      repeat_dates: taskData.repeat_dates,  // 重复日期
      remarks: taskData.remarks,  // 备注
      date: formattedDate     // 当前日期（本地时间）
    });

    console.log('任务添加成功，返回结果:', result);
    return {
      code: 0,
      msg: '任务添加成功',
      data: result
    };
  } catch (error) {
    console.error('Error adding task:', error);
    return {
      code: 1,
      msg: '任务添加失败',
      data: null
    };
  }
};
