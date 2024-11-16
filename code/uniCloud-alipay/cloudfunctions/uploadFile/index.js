// 云函数：uploadFile
exports.main = async (event, context) => {
  const { file } = event; // 获取上传的文件信息

  // 生成云端文件的路径，可以根据需要更改路径
  const cloudPath = `study_images/${Date.now()}-${file.name}`;

  try {
    // 上传文件到云存储
    const uploadRes = await uniCloud.uploadFile({
      cloudPath: cloudPath,  // 云存储文件路径
      filePath: file.tempFilePath,  // 文件路径
    });

    // 上传成功，返回 fileID
    return {
      fileID: uploadRes.fileID,  // 文件ID
    };
  } catch (error) {
    // 上传失败，返回错误信息
    return {
      error: '文件上传失败',
      details: error.message,
    };
  }
};
