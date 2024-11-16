// 云函数代码：getHelpRequestDetails.js

const db = uniCloud.database();  // 获取数据库实例

exports.main = async (event, context) => {
  try {
    // 获取传入的帮助请求的 ID（从前端传入）
    const { helpRequestId } = event;

    // 查询 'helpRequests' 集合中的特定帖子
    const result = await db.collection('helpRequests').where({
      _id: helpRequestId
    }).get();

    if (result.data.length > 0) {
      return {
        success: true,
        data: result.data[0],  // 返回查询的第一个结果
        statusCode: 200
      };
    } else {
      return {
        success: false,
        message: '没有找到帖子数据',
        statusCode: 404
      };
    }
  } catch (error) {
    console.error('获取帖子数据失败', error);
    return {
      success: false,
      message: '获取帖子数据失败',
      error: error.message,  // 返回具体的错误信息
      statusCode: 500
    };
  }
};
