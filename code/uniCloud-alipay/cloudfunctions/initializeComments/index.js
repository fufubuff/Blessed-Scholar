'use strict';

exports.main = async (event, context) => {
  console.log('初始化评论云函数被调用');
  
  const db = uniCloud.database();
  const collection = db.collection('POST_CARD');
  
  try {
    console.log('开始执行 updateMany 操作');
    
    // 执行 updateMany 操作，为缺少 data.comments 的文档添加空数组
    const res = await collection.updateMany(
      { "data.comments": { $exists: false } },
      { $set: { "data.comments": [] } }
    );

    console.log('updateMany 操作结果:', res);
    
    return {
      success: true,
      message: `成功更新了 ${res.updated || 0} 条文档。`,
      details: res
    };
  } catch (error) {
    console.error('更新失败:', error);
    return {
      success: false,
      message: `更新失败: ${error.message}`
    };
  }
};