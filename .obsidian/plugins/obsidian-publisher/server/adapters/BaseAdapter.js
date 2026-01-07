const axios = require('axios');
const cheerio = require('cheerio');
const { HttpsProxyAgent } = require('https-proxy-agent');
const config = require('../config');

class BaseAdapter {
  constructor() {
    this.name = '';
    this.displayName = '';
    this.icon = '';
    this.supportedTypes = ['html'];
    this.cookie = '';
    
    // HTTP 客户端配置（不带代理，Cookie 请求不需要代理）
    const clientConfig = {
      timeout: config.get('timeout.http'),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    };
    
    this.httpClient = axios.create(clientConfig);
  }
  
  /**
   * 创建独立的 axios 实例（用于下载图片等场景，不带 Cookie）
   * 支持代理配置
   */
  createCleanHttpClient() {
    const proxy = config.getProxy();
    
    const clientConfig = {
      timeout: config.get('timeout.imageDownload'),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      },
    };
    
    // 如果配置了代理，使用代理
    if (proxy) {
      clientConfig.httpsAgent = new HttpsProxyAgent(proxy);
      clientConfig.proxy = false; // 禁用 axios 内置代理
    }
    
    return axios.create(clientConfig);
  }

  /**
   * 设置 Cookie
   */
  setCookie(cookie) {
    this.cookie = cookie;
    this.httpClient.defaults.headers.Cookie = cookie;
  }

  /**
   * 获取 Cookie
   */
  getCookie() {
    return this.cookie;
  }

  /**
   * 检查认证状态
   */
  async checkAuth() {
    throw new Error('checkAuth not implemented');
  }

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    throw new Error('getUserInfo not implemented');
  }

  /**
   * 创建草稿
   */
  async createDraft(post) {
    throw new Error('createDraft not implemented');
  }

  /**
   * 上传图片
   */
  async uploadImage(image) {
    throw new Error('uploadImage not implemented');
  }

  /**
   * 更新文章
   */
  async updatePost(postId, post) {
    throw new Error('updatePost not implemented');
  }

  /**
   * 发布文章
   */
  async publishPost(postId) {
    throw new Error('publishPost not implemented');
  }

  /**
   * 删除文章
   */
  async deletePost(postId) {
    throw new Error('deletePost not implemented');
  }

  /**
   * 内容预处理
   */
  preprocessContent(content) {
    return content;
  }

  /**
   * 生成二维码（可选）
   */
  async generateQRCode() {
    throw new Error('generateQRCode not supported');
  }

  /**
   * 检查二维码状态（可选）
   */
  async checkQRCodeStatus(qrId) {
    throw new Error('checkQRCodeStatus not supported');
  }

  /**
   * 账号密码登录（可选）
   */
  async loginWithPassword(username, password) {
    throw new Error('loginWithPassword not supported');
  }

  /**
   * 辅助方法：解析 HTML
   */
  parseHtml(html) {
    return cheerio.load(html);
  }

  /**
   * 辅助方法：提取错误信息
   */
  extractError(response) {
    if (response.data) {
      if (response.data.error) return response.data.error;
      if (response.data.message) return response.data.message;
      if (response.data.msg) return response.data.msg;
    }
    return '未知错误';
  }
}

module.exports = BaseAdapter;
