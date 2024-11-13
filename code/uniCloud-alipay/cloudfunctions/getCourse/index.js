'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
    try {
        const collectionRef = db.collection('course');
        const res = await collectionRef.get();
        return {
            code: 0,
            msg: '获取课程数据成功',
            data: res.data
        };
    } catch (error) {
        console.error('获取课程数据失败:', error);
        return {
            code: 1,
            msg: '获取课程数据失败',
            data: null
        };
    }
};