const express = require('express');
const Category = require('../models/Category');
const Machine = require('../models/Machine');
const Picture = require('../models/Picture');
const Sector = require('../models/Sector');
const AuthMiddleware = require('../middlewares/auth_middleware');
const NullParserMiddleware = require('../middlewares/null_parser_middleware');

const router = express.Router();

// router.use(AuthMiddleware);

//CREATE
router.post('/', async (req, res) => {
    try {
        const machine = await Machine.create(req.body);

        await machine.reload({
            include: [
                {
                    model: Picture,
                },
                {
                    model: Sector,
                },
            ],
        });

        return res.json(machine);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao cadastrar máquina.',
        });
    }
});

//CHECK IF NAME IS UNIQUE
router.get('/from/:id/name/:name/is-unique', async (req, res) => {
    try {
        const { name, id } = req.params;

        const machine = await Machine.findOne({
            where: {
                name: name,
                catalogId: id,
            },
        });

        if (machine) {
            return res.json({
                result: false,
            });
        }

        return res.json({
            result: true,
        });
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao realizar operação.',
        });
    }
});

//CHECK IF CODE IS UNIQUE
router.get('/from/:id/code/:code/is-unique', async (req, res) => {
    try {
        const { code, id } = req.params;

        const machine = await Machine.findOne({
            where: {
                code: code,
                catalogId: id,
            },
        });

        if (machine) {
            return res.json({
                result: false,
            });
        }

        return res.json({
            result: true,
        });
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao realizar operação.',
        });
    }
});

//COUNT MACHINES BY CATALOG
router.get('/count/:catalogId', async (req, res) => {
    try {
        const { catalogId } = req.params;

        const count = await Machine.count({
            where: {
                catalogId: catalogId,
            },
        });

        return res.json(count);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao contar máquinas.',
        });
    }
});

//FIND MACHINES SLICE FROM CATALOG
router.get('/from/:id/:from-:to', NullParserMiddleware, async (req, res) => {
    try {
        const { id, from, to } = req.params;

        var machines;

        if (from === null || to === null)
            machines = await Machine.findAll({
                where: {
                    catalogId: id,
                },
                include: [
                    {
                        model: Picture,
                    },
                    {
                        model: Sector,
                    },
                ],
                order: [['name', 'ASC']],
            });
        else {
            machines = await Machine.findAll({
                where: {
                    catalogId: id,
                },
                include: [
                    {
                        model: Picture,
                    },
                    {
                        model: Sector,
                    },
                ],
                order: [['name', 'ASC']],
                offset: parseInt(from),
                limit: parseInt(to) - parseInt(from),
            });
        }

        if (!machines) {
            return res.status(400).json({
                error: 'Erro ao encontrar as máquinas.',
            });
        }

        return res.json(machines);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao encontrar máquinas.',
        });
    }
});

//FIND
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const machine = await Machine.findByPk(id, {
            include: [
                {
                    model: Picture,
                },
                {
                    model: Sector,
                },
            ],
        });

        if (!machine) {
            return res.status(400).json({
                error: 'Máquina não cadastrada.',
            });
        }

        return res.json(machine);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao encontrar a máquina.',
        });
    }
});

//UPDATE
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const machine = await Machine.findByPk(id);

        if (!machine) {
            return res.status(400).json({
                error: 'Máquina não cadastrada.',
            });
        }

        await machine.update(req.body);

        await machine.reload({
            include: [
                {
                    model: Picture,
                },
                {
                    model: Sector,
                },
            ],
        });

        return res.json(machine);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao atualizar a máquina.',
        });
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const machine = await Machine.findByPk(id);

        if (!machine) {
            return res.status(400).json({
                error: 'Máquina não cadastrada.',
            });
        }

        await machine.destroy({ where: id });

        return res.json({ message: 'Máquina deletada.' });
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível deletar a máquina.',
        });
    }
});

module.exports = (app) => app.use('/machine', router);
