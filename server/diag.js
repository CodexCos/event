const pool = require('./config/db');
const camelize = require('./utils/camelize');

const run = async () => {
  try {
    const userId = 'edbce2f4-6c51-4f2e-b76c-146039e1446c'; // Ram's ID
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
      [userId]
    );

    console.log('=== CAMELIZED REGISTRATIONS ===');
    console.log(camelize(result.rows));

    process.exit(0);
  } catch (err) {
    console.error('Diag error:', err.message);
    process.exit(1);
  }
};

run();
