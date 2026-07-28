require('dotenv').config();

const bcrypt = require('bcryptjs');
const env = require('../config/env');
const { upsertAdmin } = require('../controllers/authController');
const supabase = require('../config/db');

function printSchemaHelp() {
  console.error('\nThe "users" table does not exist in Supabase yet.\n');
  console.error('Setup steps:');
  console.error('  1. Go to https://supabase.com/dashboard → your project');
  console.error('  2. Open SQL Editor → New query');
  console.error('  3. Copy all of backend/sql/schema.sql and click Run');
  console.error('  4. Wait for success, then run: npm run seed\n');
}

function printRlsHelp() {
  console.error('\nRow-level security (RLS) is blocking database writes.\n');
  console.error('Fix (run in Supabase SQL Editor):');
  console.error('  Copy and run: backend/sql/fix-rls.sql');
  console.error('\nAlso verify backend/.env uses the service_role key (not anon):');
  console.error('  Supabase → Project Settings → API → service_role → Reveal\n');
}

async function ensureTablesExist() {
  const { error } = await supabase.from('users').select('id').limit(1);

  if (error && (error.message.includes('schema cache') || error.code === 'PGRST205')) {
    printSchemaHelp();
    process.exit(1);
  }

  if (error) {
    throw error;
  }
}

async function seedAdmin() {
  if (!env.adminEmail || !env.adminPassword) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  if (env.adminPassword.length < 6) {
    console.error('ADMIN_PASSWORD must be at least 6 characters');
    process.exit(1);
  }

  try {
    await ensureTablesExist();

    const hashed = await bcrypt.hash(env.adminPassword, 10);
    const { user, created } = await upsertAdmin({
      email: env.adminEmail,
      password: hashed,
    });

    if (created) {
      console.log(`Admin user created: ${user.email}`);
    } else {
      console.log(`Admin user updated: ${user.email}`);
    }

    process.exit(0);
  } catch (err) {
    if (err.message?.includes('schema cache') || err.code === 'PGRST205') {
      printSchemaHelp();
    } else if (
      err.message?.includes('row-level security') ||
      err.code === '42501'
    ) {
      printRlsHelp();
    } else {
      console.error('Failed to seed admin:', err.message);
    }
    process.exit(1);
  }
}

seedAdmin();
