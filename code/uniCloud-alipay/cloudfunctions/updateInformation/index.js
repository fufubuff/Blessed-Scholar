'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { collection, data, _id } = event;

  try {
    const collectionRef = db.collection(collection);

    let res;
    if (_id) {
      // 更新已有数据
      res = await collectionRef.doc(_id).update(data);
      return {
        code: 0,
        msg: `${collection}数据已成功更新`,
        data: res
      };
    } else {
      // 插入新的数据
      res = await collectionRef.add(data);
      return {
        code: 0,
        msg: `${collection}数据已成功插入`,
        data: res
      };
    }
  } catch (error) {
    console.error(`Error processing ${collection} data:`, error);
    return {
      code: 1,
      msg: `处理${collection}数据失败`,
      data: null
    };
  }
};