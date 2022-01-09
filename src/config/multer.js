const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');

module.exports = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            try {
                fs.accessSync('./uploads/pictures');
            } catch (error) {
                fs.mkdirSync('./uploads/pictures');
            }

            cb(null, './uploads/pictures');
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                file.key = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, file.key);
            });
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 1,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/heic',
            'image/heif',
            'image/gif',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    'Formato de imagem inválido, formatos aceitos: jpg, png, heic, heif e gif.'
                )
            );
        }
    },
};
