-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS tablero;
USE tablero;

-- Tabla Usuario
CREATE TABLE IF NOT EXISTS Usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100),
  contraseña VARCHAR(100),
  departamento VARCHAR(100),
  oficina VARCHAR(100),
  rol VARCHAR(20),
  disponible BOOLEAN DEFAULT FALSE
);

-- Tabla Tablero
CREATE TABLE IF NOT EXISTS Tablero (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Tabla TableroCadenasTexto
CREATE TABLE IF NOT EXISTS TableroCadenasTexto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tablero_id INT,
  texto VARCHAR(255),
  FOREIGN KEY (tablero_id) REFERENCES Tablero(id)
);

-- Tabla TableroInfoConexion
CREATE TABLE IF NOT EXISTS TableroInfoConexion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tablero_id INT,
  info TEXT,
  FOREIGN KEY (tablero_id) REFERENCES Tablero(id)
);

-- Tabla DiaAtencion
CREATE TABLE IF NOT EXISTS DiaAtencion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  diaSemana VARCHAR(20),
  hora TIME,
  horaFin TIME,
  activo TINYINT(1) DEFAULT 0,
  usuario_id INT,
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Tabla Notificacion
CREATE TABLE IF NOT EXISTS Notificacion (
  id INT NOT NULL AUTO_INCREMENT,
  usuarioId INT NOT NULL,
  mensaje TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT NULL,
  leida TINYINT(1) DEFAULT '0',
  fecha TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (usuarioId) REFERENCES Usuario(id)
);
