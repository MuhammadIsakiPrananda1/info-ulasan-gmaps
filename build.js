const fs = require('fs');
const path = require('path');

// Load .env (local development only)
function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return {};
  
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valParts] = line.split('=');
      env[key.trim()] = valParts.join('=').trim();
    }
  });
  return env;
}

// Priority: Vercel env (process.env) > local .env
const localEnv = loadLocalEnv();

const getEnv = (key) => process.env[key] || localEnv[key];

// Required Firebase config keys
const requiredKeys = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID',
];

// Validate all required keys exist
const missing = requiredKeys.filter(key => !getEnv(key));
if (missing.length > 0) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  console.error('Set them in Vercel Dashboard → Settings → Environment Variables');
  process.exit(1);
}

// Read index.html
const indexPath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace placeholders
const replacements = {
  '__FIREBASE_API_KEY__': getEnv('FIREBASE_API_KEY'),
  '__FIREBASE_AUTH_DOMAIN__': getEnv('FIREBASE_AUTH_DOMAIN'),
  '__FIREBASE_PROJECT_ID__': getEnv('FIREBASE_PROJECT_ID'),
  '__FIREBASE_STORAGE_BUCKET__': getEnv('FIREBASE_STORAGE_BUCKET'),
  '__FIREBASE_MESSAGING_SENDER_ID__': getEnv('FIREBASE_MESSAGING_SENDER_ID'),
  '__FIREBASE_APP_ID__': getEnv('FIREBASE_APP_ID'),
  '__FIREBASE_MEASUREMENT_ID__': getEnv('FIREBASE_MEASUREMENT_ID'),
};

for (const [placeholder, value] of Object.entries(replacements)) {
  html = html.replace(new RegExp(placeholder, 'g'), value);
}

// Write back
fs.writeFileSync(indexPath, html);
console.log('✅ Firebase config injected into public/index.html');
console.log('   Source:', process.env.VERCEL ? 'Vercel Environment Variables' : 'Local .env file');