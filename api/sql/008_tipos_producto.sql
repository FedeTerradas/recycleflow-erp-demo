   -- ==========================================================
-- 008_tipos_producto.sql
-- Agrega tipos de producto estándar adicionales
-- ==========================================================

-- Insertar tipos adicionales, si ya existen actualiza la unidad
INSERT INTO tipo_producto (nombre, descripcion, unidad_stock)
VALUES
  ('Rollo / Bobina', 'Materiales vendidos por metro', 'm'),
  ('Líquido', 'Productos líquidos vendidos por litro', 'L'),
  ('Accesorio', 'Artículos unitarios genéricos', 'u')
ON CONFLICT (nombre) DO UPDATE
SET 
  unidad_stock = EXCLUDED.unidad_stock,
  descripcion = EXCLUDED.descripcion;
