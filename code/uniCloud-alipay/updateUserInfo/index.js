// 云函数：updateUserInfo
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { account, ...userData } = event;

  try {
    const result = await db.collection('users').where({ account }).update(userData);
    if (result.updated > 0) {
      return { success: true, message: '用户信息更新成功' };
    } else {
      return { success: false, message: '用户信息更新失败' };
    }
  } catch (error) {
    return { success: false, message: '更新用户信息时出错', error };
  }
};
