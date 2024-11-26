// 云函数：getComments
exports.main = async (event, context) => {
  const { postId } = event;
  const db = uniCloud.database();
  const collection = db.collection('POST_CARD');
  
  try {
    const post = await collection.doc(postId).get();
    if (post.data && post.data.length > 0) {
      return {
        success: true,
        data: post.data[0].data.comments || []
      };
    } else {
      return {
        success: false,
        error: '未找到帖子'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};