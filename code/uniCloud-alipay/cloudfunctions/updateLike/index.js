'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { postId, userId, action } = event;
  const collection = db.collection('POST_CARD');
  
  try {
    if (action === 'like') {
      // 点赞操作
      await collection.doc(postId).update({
        'data.user_liked': db.command.inc(1),
        'data.liked_users': db.command.addToSet(userId)
      });
    } else if (action === 'unlike') {
      // 取消点赞操作
      await collection.doc(postId).update({
        'data.user_liked': db.command.inc(-1),
        'data.liked_users': db.command.pull(userId)
      });
    }
    return { success: true, updated: true };
  } catch (error) {
    console.error('updateLike 云函数出错:', error);
    return { success: false, updated: false, message: error.message };
  }
};