-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema modelagemanimaisadocao
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema modelagemanimaisadocao
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `modelagemanimaisadocao` DEFAULT CHARACTER SET utf8mb3 ;
USE `modelagemanimaisadocao` ;

-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`comportamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`comportamento` (
  `idcomportamento` INT NOT NULL AUTO_INCREMENT,
  `descricao` ENUM('Brincalhão', 'Calmo', 'Tímido', 'Amigável com crianças', 'Agressivo com outros animais', 'Medroso', 'Sociável', 'Destruidor', 'Late/Mia muito', 'Gosta de água', 'Apegado', 'Independente', 'Comilão', 'Seletivo com comida', 'Gosta de colo', 'Anti-social', 'Curioso', 'Territorial') NOT NULL DEFAULT 'Calmo',
  PRIMARY KEY (`idcomportamento`))
ENGINE = InnoDB
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`tipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`tipo` (
  `idtipo_animal` INT NOT NULL AUTO_INCREMENT,
  `tipo_animal` ENUM('Cachorro', 'Gato') NOT NULL,
  PRIMARY KEY (`idtipo_animal`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`raca`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`raca` (
  `idraca` INT NOT NULL AUTO_INCREMENT,
  `tipo_idtipo_animal` INT NOT NULL,
  `tipo_raca` ENUM('Vira-lata (cão)', 'Labrador', 'Poodle', 'Bulldog', 'Pinscher', 'Vira-lata (gato)', 'Siamês', 'Persa', 'Outra') NOT NULL,
  PRIMARY KEY (`idraca`),
  INDEX `fk_raca_tipo1_idx` (`tipo_idtipo_animal` ASC) VISIBLE,
  CONSTRAINT `fk_raca_tipo1`
    FOREIGN KEY (`tipo_idtipo_animal`)
    REFERENCES `modelagemanimaisadocao`.`tipo` (`idtipo_animal`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`status` (
  `idstatus` INT NOT NULL AUTO_INCREMENT,
  `tipo` ENUM('Disponível', 'Adotado') NOT NULL DEFAULT 'Disponível',
  PRIMARY KEY (`idstatus`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`tamanho_animal`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`tamanho_animal` (
  `idtamanho_animal` INT NOT NULL AUTO_INCREMENT,
  `descricao` ENUM('Pequeno', 'Médio', 'Grande') NOT NULL DEFAULT 'Médio',
  PRIMARY KEY (`idtamanho_animal`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`usuario` (
  `idusuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `telefone` VARCHAR(15) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `cidade` VARCHAR(45) NOT NULL,
  `endereco` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idusuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`animal`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`animal` (
  `idAnimal` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `sexo` ENUM('M', 'F') NOT NULL,
  `foto` VARCHAR(255) NOT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `castrado` TINYINT(1) NOT NULL DEFAULT '0',
  `vacinado` TINYINT(1) NOT NULL DEFAULT '0',
  `data_cadastro` DATE NOT NULL,
  `fk_idusuario` INT NOT NULL,
  `fk_idstatus` INT NOT NULL,
  `tipo_idtipo_animal` INT NOT NULL,
  `tamanho_animal_idtamanho_animal` INT NOT NULL,
  `comportamento_idcomportamento` INT NOT NULL,
  `fk_idraca` INT NOT NULL,
  PRIMARY KEY (`idAnimal`),
  INDEX `fk_animal_usuario1_idx` (`fk_idusuario` ASC) VISIBLE,
  INDEX `fk_animal_status1_idx` (`fk_idstatus` ASC) VISIBLE,
  INDEX `fk_animal_tipo1_idx` (`tipo_idtipo_animal` ASC) VISIBLE,
  INDEX `fk_animal_tamanho_animal1_idx` (`tamanho_animal_idtamanho_animal` ASC) VISIBLE,
  INDEX `fk_animal_comportamento1_idx` (`comportamento_idcomportamento` ASC) VISIBLE,
  INDEX `fk_animal_raca_idx` (`fk_idraca` ASC) VISIBLE,
  CONSTRAINT `fk_animal_comportamento1`
    FOREIGN KEY (`comportamento_idcomportamento`)
    REFERENCES `modelagemanimaisadocao`.`comportamento` (`idcomportamento`),
  CONSTRAINT `fk_animal_raca1`
    FOREIGN KEY (`fk_idraca`)
    REFERENCES `modelagemanimaisadocao`.`raca` (`idraca`),
  CONSTRAINT `fk_animal_status1`
    FOREIGN KEY (`fk_idstatus`)
    REFERENCES `modelagemanimaisadocao`.`status` (`idstatus`),
  CONSTRAINT `fk_animal_tamanho_animal1`
    FOREIGN KEY (`tamanho_animal_idtamanho_animal`)
    REFERENCES `modelagemanimaisadocao`.`tamanho_animal` (`idtamanho_animal`),
  CONSTRAINT `fk_animal_tipo1`
    FOREIGN KEY (`tipo_idtipo_animal`)
    REFERENCES `modelagemanimaisadocao`.`tipo` (`idtipo_animal`),
  CONSTRAINT `fk_animal_usuario1`
    FOREIGN KEY (`fk_idusuario`)
    REFERENCES `modelagemanimaisadocao`.`usuario` (`idusuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`postagem`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`postagem` (
  `idcomunidade` INT NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(255) NOT NULL,
  `data_postagem` DATETIME NOT NULL,
  `titulo` VARCHAR(100) NULL DEFAULT NULL,
  `animal_idAnimal` INT NULL DEFAULT NULL,
  `usuario_idusuario` INT NOT NULL,
  PRIMARY KEY (`idcomunidade`),
  INDEX `fk_postagem_animal1_idx` (`animal_idAnimal` ASC) VISIBLE,
  INDEX `fk_postagem_usuario1_idx` (`usuario_idusuario` ASC) VISIBLE,
  CONSTRAINT `fk_postagem_animal1`
    FOREIGN KEY (`animal_idAnimal`)
    REFERENCES `modelagemanimaisadocao`.`animal` (`idAnimal`),
  CONSTRAINT `fk_postagem_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `modelagemanimaisadocao`.`usuario` (`idusuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`comentario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`comentario` (
  `id_comentario` INT NOT NULL AUTO_INCREMENT,
  `fk_idcomunidade` INT NOT NULL,
  `fk_idusuario` INT NOT NULL,
  `mensagem` VARCHAR(255) NOT NULL,
  `data_comentario` DATETIME NOT NULL,
  PRIMARY KEY (`id_comentario`),
  INDEX `fk_comentario_postagem_idx` (`fk_idcomunidade` ASC) VISIBLE,
  INDEX `fk_comentario_usuario_idx` (`fk_idusuario` ASC) VISIBLE,
  CONSTRAINT `fk_comentario_postagem1`
    FOREIGN KEY (`fk_idcomunidade`)
    REFERENCES `modelagemanimaisadocao`.`postagem` (`idcomunidade`),
  CONSTRAINT `fk_comentario_usuario1`
    FOREIGN KEY (`fk_idusuario`)
    REFERENCES `modelagemanimaisadocao`.`usuario` (`idusuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`conversations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`conversations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `animal_id` INT NOT NULL,
  `interested_user_id` INT NOT NULL,
  `owner_user_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_conversation_per_animal_user` (`animal_id` ASC, `interested_user_id` ASC) VISIBLE,
  INDEX `fk_conversations_animal_idx` (`animal_id` ASC) VISIBLE,
  INDEX `fk_conversations_interested_user_idx` (`interested_user_id` ASC) VISIBLE,
  INDEX `fk_conversations_owner_user_idx` (`owner_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_conversations_animal`
    FOREIGN KEY (`animal_id`)
    REFERENCES `modelagemanimaisadocao`.`animal` (`idAnimal`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_conversations_interested_user`
    FOREIGN KEY (`interested_user_id`)
    REFERENCES `modelagemanimaisadocao`.`usuario` (`idusuario`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_conversations_owner_user`
    FOREIGN KEY (`owner_user_id`)
    REFERENCES `modelagemanimaisadocao`.`usuario` (`idusuario`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`evento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`evento` (
  `idEvento` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `tipo_evento` ENUM('Feira de Adoção', 'Campanha de Vacinação', 'Mutirão de Castração', 'Outro') NOT NULL,
  `endereco` VARCHAR(45) NOT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `data` DATE NOT NULL,
  `fk_idusuario` INT NOT NULL,
  PRIMARY KEY (`idEvento`),
  INDEX `fk_evento_usuario1_idx` (`fk_idusuario` ASC) VISIBLE,
  CONSTRAINT `fk_evento_usuario1`
    FOREIGN KEY (`fk_idusuario`)
    REFERENCES `modelagemanimaisadocao`.`usuario` (`idusuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`interesse_adocao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`interesse_adocao` (
  `idinteresse_adocao` INT NOT NULL AUTO_INCREMENT,
  `mensagem` VARCHAR(255) NOT NULL,
  `interesse_status` ENUM('Aguardando', 'Aprovado', 'Recusado') NOT NULL DEFAULT 'Aguardando',
  `data_interesse` DATETIME NOT NULL,
  `usuario_idusuario` INT NOT NULL,
  `animal_idAnimal` INT NOT NULL,
  PRIMARY KEY (`idinteresse_adocao`),
  INDEX `fk_interesse_adocao_usuario1_idx` (`usuario_idusuario` ASC) VISIBLE,
  INDEX `fk_interesse_adocao_animal1_idx` (`animal_idAnimal` ASC) VISIBLE,
  CONSTRAINT `fk_interesse_adocao_animal1`
    FOREIGN KEY (`animal_idAnimal`)
    REFERENCES `modelagemanimaisadocao`.`animal` (`idAnimal`),
  CONSTRAINT `fk_interesse_adocao_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `modelagemanimaisadocao`.`usuario` (`idusuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `conversation_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `message_text` TEXT NOT NULL,
  `sent_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` TINYINT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `fk_messages_conversation_idx` (`conversation_id` ASC) VISIBLE,
  INDEX `fk_messages_sender_idx` (`sender_id` ASC) VISIBLE,
  INDEX `fk_messages_receiver_idx` (`receiver_id` ASC) VISIBLE,
  CONSTRAINT `fk_messages_conversation`
    FOREIGN KEY (`conversation_id`)
    REFERENCES `modelagemanimaisadocao`.`conversations` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_messages_receiver`
    FOREIGN KEY (`receiver_id`)
    REFERENCES `modelagemanimaisadocao`.`usuario` (`idusuario`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_messages_sender`
    FOREIGN KEY (`sender_id`)
    REFERENCES `modelagemanimaisadocao`.`usuario` (`idusuario`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `modelagemanimaisadocao`.`midia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelagemanimaisadocao`.`midia` (
  `idmidia` INT NOT NULL AUTO_INCREMENT,
  `nome_arquivo` VARCHAR(255) NOT NULL,
  `tipo` ENUM('foto', 'video') NOT NULL DEFAULT 'foto',
  `tamanho` INT NOT NULL COMMENT 'Tamanho em bytes',
  `caminho` VARCHAR(512) NOT NULL,
  `data_upload` DATETIME NOT NULL,
  `postagem_idcomunidade` INT NOT NULL,
  PRIMARY KEY (`idmidia`),
  INDEX `fk_midia_postagem1_idx` (`postagem_idcomunidade` ASC) VISIBLE,
  CONSTRAINT `fk_midia_postagem1`
    FOREIGN KEY (`postagem_idcomunidade`)
    REFERENCES `modelagemanimaisadocao`.`postagem` (`idcomunidade`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
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
