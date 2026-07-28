require('dotenv').config();

const required = [
  'JWT_SECRET',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
];

function getEnv(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (!value && required.includes(name)) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

module.exports = {
  port: Number(getEnv('PORT', 5000)),
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '7d'),
  supabaseUrl: getEnv('SUPABASE_URL'),
  supabaseServiceKey: getEnv('SUPABASE_SERVICE_KEY'),
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
  adminEmail: getEnv('ADMIN_EMAIL', ''),
  adminPassword: getEnv('ADMIN_PASSWORD', ''),
};
