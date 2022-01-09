const express = require('express');
const Catalog = require('../models/Catalog');
const Unit = require('../models/Unit');
const AuthMiddleware = require('../middlewares/auth_middleware');

const router = express.Router();

router.use(AuthMiddleware);

//CREATE
router.post('/at/:id', async (req, res) => {
    try {
        const { id } = req.params;

        req.body.unitId = id;

        const unit = await Unit.findByPk(id, {
            include: [
                {
                    model: Catalog,
                },
            ],
        });

        if (!unit) {
            return res.status(400).json({
                error: 'A unidade não existe.',
            });
        }

        if (unit.catalog) {
            return res.status(400).json({
                error: 'A unidade já possui um catálogo.',
            });
        }

        const catalog = await Catalog.create(req.body);

        await catalog.reload();

        return res.json(catalog);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Não foi possível criar o catálogo.',
        });
    }
});

//FIND BY UNIT
router.get('/from/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const catalog = await Catalog.findOne({
            where: {
                unitId: id,
            },
        });

        if (!catalog) {
            return res.status(204).json();
        }

        await catalog.reload();

        return res.json(catalog);
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível encontrar o catálogo.',
        });
    }
});

//FIND ALL
router.get('/', async (req, res) => {
    try {
        const catalogs = await Catalog.findAll();

        if (!catalogs) {
            return res.status(400).json({
                error: 'Não foi possível encontrar os catálogos.',
            });
        }

        return res.json(catalogs);
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível encontrar os catálogos.',
        });
    }
});

//FIND
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const catalog = await Catalog.findByPk(id);

        if (!catalog) {
            return res.status(400).json({
                error: 'Não foi possível encontrar o catálogo.',
            });
        }

        await catalog.reload();

        return res.json(catalog);
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível encontrar o catálogo.',
        });
    }
});

//UPDATE
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const catalog = await Catalog.findByPk(id);

        if (!catalog) {
            return res.status(400).json({
                error: 'Não foi possível encontrar o catálogo.',
            });
        }

        await catalog.update(req.body);

        return res.json(catalog);
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível atualizar o catálogo.',
        });
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const catalog = await Catalog.findByPk(id);

        if (!catalog) {
            return res.status(400).json({
                error: 'Não foi possível encontrar o catálogo.',
            });
        }

        await catalog.destroy({
            where: id,
        });

        return res.json({
            message: 'Catálago deletado.',
        });
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível deletar o catálogo',
        });
    }
});

module.exports = (app) => app.use('/catalog', router);
