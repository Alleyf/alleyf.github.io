const express = require('express');
const router = express.Router();
const AuthManager = require('../managers/AuthManager');

const authManager = new AuthManager();

/**
 * 检查认证状态
 * GET /api/auth/:platform/status
 */
router.get('/:platform/status', async (req, res) => {
  try {
    const { platform } = req.params;
    const authenticated = await authManager.checkAuth(platform);
    
    res.json({ authenticated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 获取用户信息
 * GET /api/auth/:platform/userinfo
 */
router.get('/:platform/userinfo', async (req, res) => {
  try {
    const { platform } = req.params;
    const userInfo = await authManager.getUserInfo(platform);
    
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 导入 Cookie
 * POST /api/auth/:platform/cookie
 */
router.post('/:platform/cookie', async (req, res) => {
  const { platform } = req.params;
  
  try {
    const { cookie } = req.body;
    
    console.log(`[Auth] Importing cookie for platform: ${platform}`);
    
    if (!cookie) {
      return res.status(400).json({ error: 'Cookie 不能为空' });
    }
    
    // 导入 Cookie 并获取用户信息
    await authManager.importCookie(platform, cookie);
    
    // 获取用户信息
    const userInfo = await authManager.getUserInfo(platform);
    
    console.log(`[Auth] Cookie imported successfully for ${platform}`);
    res.json({ 
      success: true, 
      message: 'Cookie 导入成功',
      username: userInfo.username,
      uid: userInfo.uid,
      avatar: userInfo.avatar
    });
  } catch (error) {
    console.error(`[Auth] Import cookie error for ${platform}:`, error);
    res.status(500).json({ 
      error: error.message || 'Cookie 导入失败',
      details: error.stack 
    });
  }
});

/**
 * 生成二维码
 * POST /api/auth/:platform/qrcode
 */
router.post('/:platform/qrcode', async (req, res) => {
  try {
    const { platform } = req.params;
    const qrData = await authManager.generateQRCode(platform);
    
    res.json(qrData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 检查二维码状态
 * GET /api/auth/:platform/qrcode/:qrId
 */
router.get('/:platform/qrcode/:qrId', async (req, res) => {
  try {
    const { platform, qrId } = req.params;
    const status = await authManager.checkQRCodeStatus(platform, qrId);
    
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 账号密码登录
 * POST /api/auth/:platform/login
 */
router.post('/:platform/login', async (req, res) => {
  try {
    const { platform } = req.params;
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    
    await authManager.loginWithPassword(platform, username, password);
    
    res.json({ success: true, message: '登录成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 登出
 * POST /api/auth/:platform/logout
 */
router.post('/:platform/logout', async (req, res) => {
  try {
    const { platform } = req.params;
    await authManager.logout(platform);
    
    res.json({ success: true, message: '登出成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
