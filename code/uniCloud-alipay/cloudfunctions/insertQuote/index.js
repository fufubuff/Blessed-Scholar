const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    // 假设你已经有一组语录数据
    const quotes = [
      "Never say never!",
      "The only way to do great work is to love what you do.",
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "Believe you can and you're halfway there.",
      "It does not matter how slowly you go as long as you do not stop.",
      "Life is 10% what happens to us and 90% how we react to it.",
      "You are never too old to set another goal or to dream a new dream.",
      "It always seems impossible until it’s done.",
      "The best way to predict the future is to create it.",
      "Success usually comes to those who are too busy to be looking for it.",
      "Don’t watch the clock; do what it does. Keep going.",
      "The way to get started is to quit talking and begin doing.",
      "Success is not how high you have climbed, but how you make a positive difference to the world.",
      "Your time is limited, so don’t waste it living someone else’s life.",
      "The only limit to our realization of tomorrow is our doubts of today.",
      "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.",
      "Do not wait to strike till the iron is hot, but make it hot by striking.",
      "Do one thing every day that scares you.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "Success is the sum of small efforts, repeated day in and day out.",
      // 更多语录 ...
    ];

    // 插入 100 条语录（示例只包含 20 条，你可以扩展）
    const insertPromises = [];

    for (let i = 0; i < 100; i++) {
      insertPromises.push(
        db.collection('quotes').add({
          quote: quotes[i % quotes.length],  // 循环使用示例语录
          created_at: new Date(),  // 添加时间戳
        })
      );
    }

    // 等待所有插入操作完成
    await Promise.all(insertPromises);

    return {
      code: 200,
      message: '成功插入100条语录',
    };
  } catch (error) {
    console.error('插入语录时发生错误:', error);
    return {
      code: 500,
      message: '插入语录失败',
      data: error.message,
    };
  }
};
