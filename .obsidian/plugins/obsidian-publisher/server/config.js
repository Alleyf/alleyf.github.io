/**
 * 服务器配置管理
 * 使用单例模式，支持动态更新和持久化
 */

const fs = require('fs');
const path = require('path');

class ConfigManager {
  constructor() {
    this.configFile = path.join(__dirname, 'data', 'config.json');
    this.config = this.loadConfig();
  }

  /**
   * 加载配置（优先级：文件 > 环境变量 > 默认值）
   */
  loadConfig() {
    const defaultConfig = {
      port: 3000,
      proxy: {
        enabled: false,
        url: '',
      },
      timeout: {
        http: 30000,
        imageDownload: 60000,
      },
      retry: {
        maxAttempts: 3,
        delay: 2000,
      },
      image: {
        maxSizeMB: 2,
        quality: 85,
        maxWidth: 900,
      },
    };

    // 从文件加载
    let fileConfig = {};
    try {
      if (fs.existsSync(this.configFile)) {
        const data = fs.readFileSync(this.configFile, 'utf8');
        fileConfig = JSON.parse(data);
      }
    } catch (error) {
      console.warn('Failed to load config file:', error.message);
    }

    // 从环境变量加载
    const envConfig = {
      port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
      proxy: {
        enabled: process.env.PROXY_ENABLED === 'true' ? true : undefined,
        url: process.env.PROXY_URL || undefined,
      },
      timeout: {
        http: process.env.HTTP_TIMEOUT ? parseInt(process.env.HTTP_TIMEOUT) : undefined,
        imageDownload: process.env.IMAGE_DOWNLOAD_TIMEOUT ? parseInt(process.env.IMAGE_DOWNLOAD_TIMEOUT) : undefined,
      },
    };

    // 合并配置（环境变量 > 文件 > 默认值）
    return this.deepMerge(defaultConfig, fileConfig, envConfig);
  }

  /**
   * 深度合并对象
   */
  deepMerge(...objects) {
    const result = {};
    for (const obj of objects) {
      for (const key in obj) {
        if (obj[key] !== undefined) {
          if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
            result[key] = this.deepMerge(result[key] || {}, obj[key]);
          } else {
            result[key] = obj[key];
          }
        }
      }
    }
    return result;
  }

  /**
   * 保存配置到文件
   */
  saveConfig() {
    try {
      const dir = path.dirname(this.configFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Failed to save config:', error.message);
    }
  }

  /**
   * 获取配置
   */
  get(key) {
    if (!key) return this.config;
    
    const keys = key.split('.');
    let value = this.config;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  }

  /**
   * 设置配置
   */
  set(key, value) {
    const keys = key.split('.');
    let obj = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) {
        obj[keys[i]] = {};
      }
      obj = obj[keys[i]];
    }
    
    obj[keys[keys.length - 1]] = value;
    this.saveConfig();
  }

  /**
   * 更新代理配置
   */
  updateProxy(enabled, url) {
    this.config.proxy.enabled = enabled;
    this.config.proxy.url = url;
    this.saveConfig();
    console.log('🔧 Proxy configuration updated:', this.config.proxy);
  }

  /**
   * 获取代理配置
   */
  getProxy() {
    if (this.config.proxy.enabled && this.config.proxy.url) {
      return this.config.proxy.url;
    }
    return null;
  }
}

// 导出单例
module.exports = new ConfigManager();
