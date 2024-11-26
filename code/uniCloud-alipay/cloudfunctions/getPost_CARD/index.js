// 云函数: getPost_CARD.js
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  console.log('getPost_CARD 函数已被调用');
  try {
    const res = await db.collection('POST_CARD').get();
    console.log('查询结果:', res);
    return {
      success: true,
      data: res.data
    };
  } catch (error) {
    console.error('getPost_CARD 函数出错:', error);
    return {
      success: false,
      error: error.message
    };
  }
};