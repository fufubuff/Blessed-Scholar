'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	let res=await db.collection("POST_CARD").field({data:true}).get();
	//返回数据给客户端
	return res;
};
