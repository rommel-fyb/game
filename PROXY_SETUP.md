# 🌐 Proxy Setup for Geo-Locked Games

This guide explains how to use the proxy functionality to bypass geo-restrictions and CORS limitations for your game iframe app.

## 🚀 Quick Start

1. **Install proxy dependencies:**
   ```bash
   node setup-proxy.js
   ```

2. **Start development with proxy:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Angular app: http://localhost:4200
   - Proxy server: http://localhost:3001

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both Angular app and proxy server |
| `npm run start:proxy` | Start Angular with proxy configuration |
| `npm run proxy` | Start only the proxy server |
| `npm run deploy` | Build production and start proxy server |

## 🔧 Proxy Services

### 1. **No Proxy (Direct)**
- Loads games directly without any proxy
- Fastest option for non-restricted games
- Use when games work without geo-blocking

### 2. **CORS Anywhere**
- Bypasses CORS restrictions
- Good for games that block cross-origin requests
- Endpoint: `/api/proxy/*`

### 3. **AllOrigins**
- Universal CORS proxy service
- Reliable and fast
- Endpoint: `/proxy/allorigins/*`

### 4. **CORS Proxy**
- Fast CORS proxy specifically for web apps
- Good performance
- Endpoint: `/proxy/corsproxy/*`

### 5. **Custom Proxy**
- Your own proxy server running on port 3001
- Full control over headers and configuration
- Endpoint: `/proxy/custom?url=*`

## 🎮 How to Use

1. **Select a proxy service** from the "Proxy Settings" section
2. **Enter your game URL** in the input field
3. **Click "Load Game"** to load the game through the selected proxy
4. **Check the status** - you'll see if the proxy connected successfully

## 🔍 Troubleshooting

### Common Issues

**❌ Proxy connection failed**
- Try a different proxy service
- Check if the game URL is correct
- Some games may block all proxy services

**❌ Game not loading**
- The game might have additional security measures
- Try the "No Proxy" option first
- Some games require specific headers or cookies

**❌ CORS errors**
- Use one of the CORS proxy services
- The "Custom Proxy" option provides the most control

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your `.env` file:

```bash
NODE_ENV=development
```

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200,http://localhost:3000
```

### Custom Headers

The proxy server automatically adds headers to bypass geo-restrictions:

- `User-Agent`: Standard browser user agent
- `Accept-Language`: English language preference
- `X-Forwarded-For`: Client IP address
- `X-Real-IP`: Real client IP

## 🌍 Geo-Restriction Bypass

The proxy services help bypass geo-restrictions by:

1. **Hiding your real location** - Requests appear to come from the proxy server
2. **Adding appropriate headers** - Mimics requests from allowed regions
3. **Handling CORS** - Bypasses cross-origin restrictions
4. **Multiple fallbacks** - If one proxy fails, try another

## 📊 Performance

| Proxy Service | Speed | Reliability | Geo-Bypass |
|---------------|-------|-------------|------------|
| No Proxy | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ |
| CORS Anywhere | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| AllOrigins | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| CORS Proxy | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Custom Proxy | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🔒 Security Notes

- The proxy server only forwards requests, it doesn't store data
- All proxy services are configured with appropriate CORS headers
- The custom proxy server runs locally and doesn't send data to third parties
- Always verify the game URLs you're loading

## 🚀 Production Deployment

For production deployment:

1. **Build the Angular app:**
   ```bash
   npm run build:prod
   ```

2. **Start the proxy server:**
   ```bash
   npm run proxy
   ```

3. **Configure your web server** to serve the `dist/game-iframe-app` folder

## 📝 API Endpoints

The proxy server provides these endpoints:

- `GET /health` - Health check
- `GET /proxy/custom?url=<encoded_url>` - Custom proxy
- `GET /proxy/cors-anywhere/*` - CORS Anywhere proxy
- `GET /proxy/allorigins/*` - AllOrigins proxy
- `GET /proxy/corsproxy/*` - CORS Proxy

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify the proxy server is running on port 3001
3. Try different proxy services
4. Check the game URL is accessible directly
5. Review the proxy server logs for detailed error information

---

**Happy gaming! 🎮**
