const db = uniCloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { user_id } = event;  // 获取用户ID

  // 获取本地日期
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');  // 月份从0开始，需要加1
  const day = String(today.getDate()).padStart(2, '0');
  const todayDate = `${year}-${month}-${day}`;  // 格式化为 "yyyy-mm-dd"

  try {
    // 获取当天的任务
    const tasks = await db.collection('Tasks')
      .where({
        user_id: user_id,  // 用户ID匹配
        date: todayDate     // 日期匹配
      })
      .get();

    // 只返回 name 和 remarks
    const filteredTasks = tasks.data.map(task => ({
      name: task.name,
      remarks: task.remarks
    }));

    return {
      tasks: filteredTasks  // 返回查询到的任务
    };

  } catch (error) {
    console.error('获取任务失败:', error);
    return {
      tasks: []  // 出现错误时返回空任务
    };
  }
};
