const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Usuario');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Registrar nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol } = req.body;

    if (!nombre || !correo || !contrasena)
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });

    // Validar dominio del correo
    if (!correo.endsWith("@alumnos.utalca.cl")) {
      return res.status(400).json({ error: "Solo se permiten correos institucionales @alumnos.utalca.cl" });
    }


    const [existing] = await db.query('SELECT id FROM Usuario WHERE correo = ?', [correo]);
    if (existing.length > 0) {
      const [user] = await db.query('SELECT * FROM Usuario WHERE correo = ?', [correo]);
      const u = user[0];
      if (!u.contrasena || !u.nombre || !u.rol) {
        return res.status(400).json({
          error: "Este correo ya fue iniciado pero el registro no se completó. Contacta soporte o usa otro correo.",
        });
      }

      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await db.query(
      'INSERT INTO Usuario (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hashedPassword, rol]
    );

    console.log("✅ Registrando usuario:", { nombre, correo, rol });

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Iniciar sesión
const loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena)
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });

  try {
    const [users] = await db.query('SELECT * FROM Usuario WHERE correo = ?', [correo]);
    if (users.length === 0)
      return res.status(401).json({ error: 'Usuario no encontrado' });

    const user = users[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch)
      return res.status(401).json({ error: 'Contraseña incorrecta' });

    await db.query('UPDATE Usuario SET disponible = 1 WHERE id = ?', [user.id]);

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol },
      process.env.JWT_SECRET || "claveSecreta",
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Cerrar sesión
const logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;
    await db.query('UPDATE Usuario SET disponible = 0 WHERE id = ?', [userId]);
    res.json({ message: 'Sesión cerrada correctamente' });
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
};

// Actualizar datos del usuario
const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { nombre, correo, departamento, oficina, contrasena, disponible } = req.body;

  try {
    const updates = [];
    const params = [];

    if (nombre) {
      updates.push("nombre = ?");
      params.push(nombre);
    }

    if (correo) {
      updates.push("correo = ?");
      params.push(correo);
    }

    if (departamento) {
      updates.push("departamento = ?");
      params.push(departamento);
    }

    if (oficina) {
      updates.push("oficina = ?");
      params.push(oficina);
    }

    if (contrasena) {
      const hashed = await bcrypt.hash(contrasena, 10);
      updates.push("contrasena = ?");
      params.push(hashed);
    }

    if (disponible !== undefined) {
      updates.push("disponible = ?");
      params.push(disponible);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
    }

    const query = `UPDATE Usuario SET ${updates.join(', ')} WHERE id = ?`;
    params.push(userId);

    await db.query(query, params);

    if (disponible !== undefined) {
      const mensaje = `Tu estado de disponibilidad fue cambiado a: ${disponible ? 'Disponible' : 'No disponible'}`;
      await db.query(
        'INSERT INTO Notificacion (usuarioId, mensaje, tipo, fecha) VALUES (?, ?, ?, NOW())',
        [userId, mensaje, 'disponibilidad']
      );
    }

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error("Error en updateUser:", err);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

module.exports = {
  registerUser,
  getUsers,
  loginUser,
  updateUser,
  logoutUser
};
