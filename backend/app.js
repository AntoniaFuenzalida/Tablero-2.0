const express = require('express');
const cors = require('cors');
const app = express();

require("dotenv").config();


app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/usuarios');
const messageRoutes = require('./routes/mensajes');
const verificacionRoutes = require("./routes/verificacionRoutes");
app.use('/api', userRoutes);
app.use('/api/mensajes', messageRoutes);
app.use("/api", verificacionRoutes);


module.exports = app;