const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/usuariosController');
const { registerUser } = require('../controllers/usuariosController');

router.get('/users', getUsers);
router.post('/register', registerUser);

module.exports = router;