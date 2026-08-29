-- 001_inicial.sql — Esquema base de MiCancha
-- Tablas: usuarios, canchas, horarios, reservas (con FKs e índices).

CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('cliente','dueno','admin') NOT NULL DEFAULT 'cliente',
  telefono VARCHAR(20) NULL,
  direccion VARCHAR(200) NULL,
  bloqueado TINYINT(1) NOT NULL DEFAULT 0,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS canchas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  dueno_id INT UNSIGNED NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NULL,
  zona VARCHAR(80) NOT NULL,
  direccion VARCHAR(200) NULL,
  precio DECIMAL(10,2) NOT NULL DEFAULT 0,
  latitud DECIMAL(10,7) NULL,
  longitud DECIMAL(10,7) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_canchas_dueno (dueno_id),
  KEY idx_canchas_zona (zona),
  CONSTRAINT fk_canchas_dueno FOREIGN KEY (dueno_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS horarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cancha_id INT UNSIGNED NOT NULL,
  fecha_inicio DATETIME NOT NULL,
  fecha_fin DATETIME NOT NULL,
  disponible TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_horarios_cancha_fecha (cancha_id, fecha_inicio),
  CONSTRAINT fk_horarios_cancha FOREIGN KEY (cancha_id) REFERENCES canchas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reservas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNSIGNED NOT NULL,
  cancha_id INT UNSIGNED NOT NULL,
  horario_id INT UNSIGNED NOT NULL,
  estado ENUM('confirmada','cancelada','completada') NOT NULL DEFAULT 'confirmada',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_reservas_usuario (usuario_id),
  KEY idx_reservas_cancha (cancha_id),
  KEY idx_reservas_horario (horario_id),
  CONSTRAINT fk_reservas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_reservas_cancha FOREIGN KEY (cancha_id) REFERENCES canchas(id) ON DELETE CASCADE,
  CONSTRAINT fk_reservas_horario FOREIGN KEY (horario_id) REFERENCES horarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
