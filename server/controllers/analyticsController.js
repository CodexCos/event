const pool = require('../config/db');
const camelize = require('../utils/camelize');

// GET /api/analytics/organizer/:userId
const getOrganizerStats = async (req, res) => {
  const { userId } = req.params;
  try {
    const events = await pool.query(
      `SELECT e.id, e.title, e.date, e.capacity, e.status,
              COUNT(r.id) FILTER (WHERE r.status = 'confirmed') AS registered_count
       FROM events e
       LEFT JOIN registrations r ON r.event_id = e.id
       WHERE e.organizer_id = $1
       GROUP BY e.id ORDER BY e.date DESC`,
      [userId]
    );

    const totalEvents = events.rows.length;
    const totalRegistrations = events.rows.reduce((s, e) => s + Number(e.registered_count), 0);
    const publishedEvents = events.rows.filter(e => e.status === 'published').length;
    const upcomingEvents = events.rows.filter(e => new Date(e.date) >= new Date()).length;

    res.json(camelize({
      totalEvents,
      totalRegistrations,
      publishedEvents,
      upcomingEvents,
      events: events.rows,
    }));
  } catch (err) {
    console.error('getOrganizerStats error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/analytics/admin
const getAdminStats = async (req, res) => {
  try {
    const [usersRes, eventsRes, regsRes] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query("SELECT COUNT(*) FROM events WHERE status = 'published'"),
      pool.query("SELECT COUNT(*) FROM registrations WHERE status = 'confirmed'"),
    ]);

    const byRole = await pool.query(
      `SELECT role, COUNT(*) FROM users GROUP BY role`
    );
    const byCategory = await pool.query(
      `SELECT category, COUNT(*) FROM events WHERE status = 'published' GROUP BY category`
    );

    res.json(camelize({
      totalUsers: Number(usersRes.rows[0].count),
      totalEvents: Number(eventsRes.rows[0].count),
      totalRegistrations: Number(regsRes.rows[0].count),
      usersByRole: byRole.rows,
      eventsByCategory: byCategory.rows,
    }));
  } catch (err) {
    console.error('getAdminStats error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getOrganizerStats, getAdminStats };
