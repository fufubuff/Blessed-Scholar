'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const { postId } = event;

  console.log('获取帖子详情的postId:', postId);

  if (!postId) {
    return {
      success: false,
      error: '缺少帖子ID',
    };
  }

  try {
    const res = await db.collection('POST_CARD').doc(postId).get();
    console.log('查询结果:', res);

    if (res.data && res.data.length > 0) {
      const post = res.data[0];
      return {
        success: true,
        data: post,
      };
    } else {
      return {
        success: false,
        error: '帖子不存在',
      };
    }
  } catch (err) {
    console.error('获取帖子详情失败:', err);
    return {
      success: false,
      error: err.message || '获取帖子详情失败',
    };
  }
};