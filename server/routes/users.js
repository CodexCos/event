const router = require('express').Router();
const { getUserById, getAllUsers, updateUserStatus, deleteUser } = require('../controllers/userController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', auth, requireRole('admin'), getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id/status', auth, requireRole('admin'), updateUserStatus);
router.delete('/:id', auth, requireRole('admin'), deleteUser);

module.exports = router;
