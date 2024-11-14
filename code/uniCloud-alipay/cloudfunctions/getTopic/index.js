'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
    try {
        const collectionRef = db.collection('topic');
        const res = await collectionRef.get();
        return {
            code: 0,
            msg: '获取题库数据成功',
            data: res.data
        };
    } catch (error) {
        console.error('获取题库数据失败:', error);
        return {
            code: 1,
            msg: '获取题库数据失败',
            data: null
        };
    }
};