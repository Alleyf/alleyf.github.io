const fs = require('fs').promises;
const path = require('path');
const CryptoJS = require('crypto-js');
const PlatformFactory = require('../adapters/PlatformFactory');

const AUTH_FILE = path.join(__dirname, '../data/auth.json');
const SECRET_KEY = process.env.SECRET_KEY || 'obsidian-publisher-secret-key';

class AuthManager {
  constructor() {
    this.authData = {};
    this.init();
  }

  /**
   * 初始化
   */
  async init() {
    try {
      await this.loadAuthData();
    } catch (error) {
      console.error('Init auth manager error:', error);
    }
  }

  /**
   * 加载认证数据
   */
  async loadAuthData() {
    try {
      const data = await fs.readFile(AUTH_FILE, 'utf-8');
      this.authData = JSON.parse(data);
    } catch (error) {
      // 文件不存在，使用空对象
      this.authData = {};
    }
  }

  /**
   * 保存认证数据
   */
  async saveAuthData() {
    try {
      // 确保目录存在
      const dir = path.dirname(AUTH_FILE);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.writeFile(AUTH_FILE, JSON.stringify(this.authData, null, 2));
    } catch (error) {
      console.error('Save auth data error:', error);
      throw error;
    }
  }

  /**
   * 加密数据
   */
  encrypt(data) {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  }

  /**
   * 解密数据
   */
  decrypt(encrypted) {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * 检查认证状态
   */
  async checkAuth(platform) {
    const authInfo = this.authData[platform];
    
    if (!authInfo) {
      return false;
    }

    // 检查是否过期
    if (authInfo.expireAt && authInfo.expireAt < Date.now()) {
      return false;
    }

    // 通过适配器验证
    try {
      const adapter = PlatformFactory.getAdapter(platform);
      adapter.setCookie(this.decrypt(authInfo.cookie));
      return await adapter.checkAuth();
    } catch (error) {
      console.error(`Check auth for ${platform} error:`, error);
      return false;
    }
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(platform) {
    const authInfo = this.authData[platform];
    
    if (!authInfo) {
      throw new Error('未认证');
    }

    const adapter = PlatformFactory.getAdapter(platform);
    adapter.setCookie(this.decrypt(authInfo.cookie));
    
    return await adapter.getUserInfo();
  }

  /**
   * 导入 Cookie
   */
  async importCookie(platform, cookie) {
    try {
      console.log(`[AuthManager] Importing cookie for ${platform}`);
      
      // 验证 Cookie
      const adapter = PlatformFactory.getAdapter(platform);
      adapter.setCookie(cookie);
      
      console.log(`[AuthManager] Checking auth for ${platform}`);
      const isValid = await adapter.checkAuth();
      if (!isValid) {
        throw new Error('Cookie 无效或已过期');
      }

      console.log(`[AuthManager] Getting user info for ${platform}`);
      // 获取用户信息
      const userInfo = await adapter.getUserInfo();
      console.log(`[AuthManager] User info:`, userInfo);

      // 保存
      this.authData[platform] = {
        type: 'cookie',
        cookie: this.encrypt(cookie),
        userInfo,
        createdAt: Date.now(),
        expireAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 天
      };

      await this.saveAuthData();
      console.log(`[AuthManager] Cookie saved for ${platform}`);
    } catch (error) {
      console.error(`[AuthManager] Import cookie error:`, error);
      throw error;
    }
  }

  /**
   * 生成二维码
   */
  async generateQRCode(platform) {
    const adapter = PlatformFactory.getAdapter(platform);
    
    if (!adapter.generateQRCode) {
      throw new Error('该平台不支持二维码登录');
    }

    return await adapter.generateQRCode();
  }

  /**
   * 检查二维码状态
   */
  async checkQRCodeStatus(platform, qrId) {
    const adapter = PlatformFactory.getAdapter(platform);
    
    if (!adapter.checkQRCodeStatus) {
      throw new Error('该平台不支持二维码登录');
    }

    const status = await adapter.checkQRCodeStatus(qrId);

    // 如果登录成功，保存认证信息
    if (status.status === 'success' && status.cookie) {
      await this.importCookie(platform, status.cookie);
    }

    return status;
  }

  /**
   * 账号密码登录
   */
  async loginWithPassword(platform, username, password) {
    const adapter = PlatformFactory.getAdapter(platform);
    
    if (!adapter.loginWithPassword) {
      throw new Error('该平台不支持账号密码登录');
    }

    const result = await adapter.loginWithPassword(username, password);

    if (result.cookie) {
      await this.importCookie(platform, result.cookie);
    }

    return result;
  }

  /**
   * 登出
   */
  async logout(platform) {
    delete this.authData[platform];
    await this.saveAuthData();
  }

  /**
   * 获取 Cookie
   */
  getCookie(platform) {
    const authInfo = this.authData[platform];
    
    if (!authInfo) {
      return null;
    }

    return this.decrypt(authInfo.cookie);
  }

  /**
   * 刷新 Cookie
   */
  async refreshCookie(platform) {
    // TODO: 实现 Cookie 刷新逻辑
    // 不同平台的刷新机制不同
  }
}

module.exports = AuthManager;
