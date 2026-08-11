import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const LINKS_FILE = path.join(DATA_DIR, 'links.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const SOCIAL_FILE = path.join(DATA_DIR, 'social.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

if (!fs.existsSync(LINKS_FILE)) {
  fs.writeFileSync(LINKS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(STATS_FILE)) {
  fs.writeFileSync(STATS_FILE, JSON.stringify({ page_views: 0, link_clicks: 0, history: [] }, null, 2));
}

if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({
    configVersion: 2,
    setupCompleted: false,
    adminUsername: 'admin',
    adminPassword: null,
    authSecret: randomBytes(32).toString('hex'),
    siteTitle: 'روابطي',
    siteTitle_en: 'My Links',
    siteTagline: 'اختر تطبيق التوصيل المفضل لديك',
    siteTagline_en: 'Choose your preferred way to connect',
    siteLogo: null,
    backgroundVideo: null,
    backgroundImage: null,
    overlayOpacity: 0.55,
    brandColor: '#8B5E34',
    accentColor: '#D4A95A',
    textColor: '#F7EFE2',
    buttonStyle: 'solid',
    buttonRadius: 14,
    glassOpacity: 0.1,
    glassBlur: 18,
    glassBorderOpacity: 0.22,
    footerText: '© 2026 جميع الحقوق محفوظة',
    footerText_en: '© 2026 All rights reserved'
  }, null, 2));
}

if (!fs.existsSync(SOCIAL_FILE)) {
  fs.writeFileSync(SOCIAL_FILE, JSON.stringify([], null, 2));
}

const readJSON = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
};

const writeJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

const migrateConfig = () => {
  const current = readJSON(CONFIG_FILE, {});
  const migrated = { ...current };
  let changed = false;

  // Config files created by ataybv2 did not include a version flag. Treat
  // them as completed installations, keep the password, and normalize the
  // login name so existing users can sign in as admin after upgrading.
  if (current.setupCompleted === undefined) {
    migrated.setupCompleted = Boolean(current.adminPassword);
    migrated.adminUsername = 'admin';
    changed = true;
  }

  if (!current.authSecret) {
    migrated.authSecret = randomBytes(32).toString('hex');
    changed = true;
  }

  if (current.configVersion !== 2) {
    migrated.configVersion = 2;
    changed = true;
  }

  if (changed) writeJSON(CONFIG_FILE, migrated);
};

migrateConfig();

export const db = {
  getLinks: () => readJSON(LINKS_FILE, []),
  saveLinks: (links) => writeJSON(LINKS_FILE, links),

  getStats: () => readJSON(STATS_FILE, { page_views: 0, link_clicks: 0, history: [] }),
  saveStats: (stats) => writeJSON(STATS_FILE, stats),

  getConfig: () => readJSON(CONFIG_FILE, {}),
  saveConfig: (config) => {
    const current = readJSON(CONFIG_FILE, {});
    writeJSON(CONFIG_FILE, { ...current, ...config });
  },

  getSocial: () => readJSON(SOCIAL_FILE, []),
  saveSocial: (social) => writeJSON(SOCIAL_FILE, social),

  getPublicConfig: () => {
    const c = readJSON(CONFIG_FILE, {});
    const pub = { ...c };
    delete pub.adminUsername;
    delete pub.adminPassword;
    delete pub.authSecret;
    delete pub.setupCompleted;
    delete pub.configVersion;
    return pub;
  }
};
