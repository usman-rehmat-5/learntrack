#!/bin/bash
# =============================================
# LearnTrack - VPS Deployment Script (Ubuntu)
# =============================================
# Run this on your VPS (DigitalOcean/Linode)

set -e

echo "=== Updating system ==="
sudo apt update && sudo apt upgrade -y

echo "=== Installing Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
node -v && npm -v

echo "=== Installing PM2 ==="
sudo npm install -g pm2

echo "=== Installing MongoDB ==="
# For production, use MongoDB Atlas (free tier available at mongodb.com)
# If you want self-hosted MongoDB:
# wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
# echo "deb http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
# sudo apt update && sudo apt install -y mongodb-org
# sudo systemctl start mongod && sudo systemctl enable mongod
echo "TIP: Use MongoDB Atlas instead of self-hosting"

echo "=== Cloning project ==="
git clone <your-repo-url> /var/www/learntrack
cd /var/www/learntrack

echo "=== Installing dependencies ==="
cd server && npm install
cd ../client && npm install

echo "=== Building frontend ==="
npm run build

echo "=== Setting up environment ==="
cd ../server
cp .env.production.example .env
# EDIT .env with your production values:
# nano .env
echo "IMPORTANT: Edit server/.env with your production values!"

echo "=== Starting with PM2 ==="
cd ..
pm2 start ecosystem.config.js
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

echo "=== Configuring Nginx ==="
sudo tee /etc/nginx/sites-available/learntrack > /dev/null <<'NGINX'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/learntrack /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

echo "=== Setting up SSL with Let's Encrypt ==="
# sudo apt install -y certbot python3-certbot-nginx
# sudo certbot --nginx -d your-domain.com

echo ""
echo "=== Deployment Complete! ==="
echo "Your app should be running at http://your-domain.com"
echo "Run: pm2 logs learntrack - to see logs"
echo "Run: pm2 monit - to monitor"
