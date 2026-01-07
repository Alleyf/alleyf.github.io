const ZhihuAdapter = require('./ZhihuAdapter');
const CsdnAdapter = require('./CsdnAdapter');
const WeixinAdapter = require('./WeixinAdapter');
const ToutiaoAdapter = require('./ToutiaoAdapter');
// 更多适配器...

class PlatformFactory {
  static adapters = {
    zhihu: ZhihuAdapter,
    csdn: CsdnAdapter,
    weixin: WeixinAdapter,
    toutiao: ToutiaoAdapter,
    // juejin: JuejinAdapter,  // TODO
    // jianshu: JianshuAdapter,  // TODO
    // cnblog: CnblogAdapter,  // TODO
    // segmentfault: SegmentfaultAdapter,  // TODO
  };

  static instances = {};

  /**
   * 获取适配器实例
   */
  static getAdapter(platform) {
    if (!this.adapters[platform]) {
      throw new Error(`不支持的平台: ${platform}`);
    }

    // 单例模式
    if (!this.instances[platform]) {
      const AdapterClass = this.adapters[platform];
      this.instances[platform] = new AdapterClass();
    }

    return this.instances[platform];
  }

  /**
   * 注册适配器
   */
  static registerAdapter(platform, AdapterClass) {
    this.adapters[platform] = AdapterClass;
  }

  /**
   * 获取支持的平台列表
   */
  static getSupportedPlatforms() {
    return Object.keys(this.adapters);
  }
}

module.exports = PlatformFactory;
