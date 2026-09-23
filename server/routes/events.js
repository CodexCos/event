const router = require('express').Router();
const {
  getEvents, getEventById, getEventsByOrganizer,
  createEvent, updateEvent, deleteEvent
} = require('../controllers/eventController');
const { auth, requireRole } = require('../middleware/auth');

// Optional token parsing middleware
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const jwt = require('jsonwebtoken');
      req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    } catch {}
  }
  next();
};

// Public/Optional endpoints
router.get('/', optionalAuth, getEvents);
router.get('/organizer/:userId', optionalAuth, getEventsByOrganizer);
router.get('/:id', getEventById);

// Protected endpoints
router.post('/', auth, requireRole('organizer'), createEvent);
router.put('/:id', auth, requireRole('organizer'), updateEvent);
router.delete('/:id', auth, requireRole('organizer', 'admin'), deleteEvent);

module.exports = router;
