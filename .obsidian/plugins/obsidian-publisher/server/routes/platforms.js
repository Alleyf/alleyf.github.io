const express = require('express');
const router = express.Router();
const PlatformFactory = require('../adapters/PlatformFactory');

/**
 * 获取支持的平台列表
 * GET /api/platforms
 */
router.get('/', (req, res) => {
  const platforms = PlatformFactory.getSupportedPlatforms();
  res.json({ platforms });
});

/**
 * 获取平台信息
 * GET /api/platforms/:platform
 */
router.get('/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const adapter = PlatformFactory.getAdapter(platform);
    
    const info = {
      name: adapter.name,
      displayName: adapter.displayName,
      icon: adapter.icon,
      supportedTypes: adapter.supportedTypes,
    };
    
    res.json(info);
  } catch (error) {
    res.status(404).json({ error: '平台不存在' });
  }
});

module.exports = router;
