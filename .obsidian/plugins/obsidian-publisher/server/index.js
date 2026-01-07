const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const config = require('./config');
const authRoutes = require('./routes/auth');
const publishRoutes = require('./routes/publish');
const platformRoutes = require('./routes/platforms');

const app = express();
const PORT = config.get('port');

// 中间件 - CORS 配置
app.use(
  cors({
    origin: '*', // 允许所有来源，包括 app://obsidian.md
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 文件上传配置
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

app.use('/upload', upload.single('image'));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/publish', publishRoutes);
app.use('/api/platforms', platformRoutes);

// 配置管理 API
app.post('/api/config/proxy', (req, res) => {
  try {
    const { enabled, proxyUrl } = req.body;
    config.updateProxy(enabled || false, proxyUrl || '');
    
    res.json({
      success: true,
      config: config.get('proxy'),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get('/api/config/proxy', (req, res) => {
  res.json(config.get('proxy'));
});

app.get('/api/config', (req, res) => {
  res.json(config.get());
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 服务器状态
app.get('/api/status', (req, res) => {
  res.json({
    version: '1.0.0',
    platforms: [
      'weixin',
      'zhihu',
      'csdn',
      'juejin',
      'toutiao',
      'jianshu',
      'cnblog',
      'segmentfault',
    ],
    uptime: process.uptime(),
  });
});

// 清理缓存
app.post('/api/cache/clear', (req, res) => {
  // TODO: 实现缓存清理
  res.json({ success: true, message: '缓存已清理' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || '服务器内部错误',
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: '接口不存在',
  });
});

// 启动服务器
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Obsidian Publisher Server running on:`);
  console.log(`   - Local:   http://localhost:${PORT}`);
  console.log(`   - Network: http://192.168.110.8:${PORT}`);
  console.log(`📝 Health check: http://192.168.110.8:${PORT}/api/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
