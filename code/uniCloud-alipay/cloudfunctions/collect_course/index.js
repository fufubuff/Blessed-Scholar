'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
    const { course_id, action, user_id } = event; // 从事件参数获取 user_id

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

        if (action === 'add') {
            // 添加课程ID到 starred_courses 数组中，避免重复
            await usersCollection.doc(user_id).update({
                starred_courses: db.command.addToSet(course_id)
            });
            return {
                code: 0,
                msg: '收藏成功'
            };
        } else if (action === 'remove') {
            // 从 starred_courses 数组中移除课程ID
            await usersCollection.doc(user_id).update({
                starred_courses: db.command.pull(course_id)
            });
            return {
                code: 0,
                msg: '取消收藏成功'
            };
        } else {
            return {
                code: 1,
                msg: '无效的操作类型'
            };
        }
    } catch (error) {
        console.error('操作失败:', error);
        return {
            code: 1,
            msg: '操作失败，请稍后重试'
        };
    }
};