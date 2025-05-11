const db = require('../db');

// obtener mensajes de un usuario por id de usuario
const getMensajes = async (req, res) => {
    const { id } = req.params; // id del usuario

    try {
        const query = `
            SELECT 
                tc.texto, 
                tc.id AS id, 
                t.id AS tablero_id
            FROM TableroCadenasTexto tc
            INNER JOIN Tablero t ON tc.tablero_id = t.id
            INNER JOIN Usuario u ON t.usuario_id = u.id
            WHERE t.usuario_id = ?
        `;
        const [rows] = await db.query(query, [id]);

        res.status(200).json(rows); // Devuelve los mensajes encontrados
    } catch (err) {
        console.error('Error al obtener los mensajes:', err);
        res.status(500).json({ error: 'Error al obtener los mensajes' });
    }
};

// agregar un mensaje a un usuario por id de usuario
const addMensaje = async (req, res) => {
    const { id } = req.params; // id del usuario
    const { texto } = req.body; // mensaje a agregar

    try {
        const query = `
            INSERT INTO TableroCadenasTexto (tablero_id, texto)
            SELECT t.id, ?
            FROM Tablero t
            WHERE t.usuario_id = ?
        `;
        await db.query(query, [texto, id]);

        res.status(201).json({ message: 'Mensaje agregado correctamente' });
    } catch (err) {
        console.error('Error al agregar el mensaje:', err);
        res.status(500).json({ error: 'Error al agregar el mensaje' });
    }
};

// eliminar un mensaje de un usuario por id de usuario y id de mensaje
const deleteMensaje = async (req, res) => {
    const { id_usuario, id_mensaje } = req.params; // id del usuario e id del mensaje

    try {
        const query = `
            DELETE FROM TableroCadenasTexto 
            WHERE id = ? AND tablero_id = (
                SELECT t.id 
                FROM Tablero t 
                WHERE t.usuario_id = ?
            )
        `;
        const [result] = await db.query(query, [id_mensaje, id_usuario]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Mensaje no encontrado" });
        }

        res.status(200).json({ message: "Mensaje eliminado correctamente" });
    } catch (err) {
        console.error("Error al eliminar el mensaje:", err);
        res.status(500).json({ error: "Error al eliminar el mensaje" });
    }
};

// Editar un mensaje por id
const editMensaje = async (req, res) => {
    const { id_mensaje } = req.params; // id del mensaje
    const { texto } = req.body; // nuevo texto del mensaje

    try {
        const query = `
            UPDATE TableroCadenasTexto 
            SET texto = ? 
            WHERE id = ?
        `;
        await db.query(query, [texto, id_mensaje]);

        res.status(200).json({ message: "Mensaje editado correctamente" });
    } catch (err) {
        console.error("Error al editar el mensaje:", err);
        res.status(500).json({ error: "Error al editar el mensaje" });
    }
};

module.exports = {getMensajes, addMensaje, deleteMensaje, editMensaje};