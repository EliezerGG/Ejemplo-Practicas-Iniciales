USE usuariosDB;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar algunos datos de ejemplo
INSERT INTO usuarios (nombre, email, telefono) VALUES 
('Juan Pérez', 'juan.perez@email.com', '555-0101'),
('María García', 'maria.garcia@email.com', '555-0102'),
('Carlos López', 'carlos.lopez@email.com', '555-0103');