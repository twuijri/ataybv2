# Link Page Manager

A self-hosted, bilingual link-in-bio page with a built-in administration dashboard. Link Page Manager is designed for individuals, restaurants, stores, and small organizations that want a polished landing page without depending on a hosted link-page service.

## Features

- Arabic RTL and English interfaces
- Custom site title, description, logo, favicon, colors, and footer
- Dynamic browser, Open Graph, WhatsApp, and Twitter metadata
- Background images and looping background videos
- Link groups and nested pages
- Smart App Store and Google Play links
- Social media links with reorder support
- Page-view and link-click statistics
- Persistent uploads and configuration through Docker volumes
- First-run password setup with no default password
- Backward-compatible migration from `ghcr.io/twuijri/ataybv2`
- Automated `linux/amd64` image builds through GitHub Actions

## Quick start with Docker Compose

Download `compose.server.yml`, then run:

```bash
docker compose -f compose.server.yml up -d
```

Open:

- Public page: <http://localhost:3000>
- Admin dashboard: <http://localhost:3000/admin/login>

On a fresh installation, the admin page asks you to create a password. The username is always `admin`; there is no default password.

## Run the published image directly

```bash
docker run -d \
  --name link-page-manager \
  -p 3000:3000 \
  -v link-page-manager-data:/app/data \
  -v link-page-manager-uploads:/app/public/uploads \
  --restart unless-stopped \
  ghcr.io/twuijri/link-page-manager:latest
```

The image is published with these tags:

- `latest`: latest build from the default branch
- `main`: latest build from `main`
- `sha-<commit>`: immutable tag for a specific commit

## Updating

With Docker Compose:

```bash
docker compose -f compose.server.yml pull
docker compose -f compose.server.yml up -d
```

Your settings, credentials, statistics, and uploaded files remain in the named volumes.

## Migrating from ataybv2

Existing `ghcr.io/twuijri/ataybv2` installations can switch to the new image without losing data. Change only the image name and keep the existing volume mappings:

```yaml
services:
  app:
    image: ghcr.io/twuijri/link-page-manager:latest
    volumes:
      - ataybv2-data:/app/data
      - ataybv2-uploads:/app/public/uploads

volumes:
  ataybv2-data:
  ataybv2-uploads:
```

Do not delete or rename the old volumes during migration. After upgrading:

- Sign in with the username `admin`.
- Use the same password you used in ataybv2.
- The application preserves that password and upgrades its storage to a secure hash after the first successful login.

Fresh installations use the first-run password creation screen instead.

## Local development

Requirements: Node.js 20 and npm.

```bash
npm ci
npm run dev
```

The development server runs at <http://localhost:3000>.

Useful checks:

```bash
npm run lint
npm run build
```

You can also build and run locally with Docker:

```bash
docker compose up -d --build
```

## Persistent data

The container stores persistent files in two locations:

| Container path | Contents |
| --- | --- |
| `/app/data` | Configuration, password hash, links, and statistics |
| `/app/public/uploads` | Logos, icons, images, and videos uploaded in the dashboard |

Back up both volumes before making infrastructure changes.

## Reverse proxy

Expose port `3000` through your preferred reverse proxy and forward the original `Host` and `X-Forwarded-Proto` headers. These headers allow the application to generate absolute Open Graph image URLs for link previews.

## Security notes

- Fresh installations have no default password.
- Passwords are stored with Node.js `scrypt` and a unique random salt.
- Legacy plaintext passwords are converted to a hash after the first successful login.
- Authentication cookies are HTTP-only, signed from a per-installation secret, and marked secure in production.
- Keep the `/app/data` volume private because it contains application configuration and authentication material.

## License

Released under the [MIT License](LICENSE).
