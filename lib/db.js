import fs from 'fs';
import path from 'path';

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
    adminUsername: 'admin',
    adminPassword: 'password',
    siteTitle: 'اطلب الحين',
    siteTagline: 'اختر تطبيق التوصيل المفضل لديك',
    siteLogo: null,
    backgroundVideo: null,
    backgroundImage: null,
    overlayOpacity: 0.55,
    brandColor: '#8B5E34',
    accentColor: '#D4A95A',
    textColor: '#F7EFE2',
    buttonStyle: 'solid',
    buttonRadius: 14,
    footerText: '© 2026 جميع الحقوق محفوظة'
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
    const { adminUsername, adminPassword, ...pub } = c;
    return pub;
  }
};
