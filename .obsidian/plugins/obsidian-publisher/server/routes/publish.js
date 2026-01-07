const express = require('express');
const router = express.Router();
const PlatformFactory = require('../adapters/PlatformFactory');

/**
 * 创建草稿
 * POST /api/publish/:platform/draft
 */
router.post('/:platform/draft', async (req, res) => {
  try {
    const { platform } = req.params;
    const { title, content, summary, tags } = req.body;
    
    console.log(`Creating draft for ${platform}:`, { title, contentLength: content?.length });
    
    // 获取 AuthManager 并加载 Cookie
    const AuthManager = require('../managers/AuthManager');
    const authManager = new AuthManager();
    await authManager.init();
    
    const cookie = authManager.getCookie(platform);
    if (!cookie) {
      return res.status(401).json({ error: '未认证，请先导入 Cookie' });
    }
    
    const adapter = PlatformFactory.getAdapter(platform);
    adapter.setCookie(cookie);
    
    const result = await adapter.createDraft({
      title,
      content,
      summary,
      tags,
    });
    
    console.log(`Draft created successfully for ${platform}:`, result);
    res.json(result);
  } catch (error) {
    console.error(`Create draft error for ${req.params.platform}:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 上传图片
 * POST /api/publish/:platform/upload
 */
router.post('/:platform/upload', async (req, res) => {
  try {
    const { platform } = req.params;
    const { postId } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: '未上传文件' });
    }
    
    // 获取 AuthManager 并加载 Cookie
    const AuthManager = require('../managers/AuthManager');
    const authManager = new AuthManager();
    await authManager.init();
    
    const cookie = authManager.getCookie(platform);
    if (!cookie) {
      return res.status(401).json({ error: '未认证，请先导入 Cookie' });
    }
    
    const adapter = PlatformFactory.getAdapter(platform);
    adapter.setCookie(cookie);
    
    const result = await adapter.uploadImage({
      bits: file.buffer,
      type: file.mimetype,
      name: file.originalname,
    });
    
    res.json(result);
  } catch (error) {
    console.error(`Upload image error for ${req.params.platform}:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 更新文章
 * PUT /api/publish/:platform/post/:postId
 */
router.put('/:platform/post/:postId', async (req, res) => {
  try {
    const { platform, postId } = req.params;
    const { title, content, summary, tags } = req.body;
    
    // 获取 AuthManager 并加载 Cookie
    const AuthManager = require('../managers/AuthManager');
    const authManager = new AuthManager();
    await authManager.init();
    
    const cookie = authManager.getCookie(platform);
    if (!cookie) {
      return res.status(401).json({ error: '未认证，请先导入 Cookie' });
    }
    
    const adapter = PlatformFactory.getAdapter(platform);
    adapter.setCookie(cookie);
    
    const result = await adapter.updatePost(postId, {
      title,
      content,
      summary,
      tags,
    });
    
    res.json(result);
  } catch (error) {
    console.error(`Update post error for ${req.params.platform}:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 发布文章
 * POST /api/publish/:platform/post/:postId/publish
 */
router.post('/:platform/post/:postId/publish', async (req, res) => {
  try {
    const { platform, postId } = req.params;
    
    // 获取 AuthManager 并加载 Cookie
    const AuthManager = require('../managers/AuthManager');
    const authManager = new AuthManager();
    await authManager.init();
    
    const cookie = authManager.getCookie(platform);
    if (!cookie) {
      return res.status(401).json({ error: '未认证，请先导入 Cookie' });
    }
    
    const adapter = PlatformFactory.getAdapter(platform);
    adapter.setCookie(cookie);
    
    const result = await adapter.publishPost(postId);
    
    res.json(result);
  } catch (error) {
    console.error(`Publish post error for ${req.params.platform}:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 删除文章
 * DELETE /api/publish/:platform/post/:postId
 */
router.delete('/:platform/post/:postId', async (req, res) => {
  try {
    const { platform, postId } = req.params;
    
    const adapter = PlatformFactory.getAdapter(platform);
    const result = await adapter.deletePost(postId);
    
    res.json(result);
  } catch (error) {
    console.error(`Delete post error for ${req.params.platform}:`, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
