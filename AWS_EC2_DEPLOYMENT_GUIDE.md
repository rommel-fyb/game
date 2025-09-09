# AWS EC2 Deployment Guide for Game Iframe App

This guide will help you deploy your Angular game iframe application to an AWS EC2 instance running Amazon Linux 2023 with Nginx and SSL already configured.

## Prerequisites

- AWS EC2 instance running Amazon Linux 2023
- Nginx installed and configured with SSL
- Domain name pointing to your EC2 instance
- SSH access to your EC2 instance
- Node.js and npm installed (we'll install these)

## Step 1: Connect to Your EC2 Instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip-address
```

## Step 2: Install Node.js and npm

Amazon Linux 2023 uses `dnf` as the package manager. Install Node.js 18.x (LTS) which is compatible with Angular 17:

```bash
# Update system packages
sudo dnf update -y

# Install Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Verify installation
node --version
npm --version
```

## Step 3: Install Angular CLI Globally

```bash
sudo npm install -g @angular/cli@17
```

## Step 4: Upload Your Application

### Option A: Using Git (Recommended)

If your code is in a Git repository:

```bash
# Install Git if not already installed
sudo dnf install -y git

# Clone your repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Install dependencies
npm install
```

### Option B: Using SCP

If you need to upload files directly:

```bash
# From your local machine
scp -i your-key.pem -r ./game ec2-user@your-ec2-ip-address:/home/ec2-user/
```

Then on the EC2 instance:

```bash
cd /home/ec2-user/game
npm install
```

## Step 5: Build the Application for Production

```bash
# Build the application for production
ng build --configuration production

# Verify the build output
ls -la dist/game-iframe-app/
```

The built files will be in the `dist/game-iframe-app/` directory.

## Step 6: Configure Nginx

Create a new Nginx configuration file for your application:

```bash
sudo nano /etc/nginx/conf.d/game-app.conf
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL configuration (assuming you already have SSL configured)
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Root directory for your Angular app
    root /home/ec2-user/game/dist/game-iframe-app;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # Handle Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    # Optional: Add rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
}
```

**Important:** Replace the following placeholders:
- `your-domain.com` with your actual domain name
- `/path/to/your/certificate.crt` with your SSL certificate path
- `/path/to/your/private.key` with your SSL private key path

## Step 7: Test Nginx Configuration

```bash
# Test the Nginx configuration
sudo nginx -t

# If the test passes, reload Nginx
sudo systemctl reload nginx
```

## Step 8: Set Up Automatic Deployment (Optional)

Create a deployment script for easy updates:

```bash
nano /home/ec2-user/deploy.sh
```

Add the following content:

```bash
#!/bin/bash

# Deployment script for Game Iframe App
echo "Starting deployment..."

# Navigate to the application directory
cd /home/ec2-user/game

# Pull latest changes (if using Git)
# git pull origin main

# Install/update dependencies
npm install

# Build the application
ng build --configuration production

# Copy files to web root (if needed)
# sudo cp -r dist/game-iframe-app/* /var/www/html/

# Reload Nginx
sudo systemctl reload nginx

echo "Deployment completed successfully!"
```

Make the script executable:

```bash
chmod +x /home/ec2-user/deploy.sh
```

## Step 9: Set Up Process Management (Optional)

For better process management, you can use PM2 to run your application:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create a PM2 ecosystem file
nano /home/ec2-user/ecosystem.config.js
```

Add the following content:

```javascript
module.exports = {
  apps: [{
    name: 'game-iframe-app',
    script: 'ng',
    args: 'serve --host 0.0.0.0 --port 4200',
    cwd: '/home/ec2-user/game',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

## Step 10: Configure Firewall (if needed)

Ensure your EC2 security group allows:
- Port 80 (HTTP)
- Port 443 (HTTPS)
- Port 22 (SSH)

If you're using the application on a different port, open that port as well.

## Step 11: Test Your Application

1. Open your browser and navigate to `https://your-domain.com`
2. You should see your Game Iframe Player application
3. Test loading a game URL to ensure everything works correctly

## Troubleshooting

### Common Issues:

1. **Permission Denied Errors:**
   ```bash
   sudo chown -R ec2-user:ec2-user /home/ec2-user/game
   ```

2. **Nginx 502 Bad Gateway:**
   - Check if Nginx is running: `sudo systemctl status nginx`
   - Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

3. **SSL Certificate Issues:**
   - Verify certificate paths in your Nginx configuration
   - Check certificate validity: `openssl x509 -in /path/to/certificate.crt -text -noout`

4. **Build Errors:**
   - Ensure all dependencies are installed: `npm install`
   - Check Node.js version compatibility: `node --version`

### Useful Commands:

```bash
# Check Nginx status
sudo systemctl status nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check if your application is accessible
curl -I https://your-domain.com
```

## Security Considerations

1. **Keep your system updated:**
   ```bash
   sudo dnf update -y
   ```

2. **Configure firewall rules properly:**
   ```bash
   sudo firewall-cmd --list-all
   ```

3. **Regular backups:**
   - Backup your application files
   - Backup your Nginx configuration
   - Backup your SSL certificates

4. **Monitor logs:**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

## Performance Optimization

1. **Enable Nginx caching:**
   - The configuration already includes static asset caching
   - Consider adding Redis for dynamic content caching if needed

2. **Monitor resource usage:**
   ```bash
   htop
   df -h
   free -h
   ```

3. **Set up log rotation:**
   ```bash
   sudo nano /etc/logrotate.d/nginx
   ```

## Conclusion

Your Angular Game Iframe App should now be successfully deployed on AWS EC2 with Nginx and SSL. The application will be accessible via HTTPS at your domain name, and users can load and play web-based games through the iframe interface.

For future updates, simply run your deployment script or manually pull changes, rebuild, and reload Nginx.
