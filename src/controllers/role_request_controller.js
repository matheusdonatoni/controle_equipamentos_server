const express = require('express');
const User = require('../models/User');
const Role = require('../models/Role');
const RoleRequest = require('../models/RoleRequest');
const Unit = require('../models/Unit');
const AuthMiddleware = require('../middlewares/auth_middleware');

const router = express.Router();

// router.use(AuthMiddleware);

//CREATE
router.post('/', async (req, res) => {
    try {
        console.log(req.body);

        const roleRequest = await RoleRequest.create(req.body);

        return res.json();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao cadastrar função.',
        });
    }
});

//CREATE
router.put('/:id', async (req, res) => {
    try {
        const { approverId } = req.body;

        const approver = await User.findByPk(approverId);

        console.log(req.query);

        return res.json();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao cadastrar função.',
        });
    }
});

module.exports = (app) => app.use('/role-request', router);
