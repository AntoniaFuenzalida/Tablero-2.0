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
    const { nombre, correo, contraseña, rol } = req.body;

    if (!nombre || !correo || !contraseña)
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });

    // Validar dominio del correo
    if (!correo.endsWith("@alumnos.utalca.cl")) {
      return res.status(400).json({ error: "El correo debe ser @alumnos.utalca.cl" });
    }

    const [existing] = await db.query('SELECT id FROM Usuario WHERE correo = ?', [correo]);
    if (existing.length > 0) {
      // Verifica si el usuario está incompleto (sin contraseña o sin rol)
      const [user] = await db.query('SELECT * FROM Usuario WHERE correo = ?', [correo]);
      const u = user[0];
      if (!u.contraseña || !u.nombre || !u.rol) {
        return res.status(400).json({
          error: "Este correo ya fue iniciado pero el registro no se completó. Contacta soporte o usa otro correo.",
        });
      }

      return res.status(409).json({ error: 'El usuario ya existe' });
    }


    const hashedPassword = await bcrypt.hash(contraseña, 10);

    await db.query(
      'INSERT INTO Usuario (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hashedPassword, rol]
    );

    console.log("✅ Registrando usuario:", { nombre, correo, rol });


    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Iniciar sesión (y marcar como disponible)
const loginUser = async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña)
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });

  try {
    const [users] = await db.query('SELECT * FROM Usuario WHERE correo = ?', [correo]);
    if (users.length === 0)
      return res.status(401).json({ error: 'Usuario no encontrado' });

    const user = users[0];
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);

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

// Cerrar sesión (opcional) => marcar como no disponible
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
  const { nombre, correo, departamento, oficina, contraseña, disponible } = req.body;

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

    if (contraseña) {
      const hashed = await bcrypt.hash(contraseña, 10);
      updates.push("contraseña = ?");
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
  logoutUser // nuevo
};
