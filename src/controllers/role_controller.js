const express = require('express');
const Role = require('../models/Role');
const AuthMiddleware = require('../middlewares/auth_middleware');

const router = express.Router();

router.use(AuthMiddleware);

//CREATE
router.post('/', async (req, res) => {
    try {
        const role = await Role.create(req.body);

        return res.json(role);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao cadastrar função.',
        });
    }
});

//FIND
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(400).json({
                error: 'função não cadastrada.',
            });
        }

        return res.json(role);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao encontrar função.',
        });
    }
});

//UPDATE
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(400).json({
                error: 'função não cadastrada.',
            });
        }

        await role.update(req.body);

        return res.json(role);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao atualizar função.',
        });
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(400).json({
                error: 'função não cadastrada.',
            });
        }

        await role.destroy({
            where: id,
        });

        return res.json({ message: 'função deletada.' });
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao deletar função.',
        });
    }
});

module.exports = (app) => app.use('/role', router);
