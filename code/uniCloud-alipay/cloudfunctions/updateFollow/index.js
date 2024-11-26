'use strict';

const db = uniCloud.database();
const followers = db.collection('followers');

exports.main = async (event, context) => {
  const { followerId, followeeId, action } = event;

  if (!followerId || !followeeId || !action) {
    return {
      success: false,
      message: '参数缺失',
    };
  }

  try {
    if (action === 'follow') {
      // 检查是否已关注
      const exists = await followers.where({
        followerId,
        followeeId,
      }).count();

      if (exists.total === 0) {
        // 添加关注记录
        await followers.add({
          followerId,
          followeeId,
          time: new Date().toISOString(),
        });
        console.log('成功添加关注记录');
      } else {
        console.log('关注记录已存在');
      }
      return {
        success: true,
        message: exists.total === 0 ? '关注成功' : '已关注',
      };
    } else if (action === 'unfollow') {
      // 删除关注记录
      const removeRes = await followers.where({
        followerId,
        followeeId,
      }).remove();
      console.log(`删除关注记录数量: ${removeRes.deleted}`);
      return {
        success: true,
        message: `已取消关注 ${removeRes.deleted} 条记录`,
      };
    } else {
      return {
        success: false,
        message: '无效的操作',
      };
    }
  } catch (error) {
    console.error('更新关注失败:', error);
    return {
      success: false,
      message: '操作失败',
    };
  }
};