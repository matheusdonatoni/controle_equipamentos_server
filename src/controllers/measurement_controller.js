const express = require('express');
const Measurement = require('../models/Measurement');
const AuthMiddleware = require('../middlewares/auth_middleware');

const router = express.Router();

router.use(AuthMiddleware);

//CREATE
router.post('/', async (req, res) => {
    try {
        const measurement = await Measurement.create(req.body);

        return res.json(measurement);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao cadastrar medida.',
        });
    }
});

//FIND
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const measurement = await Measurement.findByPk(id);

        if (!measurement) {
            return res.status(400).json({
                error: 'Medida não cadastrada.',
            });
        }

        return res.json(measurement);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao encontrar medida.',
        });
    }
});

//FIND ALL
router.get('/', async (req, res) => {
    try {
        const measurements = await Measurement.findAll();

        if (!measurements) {
            return res.status(400).json({
                error: 'Medida não cadastrada.',
            });
        }

        return res.json(measurements);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao encontrar medida.',
        });
    }
});

//UPDATE
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const measurement = await Measurement.findByPk(id);

        if (!measurement) {
            return res.status(400).json({
                error: 'Medida não cadastrada.',
            });
        }

        await measurement.update(req.body);

        return res.json(measurement);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao atualizar medida.',
        });
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const measurement = await Measurement.findByPk(id);

        if (!measurement) {
            return res.status(400).json({
                error: 'Medida não cadastrada.',
            });
        }

        await measurement.destroy({
            where: id,
        });

        return res.json({ message: 'Medida deletada.' });
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao deletar medida.',
        });
    }
});

module.exports = (app) => app.use('/measurement', router);
