const db = require("../db");
const nodemailer = require("nodemailer");
require("dotenv").config();

const codigos = {}; // Mapa temporal de códigos

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

const enviarCodigo = async (req, res) => {
  const { correo } = req.body;

  // Validar dominio
  if (!correo.endsWith("@alumnos.utalca.cl")) {
    return res.status(400).json({ error: "El correo debe pertenecer al dominio @alumnos.utalca.cl" });
  }

  // Verificar si ya existe en la base de datos
  try {
    const [existing] = await db.query("SELECT id FROM Usuario WHERE correo = ?", [correo]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Este correo ya está registrado. Usa otro o inicia sesión." });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000);
    codigos[correo] = codigo;

    await transporter.sendMail({
      from: '"Sistema UTALCA" <utalca.sistema@gmail.com>',
      to: correo,
      subject: "Código de verificación",
      text: `Tu código de verificación es: ${codigo}`,
    });

    res.json({ message: "Código enviado al correo" });
  } catch (err) {
    console.error("Error al enviar código:", err);
    res.status(500).json({ error: "Error al enviar código" });
  }
};

const verificarCodigo = (req, res) => {
  const { correo, codigoIngresado } = req.body;
  if (codigos[correo] == codigoIngresado) {
    delete codigos[correo]; // evitar reutilización
    return res.json({ message: "Código correcto" });
  }
  return res.status(400).json({ error: "Código inválido" });
};

module.exports = {
  enviarCodigo,
  verificarCodigo,
};
