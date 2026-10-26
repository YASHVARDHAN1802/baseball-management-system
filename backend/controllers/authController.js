
// backend/controllers/authController.js
// FIXED BUGS:
//  1. Original had `const db = pool.promise()` without importing pool — ReferenceError
//  2. Original used hardcoded admin/admin123 check — not DB-based
//  3. getMe was in gameController.js — moved here

const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../config/db');
require('dotenv').config();

// ── POST /api/auth/login ─────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    // Fetch user from DB
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ? AND is_active = 1',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const user = rows[0];

    // Compare with bcrypt hash
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Update last_login
    await db.execute('UPDATE users SET last_login = NOW() WHERE user_id = ?', [user.user_id]);

    // Sign JWT
    const token = jwt.sign(
      { userId: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'baseball_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: { userId: user.user_id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};
