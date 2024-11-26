// 云函数：添加帖子
exports.main = async (event, context) => {
  const { MongoClient } = require('mongodb');

  // 数据库连接配置
  const uri = "<你的 MongoDB 连接字符串>";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // 获取传入数据
  const {
    author,
    authorAvatar,
    date,
    content,
    images = [],
    followersCount,
    liked,
    starred,
    comments = []
  } = event;

  // 校验必填字段
  if (!author || !date || !content || followersCount === undefined || liked === undefined || starred === undefined) {
    return { success: false, message: "缺少必填字段" };
  }

  try {
    await client.connect();

    const database = client.db("<你的数据库名称>");
    const collection = database.collection("POSTS");

    // 准备文档数据
    const postDocument = {
      author,
      authorAvatar,
      date,
      content,
      images,
      followersCount,
      liked,
      starred,
      comments
    };

    // 插入文档
    const result = await collection.insertOne(postDocument);

    return {
      success: true,
      message: "帖子添加成功",
      data: result.insertedId
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "帖子添加失败", error: error.message };
  } finally {
    await client.close();
  }
};
