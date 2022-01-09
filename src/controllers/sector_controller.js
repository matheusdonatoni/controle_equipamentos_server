const express = require('express');
const Sector = require('../models/Sector');
const AuthMiddleware = require('../middlewares/auth_middleware');

router = express.Router();

router.use(AuthMiddleware);

//CREATE
router.post('/', async (req, res) => {
    try {
        const sector = await Sector.create(req.body);

        return res.json(sector);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao criar novo setor.',
        });
    }
});

//FIND
router.get('/:id', async (req, res) => {
    try {
        const sector = await Sector.findAll();

        if (!sector) {
            return res.status(400).json({
                error: 'Não foi possível encontrar nenhum setor.',
            });
        }

        return res.json(sector);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao procurar os setores.',
        });
    }
});

//FIND ALL
router.get('/', async (req, res) => {
    try {
        const sectors = await Sector.findAll();

        if (!sectors) {
            return res.status(400).json({
                error: 'Não foi possível encontrar os setores.',
            });
        }

        return res.json(sectors);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao procurar o setor.',
        });
    }
});

//UPDATE
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const sector = await Sector.findByPk(id);

        if (!sector) {
            return res.status(400).json({
                error: 'setor não encontrado.',
            });
        }

        await sector.update(req.body);

        return res.json(sector);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao atualizar o setor.',
        });
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const sector = await Sector.findByPk(id);

        if (!sector) {
            return res.status(400).json({
                error: 'setor não encontrado.',
            });
        }

        await sector.destroy({
            where: id,
        });

        return res.json({
            message: 'Setor deletado.',
        });
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao deletar o setor.',
        });
    }
});

module.exports = (app) => app.use('/sector', router);
