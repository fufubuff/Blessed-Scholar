'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
    const { user_id } = event;

    if (!user_id) {
        return {
            code: 1,
            msg: '用户未登录'
        };
    }

    try {
        const usersCollection = db.collection('users');
        const userDoc = await usersCollection.doc(user_id).get();

        if (!userDoc.data || userDoc.data.length === 0) {
            return {
                code: 1,
                msg: '用户不存在'
            };
        }

        return {
            code: 0,
            msg: '获取用户收藏课程数据成功',
            data: {
                starred_courses: userDoc.data[0].starred_courses || []
            }
        };
    } catch (error) {
        console.error('获取用户收藏课程数据失败:', error);
        return {
            code: 1,
            msg: '获取用户收藏课程数据失败',
            data: null
        };
    }
};