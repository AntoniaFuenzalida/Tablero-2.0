const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/usuarios');
const messageRoutes = require('./routes/mensajes');
app.use('/api', userRoutes);
app.use('/api/mensajes', messageRoutes);

module.exports = app;