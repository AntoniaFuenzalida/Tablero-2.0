USE tablero;

CREATE TABLE Usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100),
  contraseña VARCHAR(100),
  departamento VARCHAR(100),
  oficina VARCHAR(100),
  rol VARCHAR(20)
  disponible BOOLEAN DEFAULT FALSE
);

CREATE TABLE Tablero (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE TableroCadenasTexto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tablero_id INT,
  texto VARCHAR(255),
  FOREIGN KEY (tablero_id) REFERENCES Tablero(id)
);

CREATE TABLE TableroInfoConexion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tablero_id INT,
  info TEXT,
  FOREIGN KEY (tablero_id) REFERENCES Tablero(id)
);

CREATE TABLE DiaAtencion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  diaSemana VARCHAR(20),
  hora TIME,
  usuario_id INT,
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);
