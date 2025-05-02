USE tablero;

CREATE TABLE Usuario (
  id VARCHAR(36) PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100),
  contraseña VARCHAR(100),
  departamento VARCHAR(100),
  oficina VARCHAR(100)
);

CREATE TABLE Tablero (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36),
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE TableroCadenasTexto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tablero_id VARCHAR(36),
  texto VARCHAR(255),
  FOREIGN KEY (tablero_id) REFERENCES Tablero(id)
);

CREATE TABLE TableroInfoConexion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tablero_id VARCHAR(36),
  info TEXT,
  FOREIGN KEY (tablero_id) REFERENCES Tablero(id)
);

CREATE TABLE DiaAtencion (
  id VARCHAR(36) PRIMARY KEY,
  diaSemana VARCHAR(20),
  hora TIME,
  usuario_id VARCHAR(36),
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);
