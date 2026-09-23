const pool = require('../config/db');
const camelize = require('../utils/camelize');

// GET /api/registrations/user/:userId
const getByUser = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.status, r.registered_at,
              e.id as event_id, e.title, e.date, e.time, e.location,
              e.category, e.image_url, e.price, e.organizer_id, e.capacity,
              COUNT(r2.id) FILTER (WHERE r2.status = 'confirmed') AS registered_count
       FROM registrations r
       JOIN events e ON e.id = r.event_id
       LEFT JOIN registrations r2 ON r2.event_id = e.id
       WHERE r.user_id = $1 AND r.status = 'confirmed'
       GROUP BY r.id, e.id
       ORDER BY e.date ASC`,
      [req.params.userId]
    );
    res.json(camelize(result.rows));
  } catch (err) {
    console.error('getByUser error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/registrations/check/:userId/:eventId
const checkRegistration = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id FROM registrations
       WHERE user_id = $1 AND event_id = $2 AND status = 'confirmed'`,
      [req.params.userId, req.params.eventId]
    );
    res.json({ registered: result.rows.length > 0 });
  } catch (err) {
    console.error('checkRegistration error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/registrations
const register = async (req, res) => {
  const { event_id } = req.body;
  const user_id = req.user.id;

  try {
    // Check capacity
    const ev = await pool.query(
      `SELECT capacity,
        (SELECT COUNT(*) FROM registrations WHERE event_id = $1 AND status = 'confirmed') AS registered_count
       FROM events WHERE id = $1`,
      [event_id]
    );
    if (!ev.rows[0]) return res.status(404).json({ message: 'Event not found.' });
    if (Number(ev.rows[0].registered_count) >= ev.rows[0].capacity)
      return res.status(400).json({ message: 'Event is full.' });

    // Upsert — re-confirm if previously cancelled
    const result = await pool.query(
      `INSERT INTO registrations (user_id, event_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, event_id)
       DO UPDATE SET status = 'confirmed', registered_at = NOW()
       RETURNING *`,
      [user_id, event_id]
    );

    // Create notification
    await pool.query(
      `INSERT INTO notifications (user_id, message, type)
       VALUES ($1, $2, 'success')`,
      [user_id, `You've registered for an event. We'll see you there!`]
    );

    res.status(201).json(camelize(result.rows[0]));
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PATCH /api/registrations/:userId/:eventId/cancel
const cancelRegistration = async (req, res) => {
  const { userId, eventId } = req.params;
  if (req.user.id !== userId && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden.' });

  try {
    const result = await pool.query(
      `UPDATE registrations SET status = 'cancelled'
       WHERE user_id = $1 AND event_id = $2 AND status = 'confirmed'
       RETURNING *`,
      [userId, eventId]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Registration not found.' });
    res.json(camelize({ message: 'Registration cancelled.', registration: result.rows[0] }));
  } catch (err) {
    console.error('cancelRegistration error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/registrations/event/:eventId/attendees  — organizer only
const getAttendees = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, r.registered_at, r.status
       FROM registrations r
       JOIN users u ON u.id = r.user_id
       WHERE r.event_id = $1
       ORDER BY r.registered_at DESC`,
      [req.params.eventId]
    );
    res.json(camelize(result.rows));
  } catch (err) {
    console.error('getAttendees error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getByUser, checkRegistration, register, cancelRegistration, getAttendees };
