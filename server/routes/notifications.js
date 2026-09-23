const router = require('express').Router();
const { getNotifications, markRead, markAllRead, dismiss } = require('../controllers/notificationController');
const { auth } = require('../middleware/auth');

router.use(auth); // Protect all notification routes

router.get('/', getNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);
router.delete('/:id', dismiss);

module.exports = router;
