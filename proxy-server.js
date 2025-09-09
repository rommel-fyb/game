const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000'],
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Proxy configuration for different services
const proxyOptions = {
  target: '',
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    // Add headers to bypass geo-restrictions
    proxyReq.setHeader('X-Forwarded-For', req.ip);
    proxyReq.setHeader('X-Real-IP', req.ip);
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
    proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.5');
    proxyReq.setHeader('Accept-Encoding', 'gzip, deflate');
    proxyReq.setHeader('Connection', 'keep-alive');
    proxyReq.setHeader('Upgrade-Insecure-Requests', '1');
  },
  onProxyRes: (proxyRes, req, res) => {
    // Remove CORS headers that might interfere
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
    
    // Add CORS headers
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
  }
};

// Multiple proxy endpoints for different services
app.use('/proxy/cors-anywhere', createProxyMiddleware({
  ...proxyOptions,
  target: 'https://cors-anywhere.herokuapp.com/',
  pathRewrite: {
    '^/proxy/cors-anywhere': ''
  }
}));

app.use('/proxy/allorigins', createProxyMiddleware({
  ...proxyOptions,
  target: 'https://api.allorigins.win/',
  pathRewrite: {
    '^/proxy/allorigins': ''
  }
}));

app.use('/proxy/corsproxy', createProxyMiddleware({
  ...proxyOptions,
  target: 'https://corsproxy.io/',
  pathRewrite: {
    '^/proxy/corsproxy': ''
  }
}));

// Custom proxy endpoint that handles URL encoding
app.get('/proxy/custom', async (req, res) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    const data = await response.text();
    
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'Content-Type': response.headers.get('content-type') || 'text/html'
    });
    
    res.send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch the requested URL' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist/game-iframe-app')));

// Catch all handler for Angular routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/game-iframe-app/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`📡 Available proxy endpoints:`);
  console.log(`   - /proxy/cors-anywhere/*`);
  console.log(`   - /proxy/allorigins/*`);
  console.log(`   - /proxy/corsproxy/*`);
  console.log(`   - /proxy/custom?url=<encoded_url>`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
