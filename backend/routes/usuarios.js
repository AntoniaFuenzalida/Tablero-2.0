const express = require('express');
const router = express.Router();
const db = require('../db'); 

const {
  getUsers,
  registerUser,
  loginUser,
  updateUser,
} = require('../controllers/usuariosController');
const verifyToken = require('../controllers/authMiddleware'); 
const bcrypt = require('bcrypt');



// Rutas públicas
router.get('/users', getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rutas protegidas
router.put('/update', verifyToken, updateUser);

//Ruta apra obtener datos del usuario autenticado
router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT nombre, correo, departamento, oficina FROM Usuario WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});

router.put('/cambiar-contrasena', verifyToken, async (req, res) => {
    console.log("Ruta cambiar-contrasena activa");

  const { actual, nueva } = req.body;
  const userId = req.user.id;

  try {
    const [rows] = await db.query('SELECT contraseña FROM Usuario WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const coincide = await bcrypt.compare(actual, rows[0].contraseña);
    if (!coincide) return res.status(400).json({ error: 'Contraseña actual incorrecta' });

    const hashedNueva = await bcrypt.hash(nueva, 10);
    await db.query('UPDATE Usuario SET contraseña = ? WHERE id = ?', [hashedNueva, userId]);

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
});


module.exports = router;
