const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/usuariosController');
const { registerUser } = require('../controllers/usuariosController');
const { loginUser } = require('../controllers/usuariosController');

router.get('/users', getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;