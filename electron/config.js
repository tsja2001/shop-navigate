const path = require('path');

const REMOTE_WEB_URL = 'https://hbhgjjj.com/d8N4kP7sVq2R/';
const REMOTE_WEB_PATHNAME = new URL(REMOTE_WEB_URL).pathname;
const LOCAL_FALLBACK_DIR = path.join(__dirname, '../dist');
const LOCAL_FALLBACK_HTML = path.join(__dirname, '../dist/index.html');

const ALLOWED_ORIGINS = [
  new URL(REMOTE_WEB_URL).origin,
];

module.exports = {
  REMOTE_WEB_URL,
  REMOTE_WEB_PATHNAME,
  LOCAL_FALLBACK_DIR,
  LOCAL_FALLBACK_HTML,
  ALLOWED_ORIGINS,
};
