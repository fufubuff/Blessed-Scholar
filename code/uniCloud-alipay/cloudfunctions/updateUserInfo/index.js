// 云函数：updateUserInfo
const db = uniCloud.database();

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const { userId, avatarUrl, nickname, gender, birthday, school, major, year, signature } = event;
  
  if (!userId) {
    return {
      code: 1,
      msg: '缺少user_id'
    };
  }

  try {
    // 更新用户信息
    const userCollection = db.collection('users');
    
    const updateResult = await userCollection.doc(userId).update({
          avatarUrl,
          nickname,
          gender,
          birthday,
          school,
          major,
          year,
          signature
        });

    if (updateResult.updated === 1) {
          return { code: 0, msg: '更新成功', success: true };
        } else {
          return { code: 1, msg: '没有数据更新', success: false };
        }
      } catch (error) {
        console.error('更新用户信息失败:', error);
        return { code: 1, msg: '更新失败', success: false };
      }
};