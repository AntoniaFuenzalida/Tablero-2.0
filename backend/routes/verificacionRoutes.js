const express = require('express');
const router = express.Router();
const verificacionController = require('../controllers/verificacionController');

router.post('/enviar-codigo', verificacionController.enviarCodigo);
router.post('/verificar-codigo', verificacionController.verificarCodigo);

module.exports = router;
