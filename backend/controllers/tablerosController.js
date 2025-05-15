const db = require('../db');

const getTableros = async (req, res) => {
  try {
    // Verifica si el usuario está autenticado
    let query = 'SELECT t.*, u.nombre as nombre_usuario FROM Tablero t LEFT JOIN Usuario u ON t.usuario_id = u.id';
    let params = [];
    
    // Si se proporciona un usuario_id en la consulta, filtra por ese ID
    if (req.query.usuario_id) {
      query += ' WHERE t.usuario_id = ?';
      params.push(req.query.usuario_id);
    }
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tableros:', error);
    res.status(500).json({ error: 'Error al consultar los tableros' });
  }
};

/**
 * Obtiene un tablero específico por ID
 */
const getTableroById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT t.*, u.nombre as nombre_usuario FROM Tablero t LEFT JOIN Usuario u ON t.usuario_id = u.id WHERE t.id = ?', 
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el tablero:', error);
    res.status(500).json({ error: 'Error al consultar el tablero' });
  }
};

/**
 * Crea un nuevo tablero
 */
const createTablero = async (req, res) => {
  try {
    const { usuario_id } = req.body;
    
    const [result] = await db.query('INSERT INTO Tablero (usuario_id) VALUES (?)', [usuario_id]);
    
    res.status(201).json({ 
      id: result.insertId,
      usuario_id,
      mensaje: 'Tablero creado correctamente' 
    });
  } catch (error) {
    console.error('Error al crear tablero:', error);
    res.status(500).json({ error: 'Error al crear el tablero' });
  }
};

/**
 * Actualiza la asignación de un tablero
 */
const updateTablero = async (req, res) => {
  try {
    const { usuario_id } = req.body;
    
    const [result] = await db.query(
      'UPDATE Tablero SET usuario_id = ? WHERE id = ?', 
      [usuario_id, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }
    
    res.json({ mensaje: 'Tablero actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar tablero:', error);
    res.status(500).json({ error: 'Error al actualizar el tablero' });
  }
};

/**
 * Elimina un tablero
 */
const deleteTablero = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Tablero WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }
    
    res.json({ mensaje: 'Tablero eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar tablero:', error);
    res.status(500).json({ error: 'Error al eliminar el tablero' });
  }
};

module.exports = {
  getTableros,
  getTableroById,
  createTablero,
  updateTablero,
  deleteTablero
};
