const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/';

// Garante que o diretório de uploads exista
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Define um nome de arquivo único para evitar sobreposição
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para aceitar apenas imagens e vídeos
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|mkv/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Tipo de arquivo não suportado! Apenas imagens e vídeos são permitidos.'));
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20 // Limite de 20MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
