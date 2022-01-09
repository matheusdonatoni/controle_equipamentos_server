const express = require('express');
const multer = require('multer');
const multerConfig = require('../config/multer');
const fs = require('fs');
const path = require('path');

const Picture = require('../models/Picture');
const User = require('../models/User');
const Machine = require('../models/Machine');
const Item = require('../models/Item');
const NullParserMiddleware = require('../middlewares/null_parser_middleware');
const QueryParserMiddleware = require('../middlewares/query_parser_middleware');

const AuthMiddleware = require('../middlewares/auth_middleware');

const upload = multer(multerConfig);

const router = express.Router();
// router.use(AuthMiddleware);

const options = {
    include: [
        {
            model: User,
            attributes: ['pictureId'],
        },
        {
            model: Machine,
            attributes: ['pictureId'],
        },
        {
            model: Item,
            attributes: ['pictureId'],
        },
    ],
};

const filterPictures = (pictures, query) => {
    const {
        includeUsers = false,
        includeMachines = true,
        includeItems = true,
    } = query;

    pictures.forEach((picture, i) => {
        if (includeUsers === false && picture.dataValues.users.length !== 0) {
            pictures.splice(i, 1);
        }

        if (
            includeMachines === false &&
            picture.dataValues.machines.length !== 0
        ) {
            pictures.splice(i, 1);
        }

        if (includeItems === false && picture.dataValues.items.length !== 0) {
            pictures.splice(i, 1);
        }

        delete picture.dataValues.users;
        delete picture.dataValues.machines;
        delete picture.dataValues.items;
    });

    return pictures;
};

//CREATE
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { originalname: name, size, key, location: url = '' } = req.file;

        const picture = await Picture.create({ name, size, key, url });

        return res.json(picture);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao cadastrar imagem.',
        });
    }
});

//COUNT PICTURES
router.get('/count', async (req, res) => {
    try {
        const count = await Picture.count();

        if (!count) {
            return res.status(400).json({
                error: 'Erro ao contar as imagens.',
            });
        }

        return res.json(count);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao contar imagens.',
        });
    }
});

//FIND SLICE
router.get(
    '/:from-:to',
    [NullParserMiddleware, QueryParserMiddleware],
    async (req, res) => {
        try {
            const { from, to } = req.params;

            var pictures = [];

            if (from === null || to === null) {
                pictures = await Picture.findAll(options);
            } else {
                pictures = await Picture.findAll({
                    ...options,
                    offset: parseInt(from),
                    limit: parseInt(to) - parseInt(from),
                });
            }

            // const { query } = queryString.parseUrl(req.url, {
            //     parseBooleans: true,
            // });

            return res.json(filterPictures(pictures, req.query));
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: 'Erro ao encontrar imagens.',
            });
        }
    }
);

//FIND
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const picture = await Picture.findByPk(id);

        if (!picture) {
            return res.status(400).json({
                error: 'Imagem não cadastrada.',
            });
        }

        return res.json(picture);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao encontrar imagem.',
        });
    }
});

//UPDATE
router.put('/:id', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;

        req.body.path = updatePath(req.file.path);

        req.body.name = updateName(req.body.path, req.body.type);

        const picture = await Picture.findByPk(id);

        if (!picture) {
            return res.status(400).json({
                error: 'Imagem não cadastrada.',
            });
        }

        await picture.update(req.body);

        return res.json(picture);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao atualizar imagem.',
        });
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const picture = await Picture.findByPk(id);

        if (!picture) {
            return res.status(400).json({
                error: 'Imagem não cadastrada.',
            });
        }

        fs.rmSync(path.resolve(picture.path));

        await picture.destroy({
            where: id,
        });

        return res.json({ message: 'Imagem deletada.' });
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao deletar imagem.',
        });
    }
});

module.exports = (app) => app.use('/picture', router);
