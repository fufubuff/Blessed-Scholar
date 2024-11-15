// cloudfunctions/customizeAI/index.js

'use strict';

exports.main = async (event, context) => {
    const db = uniCloud.database({
        env: 'env-00jxhjmdvord' // 替换为您的实际环境 ID
    });
    console.log('当前数据库环境 ID:', db.env); // 记录当前环境
    const usersCollection = db.collection('users');

    // 从事件中提取数据
    const { userid, studySituation, weakness, aipersonality } = event;

    // 记录接收到的参数
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received userid:', userid);
    console.log('Received studySituation:', studySituation);
    console.log('Received weakness:', weakness);
	console.log('Received aipersonality:', aipersonality);

    // 验证必要参数
    if (!userid) {
        console.warn('缺少用户ID（userid）');
        return {
            success: false,
            message: '缺少用户ID（userid）',
        };
    }

    if (!studySituation || !weakness) {
        console.warn('缺少必要的参数：studySituation 或 weakness');
        return {
            success: false,
            message: '缺少必要的参数：studySituation 或 weakness',
        };
    }

    try {
        // 使用 where 查询匹配 userid 字符串
        const userRes = await usersCollection.where({ userid: userid }).get();
        console.log('用户查询结果 userRes:', JSON.stringify(userRes, null, 2));

        let userData = null;
        if (userRes.data && userRes.data.length > 0) {
            userData = userRes.data[0];
            console.log('数据库里的user数据:', JSON.stringify(userData, null, 2));
        } else {
            console.warn('未找到对应的用户，userid:', userid);
        }

        // 准备要更新的数据
        const updateData = {
            studySituation: studySituation,
            weakness: weakness,
			aipersonality: aipersonality,
            updatedAt: Date.now(), // 使用服务器时间戳
        };

        if (userData) {
            // 使用 where 查询并更新文档，确保数据结构正确
            const updateRes = await usersCollection.where({ userid: userid }).updateAndReturn(updateData);
            console.log('更新结果 updateRes:', JSON.stringify(updateRes, null, 2));

            // 根据 UniCloud 的文档，updateRes 包含 updated 和 doc 字段
            if (updateRes.updated === 1) {
                console.log(`用户 ${userid} 更新成功`);
                return {
                    success: true,
                    message: '用户信息更新成功',
                    data: {
                        userid: userid,
                        avatarUrl: userData.avatarUrl || '/static/hxy.jpg',
                        ...updateRes.doc[0], // 返回更新后的文档
                    },
                };
            } else {
                console.warn(`用户 ${userid} 更新失败，返回数据:`, updateRes);
                return {
                    success: false,
                    message: '更新失败，用户信息未变更或用户可能不存在',
                };
            }
        } else {
            // 用户不存在
            console.warn(`用户不存在，无法更新信息，传入的 userid 是: ${userid}`);
            return {
                success: false,
                message: `用户不存在，无法更新信息，传入的 userid 是: ${userid}`,
            };
        }
    } catch (error) {
        console.error('更新或创建用户信息时出错：', error);
        return {
            success: false,
            message: '服务器错误，请稍后再试',
        };
    }
};
