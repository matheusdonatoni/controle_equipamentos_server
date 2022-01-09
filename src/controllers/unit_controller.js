const express = require('express');
const Unit = require('../models/Unit');
const AuthMiddleware = require('../middlewares/auth_middleware');

const router = express.Router();

//FIND
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const unit = await Unit.findByPk(id);

        if (!unit) {
            return res.status(400).json({
                error: 'Não foi possível encontrar a unidade.',
            });
        }

        return res.json(unit);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao procurar a unidade.',
        });
    }
});

//FIND ALL
router.get('/', async (req, res) => {
    try {
        const units = await Unit.findAll();

        if (!units) {
            return res.status(400).json({
                error: 'Não foi possível encontrar nenhuma unidade.',
            });
        }

        if (units.length === 0) {
            return res.json(null);
        }

        return res.json(units);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao procurar as unidades.',
        });
    }
});

router.use(AuthMiddleware);

//CREATE
router.post('/', async (req, res) => {
    try {
        const { name, code } = req.body;

        const unit = await Unit.create({ name, code });

        return res.json(unit);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao criar nova unidade.',
        });
    }
});

//UPDATE
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const unit = await Unit.findByPk(id);

        if (!unit) {
            return res.status(400).json({
                error: 'Unidade não encontrada.',
            });
        }

        await unit.update(req.body);

        return res.json(unit);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao atualizar a unidade.',
        });
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const unit = await Unit.findByPk(id);

        if (!unit) {
            return res.status(400).json({
                error: 'Unidade não encontrada.',
            });
        }

        await unit.destroy({
            where: id,
        });

        return res.json({
            message: 'Empresa deletada.',
        });
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao deletar a unidade.',
        });
    }
});

module.exports = (app) => app.use('/unit', router);
