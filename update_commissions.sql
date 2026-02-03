-- Limpiar la tabla de comisiones actual (si es necesario reiniciar los IDs)
TRUNCATE TABLE commissions RESTART IDENTITY CASCADE;

-- Insertar las nuevas 8 comisiones con los IDs correctos
INSERT INTO commissions (name) VALUES 
('Biología Animal'),                                                  -- ID 1
('Biología Vegetal'),                                                 -- ID 2
('Funcionamiento de Ecosistemas, Medio Ambiente y Cambio Climático'), -- ID 3
('Biotecnología Vegetal'),                                            -- ID 4
('Potencialidades de Los Extractos Vegetales'),                       -- ID 5
('Optimización de Productos Vegetales'),                              -- ID 6
('Historia y Personalidades de la Biotecnología vegetal'),            -- ID 7
('Colegio Universitario');                                            -- ID 8
