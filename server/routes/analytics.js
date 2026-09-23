const router = require('express').Router();
const { getOrganizerStats, getAdminStats } = require('../controllers/analyticsController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/organizer/:userId', auth, requireRole('organizer', 'admin'), getOrganizerStats);
router.get('/admin', auth, requireRole('admin'), getAdminStats);

module.exports = router;
