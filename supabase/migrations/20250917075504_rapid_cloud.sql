/*
  # Esquema de base de datos para gestión hospitalaria

  1. Nuevas Tablas
    - `rooms`
      - `id` (uuid, primary key)
      - `name` (text, nombre de la sala)
      - `color` (text, color hexadecimal)
      - `is_active` (boolean, si la sala está activa)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `reservations`
      - `id` (uuid, primary key)
      - `doctor_name` (text, nombre del doctor)
      - `room_id` (uuid, foreign key to rooms)
      - `date` (date, fecha de la reserva)
      - `start_time` (time, hora de inicio)
      - `end_time` (time, hora de fin)
      - `is_recurring` (boolean, si es recurrente)
      - `recurring_days` (integer[], días de la semana)
      - `color` (text, color de la reserva)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en ambas tablas
    - Políticas para operaciones CRUD públicas (para simplicidad)
*/

-- Crear tabla de salas
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de reservas
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_name text NOT NULL,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_recurring boolean DEFAULT false,
  recurring_days integer[] DEFAULT '{}',
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Políticas para rooms (acceso público para simplicidad)
CREATE POLICY "Permitir lectura de salas"
  ON rooms
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserción de salas"
  ON rooms
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Permitir actualización de salas"
  ON rooms
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Permitir eliminación de salas"
  ON rooms
  FOR DELETE
  TO public
  USING (true);

-- Políticas para reservations (acceso público para simplicidad)
CREATE POLICY "Permitir lectura de reservas"
  ON reservations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserción de reservas"
  ON reservations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Permitir actualización de reservas"
  ON reservations
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Permitir eliminación de reservas"
  ON reservations
  FOR DELETE
  TO public
  USING (true);

-- Insertar salas por defecto
INSERT INTO rooms (name, color) VALUES
  ('Consulta 1', '#3B82F6'),
  ('Consulta 2', '#10B981'),
  ('Consulta 3', '#F59E0B'),
  ('Consulta 4', '#EF4444'),
  ('Consulta 5', '#8B5CF6')
ON CONFLICT DO NOTHING;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();