// cloudfunctions/getChatHistory/index.js
'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { userId, date, assistantRole } = event;

  const chatHistoryCollection = db.collection('chat_history');
  const res = await chatHistoryCollection.where({
    user_id: userId,
    date: date,
    assistant_role: assistantRole,
  }).get();

  if (res.data && res.data.length > 0) {
    return {
      success: true,
      data: res.data[0].messages,
    };
  } else {
    return {
      success: true,
      data: [],
    };
  }
};
