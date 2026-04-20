# ataybv2 — Link Manager

صفحة هبوط عربية (RTL) مع فيديو خلفية ومربع زجاجي، ولوحة تحكم احترافية.

## التشغيل محلياً بدوكر

```bash
docker compose up -d --build
```

- الموقع: http://localhost:3000
- لوحة التحكم: http://localhost:3000/admin/login (admin / password)

## التشغيل على السيرفر من صورة GHCR

بعد أول push على `main`، يبني GitHub Actions صورة ويرفعها على:

```
ghcr.io/twuijri/ataybv2:latest
```

على السيرفر:

```bash
docker pull ghcr.io/twuijri/ataybv2:latest
docker run -d --name ataybv2 \
  -p 3000:3000 \
  -v ataybv2-data:/app/data \
  -v ataybv2-uploads:/app/public/uploads \
  --restart unless-stopped \
  ghcr.io/twuijri/ataybv2:latest
```

أو عبر compose:

```yaml
services:
  app:
    image: ghcr.io/twuijri/ataybv2:latest
    ports: ["3000:3000"]
    volumes:
      - ataybv2-data:/app/data
      - ataybv2-uploads:/app/public/uploads
    restart: unless-stopped
volumes:
  ataybv2-data:
  ataybv2-uploads:
```

> ملاحظة: لو الصورة خاصة تحتاج `docker login ghcr.io` بـ Personal Access Token فيه صلاحية `read:packages`.

## الميزات

- RTL عربي مع خط Tajawal
- فيديو خلفية لوب + صورة خلفية بديلة
- مربع زجاجي (glassmorphism) يحوي الأزرار والسوشيال
- لوحة تحكم: نظرة عامة، روابط مع سحب للترتيب، سوشيال ميديا، مظهر، إعدادات، حساب
- رفع شعار وفيديو وأيقونات من اللوحة
- إحصائيات مشاهدات ونقرات (آخر 7 أيام)
