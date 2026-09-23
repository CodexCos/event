const router = require('express').Router();
const {
  getByUser, checkRegistration, register, cancelRegistration, getAttendees
} = require('../controllers/registrationController');
const { auth } = require('../middleware/auth');

router.get('/user/:userId', auth, getByUser);
router.get('/check/:userId/:eventId', auth, checkRegistration);
router.get('/event/:eventId/attendees', auth, getAttendees);
router.post('/', auth, register);
router.patch('/:userId/:eventId/cancel', auth, cancelRegistration);

module.exports = router;
