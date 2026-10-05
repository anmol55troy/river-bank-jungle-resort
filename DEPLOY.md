# Deploying to a Linux VPS

Target: Ubuntu 22.04+ VPS · Node 20+ · MongoDB · PM2 · Nginx · HTTPS via Let's Encrypt.

## 1. Server prerequisites

```bash
# Node 20 (via NodeSource) + pnpm + PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo corepack enable pnpm
sudo npm i -g pm2

# MongoDB 7 (or use MongoDB Atlas and skip this)
# Follow https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
```

## 2. App setup

```bash
sudo mkdir -p /var/www/riverbank && sudo chown $USER /var/www/riverbank
cd /var/www/riverbank
git clone <your-repo-url> .          # or rsync the project folder
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URI=mongodb://127.0.0.1:27017/riverbank
ADMIN_SESSION_SECRET=<long random string — e.g. `openssl rand -hex 32`>
NEXT_PUBLIC_SERVER_URL=https://riverbankjungleresort.com.np
# optional SMTP for enquiry notification emails
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
CONTACT_NOTIFY_EMAIL=info@riverbankjungleresort.com.np
```

```bash
pnpm install
pnpm seed          # first deploy only — creates admin user + demo content
pnpm build
```

> `pnpm build` statically generates pages from the database, so seed (or real content) must exist
> before building. After editing content in the admin panel, pages refresh automatically within
> 1 hour (ISR) — or run `pm2 restart riverbank` to refresh immediately.

## 3. PM2

```bash
pm2 start "pnpm start" --name riverbank --cwd /var/www/riverbank
pm2 save
pm2 startup        # follow the printed instructions once
```

## 4. Nginx reverse proxy

`/etc/nginx/sites-available/riverbank`:

```nginx
server {
    listen 80;
    server_name riverbankjungleresort.com.np www.riverbankjungleresort.com.np;

    client_max_body_size 25m;   # media uploads through /admin

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/riverbank /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# HTTPS
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d riverbankjungleresort.com.np -d www.riverbankjungleresort.com.np
```

## 5. Go-live checklist

- [ ] Change the seeded admin password (`/admin` → Users)
- [ ] Replace placeholder images with resort photography (Media collection)
- [ ] Fill real Booking.com / TripAdvisor / MakeMyTrip listing URLs in Site Settings → Links
- [ ] Point DNS at the VPS; confirm 301s from old URLs (e.g. `/rooms-suites` → `/rooms`)
- [ ] Submit `https://riverbankjungleresort.com.np/sitemap.xml` in Google Search Console
- [ ] Replace placeholder Privacy Policy / Terms with counsel-reviewed text
- [ ] Back up MongoDB on a schedule (`mongodump`) and the `media/` upload directory

## Updating the site

```bash
cd /var/www/riverbank
git pull
pnpm install
pnpm build
pm2 restart riverbank
```
