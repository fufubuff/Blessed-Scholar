// 云函数：getStudyReports

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { user_id } = event;

  if (!user_id) {
    return {
      code: 1,
      msg: '缺少用户ID',
    };
  }

  try {
    // 查询该用户的所有打卡记录
    const res = await db.collection('study_report')
      .where({ user_id: user_id }) // 根据 user_id 查询
      .orderBy('createTime', 'desc') // 按时间倒序排序
      .get(); // 获取查询结果

    return {
      code: 0,
      msg: '查询成功',
      data: res.data, // 返回查询到的记录
    };
  } catch (error) {
    console.error('查询失败：', error);
    return {
      code: 2,
      msg: '查询失败',
      error: error.message,
    };
  }
};
