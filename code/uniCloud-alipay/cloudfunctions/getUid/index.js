// cloudfunctions/getUid/index.js
'use strict';

exports.main = async (event, context) => {
  // 在 Alipay 平台，用户的唯一标识符通常通过 context.OPENID 获取
  const uid = context.OPENID;

  if (uid) {
    return {
      success: true,
      uid: uid,
    };
  } else {
    return {
      success: false,
      message: '无法获取用户ID',
    };
  }
};
