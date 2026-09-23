const pool = require('../config/db');
const camelize = require('../utils/camelize');

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, title, message, type, read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(camelize(result.rows));
  } catch (err) {
    console.error('getNotifications error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PATCH /api/notifications/:id/read
const markRead = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE notifications SET read = true
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Notification not found.' });
    res.json(camelize(result.rows[0]));
  } catch (err) {
    console.error('markRead error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PATCH /api/notifications/read-all
const markAllRead = async (req, res) => {
  try {
    await pool.query(
      `UPDATE notifications SET read = true
       WHERE user_id = $1`,
      [req.user.id]
    );
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('markAllRead error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/notifications/:id
const dismiss = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM notifications
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Notification not found.' });
    res.json({ message: 'Notification dismissed.', id: req.params.id });
  } catch (err) {
    console.error('dismiss error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getNotifications, markRead, markAllRead, dismiss };
