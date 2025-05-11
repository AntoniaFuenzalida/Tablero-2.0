const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/usuariosController');
const { registerUser } = require('../controllers/usuariosController');
const { loginUser } = require('../controllers/usuariosController');
const { updateUser } = require('../controllers/usuariosController');
const verifyToken = require('../controllers/authMiddleware');

router.put('/update', verifyToken, updateUser);
router.get('/users', getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update', verifyToken, updateUser);

module.exports = router;