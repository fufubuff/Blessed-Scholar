// 云函数 getPosts 示例代码
const db = uniCloud.database(); // 获取数据库对象

exports.main = async (event, context) => {
  try {
    // 假设是从名为 'posts' 的集合中查询数据
    const postsCollection = db.collection('posts');
    
    // 查询所有帖子数据
    const result = await postsCollection.get();

    if (result.data.length > 0) {
      return {
        success: true,
        data: result.data,
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
      error: error.message, // 返回具体的错误信息
      statusCode: 500
    };
  }
};