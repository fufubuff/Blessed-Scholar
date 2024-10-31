const db = uniCloud.database();

exports.main = async (event, context) => {
  const { account, newNickname } = event; // 确保使用 newNickname

  try {
    const searchResult = await db.collection('users').where({ account }).get();
    
    if (searchResult.data.length > 0) {
      const userId = searchResult.data[0]._id;

      // 确保 newNickname 是有效的字符串
      if (newNickname && newNickname.trim() !== "") {
        const updateResult = await db.collection('users').doc(userId).update({ nickname: newNickname });

        if (updateResult.updated > 0) {
          return {
            success: true,
            message: '昵称更新成功'
          };
        } else {
          return {
            success: false,
            message: '昵称更新失败或未发生更改'
          };
        }
      } else {
        return {
          success: false,
          message: '提供的昵称无效'
        };
      }
    } else {
      return {
        success: false,
        message: '未找到该用户'
      };
    }
  } catch (error) {
    console.error('更新昵称时出现错误:', error);
    return {
      success: false,
      message: '更新昵称时出现错误',
      error: error.message // 返回错误信息
    };
  }
};
