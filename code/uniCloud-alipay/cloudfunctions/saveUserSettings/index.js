'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { notifications, reminderTime, repeatDays } = event;
  
  try {
    const collection = db.collection('user_settings');
    const openId = context.CLIENTID;

    // 更新或创建用户设置
    const res = await collection.where({
      openId: openId
    }).update({
      notifications,
      reminderTime,
      repeatDays
    });

    if (res.updated === 0) {
      // 如果没有找到记录，则新增一条记录
      await collection.add({
        openId,
        notifications,
        reminderTime,
        repeatDays
      });
    }

    return {
      success: true,
      message: 'Settings updated successfully'
    };
  } catch (error) {
    console.error('Error updating settings:', error);
    return {
      success: false,
      message: 'Failed to update settings',
      error
    };
  }
};
