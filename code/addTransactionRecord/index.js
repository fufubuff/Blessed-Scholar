// 云函数：addTransactionRecord
exports.main = async (event, context) => {
  const { user_id, description, amount, date } = event;

  // 插入交易记录到数据库
  const db = uniCloud.database();
  const transactions = db.collection('transactions');

  try {
    const result = await transactions.add({
      user_id,
      description,
      amount,
      date
    });

    return {
      code: 0,
      msg: '交易记录添加成功',
      data: result
    };
  } catch (error) {
    return {
      code: 1,
      msg: '添加交易记录失败',
      error: error
    };
  }
};

