// 云函数：report_posts
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { title, content, images } = event;

  if (!title || !content) {
    return {
      code: 400,
      msg: '标题和内容不能为空'
    };
  }

  try {
    const result = await db.collection('report_posts').add({
      title,
      content,
      images,
      createTime: new Date()
    });

    return {
      code: 200,
      msg: '发布成功',
      data: result
    };
  } catch (error) {
    return {
      code: 500,
      msg: '发布失败',
      error
    };
  }
};
