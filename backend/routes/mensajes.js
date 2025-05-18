const express = require('express');
const router = express.Router();
const { getMensajes } = require('../controllers/mensajesController');
const { addMensaje } = require('../controllers/mensajesController');
const { deleteMensaje } = require('../controllers/mensajesController');
const { editMensaje } = require('../controllers/mensajesController');

router.get('/:id_tablero', getMensajes);
router.post('/:id_tablero', addMensaje);
router.delete('/:id_tablero/:id_mensaje', deleteMensaje);
router.put('/:id_mensaje', editMensaje);

module.exports = router;