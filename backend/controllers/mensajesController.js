const db = require('../db');

// obtener mensajes de un usuario por id de usuario
const getMensajes = async (req, res) => {
    const { id } = req.params; // id del usuario

    try {
        const query = `
            SELECT tc.texto 
            FROM TableroCadenasTexto tc
            INNER JOIN Tablero t ON tc.tablero_id = t.id
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
            WHERE tablero_id = (
                SELECT t.id 
                FROM Tablero t 
                WHERE t.usuario_id = ?
            ) 
            AND id = ?
        `;
        await db.query(query, [id_usuario, id_mensaje]);

        res.status(200).json({ message: 'Mensaje eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el mensaje:', err);
        res.status(500).json({ error: 'Error al eliminar el mensaje' });
    }
};

module.exports = {getMensajes, addMensaje, deleteMensaje};