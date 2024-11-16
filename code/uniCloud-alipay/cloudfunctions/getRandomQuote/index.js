const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    // 获取所有语录
    const res = await db.collection('quotes').get();

    if (res.data.length > 0) {
      // 生成一个随机索引
      const randomIndex = Math.floor(Math.random() * res.data.length);
      const randomQuote = res.data[randomIndex].quote;  // 获取随机语录

      return {
        code: 200,
        message: '随机语录获取成功',
        data: randomQuote // 返回随机语录
      };
    } else {
      return {
        code: 404,
        message: '没有找到语录',
        data: '暂无语录'
      };
    }
  } catch (e) {
    return {
      code: 500,
      message: '获取语录失败',
      data: e
    };
  }
};
