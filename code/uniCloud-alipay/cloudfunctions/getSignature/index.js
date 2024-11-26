// 云函数名称: getSignature

const db = uniCloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { user_id } = event;  // 获取用户ID

  if (!user_id) {
    return {
      code: 1,
      msg: '缺少用户ID',
      data: null
    };
  }

  try {
    const usersCollection = db.collection('signature');
    const res = await usersCollection.where({ user_id: user_id }).get();

    if (res.data.length > 0) {
      const user = res.data[0];
      return {
        code: 0,
        msg: '获取签名成功',
        signature: user.signature || ''
      };
    } else {
      return {
        code: 2,
        msg: '未找到用户',
        signature: ''
      };
    }
  } catch (error) {
    console.error('获取签名失败:', error);
    return {
      code: 1,
      msg: '获取签名失败',
      signature: ''
    };
  }
};
