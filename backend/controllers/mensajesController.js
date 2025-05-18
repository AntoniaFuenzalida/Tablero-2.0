const db = require('../db');

// Obtener mensajes por id del tablero
const getMensajes = async (req, res) => {
    const { id_tablero } = req.params;

    try {
        const query = `
            SELECT texto, id
            FROM TableroCadenasTexto
            WHERE tablero_id = ?
        `;
        const [rows] = await db.query(query, [id_tablero]);

        res.status(200).json(rows); // Devuelve los mensajes encontrados
    } catch (err) {
        console.error('Error al obtener los mensajes:', err);
        res.status(500).json({ error: 'Error al obtener los mensajes' });
    }
};

// Agregar un mensaje a un tablero específico
const addMensaje = async (req, res) => {
    const { id_tablero } = req.params;
    const { texto } = req.body;

    try {
        const query = `
            INSERT INTO TableroCadenasTexto (tablero_id, texto)
            VALUES (?, ?)
        `;
        await db.query(query, [id_tablero, texto]);

        res.status(201).json({ message: 'Mensaje agregado correctamente' });
    } catch (err) {
        console.error('Error al agregar el mensaje:', err);
        res.status(500).json({ error: 'Error al agregar el mensaje' });
    }
};

// Eliminar un mensaje por id del mensaje y id del tablero
const deleteMensaje = async (req, res) => {
    const { id_tablero, id_mensaje } = req.params;

    try {
        const query = `
            DELETE FROM TableroCadenasTexto
            WHERE id = ? AND tablero_id = ?
        `;
        const [result] = await db.query(query, [id_mensaje, id_tablero]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Mensaje no encontrado" });
        }

        res.status(200).json({ message: "Mensaje eliminado correctamente" });
    } catch (err) {
        console.error("Error al eliminar el mensaje:", err);
        res.status(500).json({ error: "Error al eliminar el mensaje" });
    }
};

// Editar un mensaje por id del mensaje y del tablero
const editMensaje = async (req, res) => {
    const { id_tablero, id_mensaje } = req.params;
    const { texto } = req.body;

    try {
        const query = `
            UPDATE TableroCadenasTexto
            SET texto = ?
            WHERE id = ? AND tablero_id = ?
        `;
        const [result] = await db.query(query, [texto, id_mensaje, id_tablero]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Mensaje no encontrado o no pertenece al tablero" });
        }

        res.status(200).json({ message: "Mensaje editado correctamente" });
    } catch (err) {
        console.error("Error al editar el mensaje:", err);
        res.status(500).json({ error: "Error al editar el mensaje" });
    }
};

module.exports = {getMensajes, addMensaje, deleteMensaje, editMensaje};