const express = require('express');
const User = require('../models/User');
const Machine = require('../models/Machine');
const Role = require('../models/Role');
const Unit = require('../models/Unit');
const Catalog = require('../models/Catalog');
const Picture = require('../models/Picture');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const AuthMiddleware = require('../middlewares/auth_middleware');

const router = express.Router();

const generateToken = (id = {}) => {
    const expiresIn = 86400;

    return {
        token: 'Bearer '.concat(
            jwt.sign(id, authConfig.secret, {
                expiresIn: expiresIn,
            })
        ),
        generatedAt: new Date().toISOString(),
        expiresIn: expiresIn,
    };
};

const options = {
    include: [
        {
            model: Unit,
            include: { model: Catalog },
        },
        { model: Picture },
        { model: Role },
        {
            model: Machine,
            through: {
                attributes: [],
            },
        },
    ],
};

//REGISTER
router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body);

        await user.reload(options);

        delete user.dataValues.password;

        return res.json({
            user,
            ...generateToken({ id: user.dataValues.id }),
        });
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível registrar o usuário.',
        });
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!password) {
            return res.status(400).json({
                error: 'Senha não informada.',
            });
        }

        const user = await User.findOne({
            where: {
                email: email,
            },
            attributes: {
                include: ['password'],
            },
        });

        if (!user) {
            return res.status(400).json({
                error: 'Usuário não cadastrado.',
            });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                error: 'Senha incorreta.',
            });
        }

        delete user.dataValues.password;

        await user.reload(options);

        return res.json({
            user,
            ...generateToken({ id: user.dataValues.id }),
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Não foi possível realizar o login.',
        });
    }
});

//CHECK IF EMAIL IS REGISTERED
router.post('/is-email-registered', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({
            where: {
                email: email,
            },
        });

        if (user) {
            return res.json({
                result: true,
            });
        } else {
            return res.json({
                result: false,
            });
        }
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível realizar a operação.',
        });
    }
});

//CHECK IF PASSWORD IS CORRECT
router.post('/is-password-correct', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: {
                email: email,
            },
            attributes: {
                include: ['password'],
            },
        });

        if (user) {
            if (!(await bcrypt.compare(password, user.password))) {
                return res.json({
                    result: false,
                });
            }
            return res.json({
                result: true,
            });
        } else {
            return res.json({
                result: true,
            });
        }
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível realizar a operação.',
        });
    }
});

// router.use(AuthMiddleware);

//FIND BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, options);

        if (!user) {
            return res.status(400).json({
                error: 'Não foi possível encontrar o usuário.',
            });
        }

        return res.json(user);
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível encontrar o usuário.',
        });
    }
});

//FIND USERS SLICE
router.get('/from/:id/:from-:to', async (req, res) => {
    try {
        const { id, from, to } = req.params;

        var users;

        if (id === undefined) {
            if (from === undefined || to === undefined)
                users = await User.findAll();
            else {
                const limit = parseInt(to) - parseInt(from);

                users = await User.findAll({
                    include: [
                        {
                            model: Picture,
                        },
                        {
                            model: Sector,
                        },
                    ],
                    offset: parseInt(from),
                    limit: parseInt(to) - parseInt(from),
                });
            }
        } else {
            if (from === undefined || to === undefined)
                users = await User.findAll({
                    where: {
                        unitId: id,
                    },
                });
            else {
                const limit = parseInt(to) - parseInt(from);

                users = await User.findAll({
                    where: {
                        unitId: id,
                    },
                    include: [
                        {
                            model: Picture,
                        },
                        {
                            model: Sector,
                        },
                    ],
                    offset: parseInt(from),
                    limit: parseInt(to) - parseInt(from),
                });
            }
        }

        if (!users) {
            return res.status(400).json({
                error: 'Erro ao encontrar as usuários.',
            });
        }

        return res.json(users);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao encontrar usuários.',
        });
    }
});

//UPDATE
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: {
                exclude: ['password'],
            },
        });

        if (!user) {
            return res.status(400).json({
                error: 'Não foi possível encontrar o usuário.',
            });
        }

        if (req.body.password) delete req.body.password;

        await user.update(req.body);

        await user.reload({
            include: [
                {
                    model: Picture,
                },
                {
                    model: Role,
                },
            ],
        });

        return res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Não foi possível atualizar o usuário.',
        });
    }
});

//FAVORITE MACHINE
router.put('/:id/favorite-machine/:machineId', async (req, res) => {
    try {
        const { id, machineId } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(400).json({
                error: 'Não foi possível encontrar o usuário.',
            });
        }

        const machine = await Machine.findByPk(machineId);

        if (!machine) {
            return res.status(400).json({
                error: 'Não foi possível encontrar a máquina.',
            });
        }

        await user.addMachine(machine);

        return res.json(machine);
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível favoritar a máquina.',
        });
    }
});

//UNFAVORITE MACHINE
router.put('/:id/unfavorite-machine/:machineId', async (req, res) => {
    try {
        const { id, machineId } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(400).json({
                error: 'Não foi possível encontrar o usuário.',
            });
        }

        const machine = await Machine.findByPk(machineId);

        if (!machine) {
            return res.status(400).json({
                error: 'Não foi possível encontrar a máquina.',
            });
        }

        await user.removeMachine(machine);

        return res.json(machine);
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível favoritar a máquina.',
        });
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(400).json({
                error: 'Não foi possível encontrar o usuário.',
            });
        }

        await user.destroy({
            where: id,
        });

        return res.json({
            message: 'Usuário deletado.',
        });
    } catch (error) {
        return res.status(400).json({
            error: 'Não foi possível deletar o usuário.',
        });
    }
});

module.exports = (app) => app.use('/user', router);
