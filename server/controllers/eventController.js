const pool = require('../config/db');
const camelize = require('../utils/camelize');

// GET /api/events  — public, with optional ?search=, ?category=, ?sort=
const getEvents = async (req, res) => {
  const { search, category, sort } = req.query;
  const isAdmin = req.user?.role === 'admin';
  let query = `
    SELECT e.id, e.title, e.description, e.date, e.time, e.end_time,
           e.location, e.category, e.image_url, e.price, e.capacity,
           e.organizer_id, e.status, e.trending, e.featured, e.tags, e.created_at,
           COUNT(r.id) FILTER (WHERE r.status = 'confirmed') AS registered_count
    FROM events e
    LEFT JOIN registrations r ON r.event_id = e.id
    WHERE 1=1 ${isAdmin ? '' : "AND e.status = 'published'"}
  `;
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (e.title ILIKE $${params.length} OR e.location ILIKE $${params.length})`;
  }
  if (category && category !== 'All') {
    params.push(category);
    query += ` AND e.category = $${params.length}`;
  }

  query += ' GROUP BY e.id';

  const orderMap = {
    date: 'e.date ASC',
    price: 'e.price ASC',
    popular: 'registered_count DESC',
    newest: 'e.created_at DESC',
  };
  query += ` ORDER BY ${orderMap[sort] || 'e.date ASC'}`;

  try {
    const result = await pool.query(query, params);
    res.json(camelize(result.rows));
  } catch (err) {
    console.error('getEvents error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*,
        COUNT(r.id) FILTER (WHERE r.status = 'confirmed') AS registered_count
       FROM events e
       LEFT JOIN registrations r ON r.event_id = e.id
       WHERE e.id = $1
       GROUP BY e.id`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Event not found.' });
    res.json(camelize(result.rows[0]));
  } catch (err) {
    console.error('getEventById error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/events/organizer/:userId  — includes drafts if requester is the organizer
const getEventsByOrganizer = async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user?.id;
  const showDrafts = requesterId === userId;

  try {
    const result = await pool.query(
      `SELECT e.*,
        COUNT(r.id) FILTER (WHERE r.status = 'confirmed') AS registered_count
       FROM events e
       LEFT JOIN registrations r ON r.event_id = e.id
       WHERE e.organizer_id = $1 ${showDrafts ? '' : "AND e.status = 'published'"}
       GROUP BY e.id
       ORDER BY e.date ASC`,
      [userId]
    );
    res.json(camelize(result.rows));
  } catch (err) {
    console.error('getEventsByOrganizer error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/events  — organizer only
const createEvent = async (req, res) => {
  const {
    title, description, date, time, end_time, endTime, location,
    category, image_url, imageUrl, price = 0, capacity = 100,
    status = 'published', trending = false, featured = false, tags = []
  } = req.body;
  const finalImageUrl = imageUrl || image_url || null;

  if (!title || !date || !location)
    return res.status(400).json({ message: 'Title, date, and location are required.' });

  try {
    const result = await pool.query(
      `INSERT INTO events
        (title, description, date, time, end_time, location, category,
         image_url, price, capacity, organizer_id, status, trending, featured, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [title, description, date, time || null, end_time || endTime || null, location, category,
       finalImageUrl, price, capacity, req.user.id, status, trending, featured, tags]
    );
    res.status(201).json(camelize(result.rows[0]));
  } catch (err) {
    console.error('createEvent error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/events/:id  — organizer owner only
const updateEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT organizer_id FROM events WHERE id = $1', [id]);
    if (!check.rows[0]) return res.status(404).json({ message: 'Event not found.' });
    if (check.rows[0].organizer_id !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to edit this event.' });

    const {
      title, description, date, time, end_time, endTime, location,
      category, image_url, imageUrl, price, capacity, status, trending, featured, tags
    } = req.body;
    const finalImageUrl = imageUrl || image_url || null;

    const result = await pool.query(
      `UPDATE events SET
        title=$1, description=$2, date=$3, time=$4, end_time=$5,
        location=$6, category=$7, image_url=$8, price=$9, capacity=$10,
        status=$11, trending=$12, featured=$13, tags=$14
       WHERE id=$15 RETURNING *`,
      [title, description, date, time || null, end_time || endTime || null, location, category,
       finalImageUrl, price, capacity, status, trending, featured, tags, id]
    );
    res.json(camelize(result.rows[0]));
  } catch (err) {
    console.error('updateEvent error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/events/:id  — organizer owner or admin
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT organizer_id FROM events WHERE id = $1', [id]);
    if (!check.rows[0]) return res.status(404).json({ message: 'Event not found.' });
    if (check.rows[0].organizer_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to delete this event.' });

    await pool.query('DELETE FROM events WHERE id = $1', [id]);
    res.json({ message: 'Event deleted.' });
  } catch (err) {
    console.error('deleteEvent error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getEvents, getEventById, getEventsByOrganizer, createEvent, updateEvent, deleteEvent };
