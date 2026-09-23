const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const camelize = require('../utils/camelize');

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, role = 'participant', company, bio } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  if (!['participant', 'organizer'].includes(role))
    return res.status(400).json({ message: 'Role must be participant or organizer.' });

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(409).json({ message: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, company, bio)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role, bio, company, joined_at`,
      [name, email, hashed, role, company || null, bio || null]
    );
    const user = result.rows[0];
    const token = signToken(user);
    res.status(201).json(camelize({ token, user }));
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password.' });

    const { password: _pw, ...safeUser } = user;
    const token = signToken(safeUser);
    res.json(camelize({ token, user: safeUser }));
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// GET /api/auth/me  (requires auth middleware)
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, bio, company, interests, joined_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'User not found.' });
    res.json(camelize(result.rows[0]));
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { register, login, getMe };
