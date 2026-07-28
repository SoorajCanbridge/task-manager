const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/db');
const env = require('../config/env');

function formatUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
}

function signToken(userId) {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}


async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, password, role, created_at')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function findUserById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, created_at')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function createUser({ email, password, role = 'user' }) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: email.toLowerCase(),
      password,
      role,
    })
    .select('id, email, role, created_at')
    .single();

  if (error) throw error;
  return data;
}

async function upsertAdmin({ email, password }) {
  const existing = await findUserByEmail(email);

  if (existing) {
    const { data, error } = await supabase
      .from('users')
      .update({ password, role: 'admin' })
      .eq('id', existing.id)
      .select('id, email, role, created_at')
      .single();

    if (error) throw error;
    return { user: data, created: false };
  }

  const user = await createUser({ email, password, role: 'admin' });
  return { user, created: true };
}

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({ email, password: hashed });
    const token = signToken(user.id)
    res.status(201).json({ token, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = signToken(user.id);
    res.json({ token, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  findUserById,
  upsertAdmin,
};
