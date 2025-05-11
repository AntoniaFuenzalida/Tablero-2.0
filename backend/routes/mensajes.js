const express = require('express');
const router = express.Router();
const { getMensajes } = require('../controllers/mensajesController');
const { addMensaje } = require('../controllers/mensajesController');
const { deleteMensaje } = require('../controllers/mensajesController');
const { editMensaje } = require('../controllers/mensajesController');

router.get('/:id', getMensajes);
router.post('/:id', addMensaje);
router.delete('/:id_usuario/:id_mensaje', deleteMensaje);
router.put('/:id_mensaje', editMensaje);

module.exports = router;