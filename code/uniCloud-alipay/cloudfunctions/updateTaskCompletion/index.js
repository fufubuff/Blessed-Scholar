// 云函数：updateTaskCompletion
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { taskId, completed } = event;

  const res = await db.collection('Tasks')
    .doc(taskId)  // 根据任务ID更新
    .update({
      completed: completed
    });

  return res;
};
