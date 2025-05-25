const nodemailer = require("nodemailer");
require("dotenv").config();

const codigos = {}; // Guarda temporal de códigos por correo

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net", 
  port: 587,
  auth: {
    user: "apikey", 
    pass: process.env.SENDGRID_API_KEY,
  },
});

exports.enviarCodigo = async (req, res) => {
  const { correo } = req.body;
  const codigo = Math.floor(100000 + Math.random() * 900000);
  codigos[correo] = codigo;

  try {
    await transporter.sendMail({
      from: '"Sistema UTALCA" <utalca.sistema@gmail.com>',
      to: correo,
      subject: "Código de verificación",
      text: `Tu código de verificación es: ${codigo}`,
    });

    res.json({ message: "Código enviado al correo" });
  } catch (err) {
    console.error("Error al enviar correo:", err);
    res.status(500).json({ error: "Error al enviar código" });
  }
};

exports.verificarCodigo = (req, res) => {
  const { correo, codigoIngresado } = req.body;
  if (codigos[correo] == codigoIngresado) {
    delete codigos[correo]; // Borra para que no se reutilice
    return res.json({ message: "Código correcto" });
  }
  return res.status(400).json({ error: "Código inválido" });
};
