'use strict';

const axios = require('axios');

exports.main = async (event, context) => {
  try {
    const response = await axios.get('https://api.github.com');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('外部请求失败：', error);
    return {
      success: false,
      message: '外部请求失败',
      error: error.message,
    };
  }
};
