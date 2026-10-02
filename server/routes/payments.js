const router = require('express').Router();
const {
  initiateEsewaPayment,
  verifyEsewaPayment,
  getUserPayments
} = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

router.post('/esewa/initiate', auth, initiateEsewaPayment);
router.post('/esewa/verify', verifyEsewaPayment);
router.get('/user/:userId', auth, getUserPayments);

module.exports = router;
