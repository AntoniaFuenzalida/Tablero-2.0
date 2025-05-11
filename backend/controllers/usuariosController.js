const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Usuario');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registerUser = async (req, res) => {
    const { nombre, correo, contraseña, rol } = req.body;
  
    if (!nombre || !correo || !contraseña)
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  
    try {
      const [existing] = await db.query('SELECT id FROM Usuario WHERE correo = ?', [correo]);
      if (existing.length > 0) {
        return res.status(409).json({ error: 'El usuario ya existe' });
      }
  
      const hashedPassword = await bcrypt.hash(contraseña, 10);
  
      await db.query(
        'INSERT INTO Usuario (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)',
        [nombre, correo, hashedPassword, rol]
      );
  
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

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
  
      const token = jwt.sign(
        { id: user.id, nombre: user.nombre, correo: user.correo },
        process.env.JWT_SECRET || "claveSecreta",
        { expiresIn: '1h' }
      );
  
      res.json({ message: 'Login exitoso', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  
  const updateUser = async (req, res) => {
    const userId = req.user.id;
    const { nombre, correo, contraseña } = req.body;

    try {
      let query = 'UPDATE Usuario SET';
      const params = [];
      
      if (nombre) {
        query += ' nombre = ?,';
        params.push(nombre);
      }

      if (correo) {
        query += ' correo = ?,';
        params.push(correo);
      }

      if (contraseña) {
        const hashed = await bcrypt.hash(contraseña, 10);
        query += ' contraseña = ?,';
        params.push(hashed);
      }

      query = query.slice(0, -1);
      query += ' WHERE id = ?';
      params.push(userId);

      await db.query(query, params);

      res.json({ message: 'Usuario actualizado correctamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};


module.exports = { registerUser, getUsers , loginUser , updateUser};