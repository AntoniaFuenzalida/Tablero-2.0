const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

const {
  getUsers,
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
} = require('../controllers/usuariosController');

const tablerosController = require('../controllers/tablerosController'); // ✅ Controlador de tableros
const verifyToken = require('../controllers/authMiddleware');

// --- Rutas públicas ---
router.get('/users', getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);

// --- Rutas protegidas ---
router.put('/update', verifyToken, updateUser);

// Obtener datos del usuario autenticado
router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT nombre, id, correo, departamento, oficina FROM Usuario WHERE id = ?',
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

// Cambiar contraseña
router.put('/cambiar-contrasena', verifyToken, async (req, res) => {
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

// Guardar horario de atención
router.post('/horario', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const horarios = req.body.horarios;

  try {
    await db.query('DELETE FROM DiaAtencion WHERE usuario_id = ?', [userId]);

    for (const h of horarios) {
      if (h.activo) {
        await db.query(
          'INSERT INTO DiaAtencion (diaSemana, hora, horaFin, usuario_id) VALUES (?, ?, ?, ?)',
          [h.dia, h.inicio, h.fin, userId]
        );
      }
    }

    res.json({ message: 'Horario guardado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar horario' });
  }
});

// Obtener horario de atención
router.get('/horario', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      'SELECT diaSemana, hora, horaFin FROM DiaAtencion WHERE usuario_id = ?',
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener horarios' });
  }
});

// Notificaciones
router.get('/notificaciones', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      'SELECT id, mensaje, tipo, leida, fecha FROM Notificacion WHERE usuarioId = ? AND leida = FALSE ORDER BY fecha DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

router.put('/notificaciones/:id/leida', verifyToken, async (req, res) => {
  const notificacionId = req.params.id;

  try {
    await db.query(
      'UPDATE Notificacion SET leida = TRUE WHERE id = ?',
      [notificacionId]
    );
    res.json({ message: 'Notificación marcada como leída' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al marcar notificación como leída' });
  }
});

router.get('/notificaciones/historial', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      'SELECT id, mensaje, tipo, leida, fecha FROM Notificacion WHERE usuarioId = ? ORDER BY fecha DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener historial de notificaciones' });
  }
});

// Obtener docentes disponibles
router.get('/docentes', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, correo, departamento, oficina, disponible FROM Usuario WHERE rol = "docente"'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener docentes' });
  }
});


router.get('/docentes/conectados', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, correo, departamento, oficina, disponible FROM Usuario WHERE rol = \"docente\" AND disponible = 1'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener docentes conectados' });
  }
});

router.get('/tableros', tablerosController.getTableros);
router.get('/tableros/:id', tablerosController.getTableroById);
router.post('/tableros', tablerosController.createTablero);
router.put('/tableros/:id', tablerosController.updateTablero);
router.delete('/tableros/:id', tablerosController.deleteTablero);

module.exports = router;
