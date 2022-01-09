const express = require('express');
const Item = require('../models/Item');
const Category = require('../models/Category');
const Measurement = require('../models/Measurement');
const Picture = require('../models/Picture');
const AuthMiddleware = require('../middlewares/auth_middleware');
const NullParserMiddleware = require('../middlewares/null_parser_middleware');

const router = express.Router();

router.use(AuthMiddleware);

//CHECK IF NAME IS UNIQUE
router.get('/name/:name/is-unique', async (req, res) => {
    try {
        const { name } = req.params;

        const item = await Item.findOne({
            where: {
                name: name,
            },
        });

        if (item) {
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
router.get('/code/:code/is-unique', async (req, res) => {
    try {
        const { code } = req.params;

        const item = await Item.findOne({
            where: {
                code: code,
            },
        });

        if (item) {
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

//CREATE
router.post('/', async (req, res) => {
    try {
        const item = await Item.create(req.body);

        await item.reload({
            include: [
                {
                    model: Measurement,
                },
                {
                    model: Picture,
                },
            ],
        });

        return res.json(item);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao cadastrar item.',
        });
    }
});

//COUNT ITEMS
router.get('/count', async (req, res) => {
    try {
        const count = await Item.count();

        return res.json(count);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao contar itens',
        });
    }
});

//FIND ALL FROM CATEGORY
router.get('/from/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const include = [
            {
                model: Category,
                attributes: [],
                where: {
                    id: id,
                },
            },
        ];

        const items = await Item.findAll({
            include: include,
            attributes: ['id'],
        });

        if (!items) {
            return res.status(400).json({
                error: 'Erro ao encontrar os itens.',
            });
        }

        return res.json(items);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao encontrar itens.',
        });
    }
});

//FIND ITEMS SLICE
router.get('/from/:id*?/:from-:to', NullParserMiddleware, async (req, res) => {
    try {
        const { id, from, to } = req.params;

        var items;

        const include = [
            {
                model: Picture,
            },
            {
                model: Measurement,
            },
        ];

        if (id) {
            include.push({
                model: Category,
                attributes: [],
                where: {
                    id: id,
                },
            });
        }

        if (from === null || to === null) {
            items = await Item.findAll({
                include: include,
            });
        } else {
            items = await Item.findAll({
                include: include,
                order: [['name', 'ASC']],
                offset: parseInt(from),
                limit: parseInt(to) - parseInt(from),
            });
        }

        return res.json(items);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao encontrar itens.',
        });
    }
});

// FIND ITEM
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findByPk(id, {
            include: [
                {
                    model: Measurement,
                },
                {
                    model: Picture,
                },
            ],
        });

        if (!item) {
            return res.status(400).json({
                error: 'Item não cadastrado.',
            });
        }

        return res.json(item);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao encontrar item.',
        });
    }
});

//ADD TO CATEGORY
router.get('/:id/add/:categoryId', async (req, res) => {
    const { id, categoryId } = req.params;

    const category = await Category.findByPk(categoryId);

    if (!category) {
        return res.status(400).json({
            error: 'Categoria não cadastrada.',
        });
    }

    const item = await Item.findByPk(id);

    if (!item) {
        return res.status(400).json({
            error: 'Item não cadastrado.',
        });
    }

    category.addItem(item);

    return res.json({ message: 'Item adicionado com sucesso.' });
});

//REMOVE FROM CATEGORY
router.get('/:id/remove/:categoryId', async (req, res) => {
    const { id, categoryId } = req.params;

    const category = await Category.findByPk(categoryId);

    if (!category) {
        return res.status(400).json({
            error: 'Categoria não cadastrada.',
        });
    }

    const item = await Item.findByPk(id);

    if (!item) {
        return res.status(400).json({
            error: 'Item não cadastrado.',
        });
    }

    category.removeItem(item);

    return res.json({ message: 'Item removido com sucesso.' });
});

// FIND ALL ITEMS
router.get('/', async (req, res) => {
    try {
        const items = await Item.findAll({
            include: [
                {
                    model: Measurement,
                },
                {
                    model: Picture,
                },
            ],
        });

        return res.json(items);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao encontrar itens.',
        });
    }
});

// UPDATE ITEM
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findByPk(id, {
            include: [
                {
                    model: Measurement,
                },
                {
                    model: Picture,
                },
            ],
        });

        if (!item) {
            return res.status(400).json({
                error: 'Item não cadastrado.',
            });
        }

        await item.update(req.body);

        return res.json(item);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao atualizar item.',
        });
    }
});

// DELETE ITEM
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findByPk(id);

        if (!item) {
            return res.status(400).json({
                error: 'Item não cadastrado.',
            });
        }

        await item.destroy({
            where: id,
        });

        return res.json({ message: 'Item deletado.' });
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao deletar item.',
        });
    }
});

//ADD ITEM TO CATEGORY
router.get('/:id/add-to/:categoryId', async (req, res) => {
    const { id, categoryId } = req.params;

    const item = await Item.findByPk(id);

    if (!item) {
        return res.status(400).json({
            error: 'Item não cadastrado.',
        });
    }

    const category = await Category.findByPk(categoryId);

    if (!category) {
        return res.status(400).json({
            error: 'Categoria não cadastrada.',
        });
    }

    item.addCategory(category);

    return res.json({ message: 'Item adicionado com sucesso.' });
});

//REMOVE ITEM FROM CATEGORY
router.get('/:id/remove-from/:categoryId', async (req, res) => {
    const { id, categoryId } = req.params;

    const item = await Item.findByPk(id);

    if (!item) {
        return res.status(400).json({
            error: 'Item não cadastrado.',
        });
    }

    const category = await Category.findByPk(categoryId);

    if (!category) {
        return res.status(400).json({
            error: 'Categoria não cadastrada.',
        });
    }

    item.removeCategory(category);

    return res.json({ message: 'Item removido com sucesso.' });
});

module.exports = (app) => app.use('/item', router);
