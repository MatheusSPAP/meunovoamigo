ALTER TABLE `modelagemanimaisadocao`.`comportamento` AUTO_INCREMENT = 1;
ALTER TABLE `modelagemanimaisadocao`.`tipo` AUTO_INCREMENT = 1;
ALTER TABLE `modelagemanimaisadocao`.`tamanho_animal` AUTO_INCREMENT = 1;
ALTER TABLE `modelagemanimaisadocao`.`status` AUTO_INCREMENT = 1;
ALTER TABLE `modelagemanimaisadocao`.`usuario` AUTO_INCREMENT = 1;
ALTER TABLE `modelagemanimaisadocao`.`animal` AUTO_INCREMENT = 1;
ALTER TABLE `modelagemanimaisadocao`.`postagem` AUTO_INCREMENT = 1;
ALTER TABLE `modelagemanimaisadocao`.`evento` AUTO_INCREMENT = 1;
ALTER TABLE `modelagemanimaisadocao`.`interesse_adocao` AUTO_INCREMENT = 1;
ALTER TABLE `modelagemanimaisadocao`.`midia` AUTO_INCREMENT = 1;

-- Insert into comportamento table
INSERT INTO `modelagemanimaisadocao`.`comportamento` (`descricao`) VALUES 
('Brincalhão'),
('Calmo'),
('Tímido'),
('Amigável com crianças'),
('Agressivo com outros animais'),
('Medroso'),
('Sociável'),
('Destruidor'),
('Late/Mia muito'),
('Gosta de água'),
('Apegado'),
('Independente'),
('Comilão'),
('Seletivo com comida'),
('Gosta de colo'),
('Anti-social'),
('Curioso'),
('Territorial');

-- Insert into tipo table (required for raca table)
INSERT INTO `modelagemanimaisadocao`.`tipo` (`tipo_animal`) VALUES 
('Cachorro'),
('Gato');

-- Insert into tamanho_animal table
INSERT INTO `modelagemanimaisadocao`.`tamanho_animal` (`descricao`) VALUES 
('Pequeno'),
('Médio'),
('Grande');

-- Insert into status table
INSERT INTO `modelagemanimaisadocao`.`status` (`tipo`) VALUES 
('Disponível'),
('Adotado');

-- Insert dog breeds (tipo_idtipo_animal = 1 for Cachorro)
INSERT INTO `modelagemanimaisadocao`.`raca` (`idraca`, `tipo_idtipo_animal`, `tipo_raca`) VALUES 
(1, 1, 'Vira-lata (cão)'),
(2, 1, 'Labrador'),
(3, 1, 'Poodle'),
(4, 1, 'Bulldog'),
(5, 1, 'Pinscher'),
(6, 1, 'Outra');

-- Insert cat breeds (tipo_idtipo_animal = 2 for Gato)
INSERT INTO `modelagemanimaisadocao`.`raca` (`idraca`, `tipo_idtipo_animal`, `tipo_raca`) VALUES 
(7, 2, 'Vira-lata (gato)'),
(8, 2, 'Siamês'),
(9, 2, 'Persa'),
(10, 2, 'Outra');