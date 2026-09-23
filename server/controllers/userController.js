const pool = require('../config/db');
const camelize = require('../utils/camelize');

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, bio, company, interests, joined_at, status
       FROM users WHERE id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'User not found.' });
    res.json(camelize(result.rows[0]));
  } catch (err) {
    console.error('getUserById error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/users  — admin only
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, bio, company, joined_at, status FROM users ORDER BY joined_at DESC`
    );
    res.json(camelize(result.rows));
  } catch (err) {
    console.error('getAllUsers error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PATCH /api/users/:id/status — admin only
const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }
  try {
    const result = await pool.query(
      `UPDATE users SET status = $1 WHERE id = $2 RETURNING id, name, email, role, status`,
      [status, id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'User not found.' });
    res.json(camelize(result.rows[0]));
  } catch (err) {
    console.error('updateUserStatus error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/users/:id  — admin only
const deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted.' });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getUserById, getAllUsers, updateUserStatus, deleteUser };
