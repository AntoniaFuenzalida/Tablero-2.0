const express = require('express');
const router = express.Router();
const { 
  getTableros, 
  getTableroById, 
  createTablero, 
  updateTablero, 
  deleteTablero 
} = require('../controllers/tablerosController');

// Obtener todos los tableros
router.get('/tableros', getTableros);

// Obtener un tablero específico por ID
router.get('/tableros/:id', getTableroById);

// Crear un nuevo tablero
router.post('/tableros', createTablero);

// Actualizar la asignación de un tablero
router.put('/tableros/:id', updateTablero);

// Eliminar un tablero
router.delete('/tableros/:id', deleteTablero);

module.exports = router;
