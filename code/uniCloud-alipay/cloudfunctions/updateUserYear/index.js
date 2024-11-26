const db = uniCloud.database();

exports.main = async (event, context) => {
  // 从调用参数中获取账户名和新的年份
  const { account, year } = event; // 修改 newYear 为 year，保持一致性

  try {
    // 在 'users' 集合中查找账户名对应的用户
    const searchResult = await db.collection('users').where({ account }).get();
    
    if (searchResult.data.length > 0) {
      // 如果找到用户，更新年份
      const userId = searchResult.data[0]._id; // 获取用户ID
      const updateResult = await db.collection('users').doc(userId).update({
        year // 更新年份字段，简写
      });

      if (updateResult.updated > 0) {
        // 成功更新数据
        return {
          success: true,
          message: '年份更新成功'
        };
      } else {
        // 数据未更改
        return {
          success: false,
          message: '年份更新失败或未发生更改'
        };
      }
    } else {
      // 没有找到用户
      return {
        success: false,
        message: '未找到该用户'
      };
    }
  } catch (error) {
    // 更新过程中出错
    return {
      success: false,
      message: '更新年份时出现错误',
      error: error.message // 只返回错误信息，避免返回整个错误对象
    };
  }
};
