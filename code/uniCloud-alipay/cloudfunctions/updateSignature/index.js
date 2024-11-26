// 云函数名称: updateSignature

const db = uniCloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { user_id, signature } = event;

  if (!user_id || typeof signature !== 'string') {
    return {
      code: 1,
      msg: '参数错误',
      data: null
    };
  }

  try {
    const usersCollection = db.collection('signature');
    const res = await usersCollection.where({ user_id: user_id }).get();

    if (res.data.length > 0) {
      // 用户存在，更新签名
      const updateRes = await usersCollection.where({ user_id: user_id }).update({
        signature: signature
      });
      return {
        code: 0,
        msg: '更新签名成功',
        data: updateRes
      };
    } else {
      // 用户不存在，创建新用户
      const addRes = await usersCollection.add({
        user_id: user_id,
        signature: signature
      });
      return {
        code: 0,
        msg: '创建用户并更新签名成功',
        data: addRes
      };
    }
  } catch (error) {
    console.error('更新签名失败:', error);
    return {
      code: 1,
      msg: '更新签名失败',
      data: null
    };
  }
};
