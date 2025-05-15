const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/usuarios');
const messageRoutes = require('./routes/mensajes');
const tablerosRoutes = require('./routes/tableros');

app.use('/api', userRoutes);
app.use('/api/mensajes', messageRoutes);
app.use('/api', tablerosRoutes);

module.exports = app;
