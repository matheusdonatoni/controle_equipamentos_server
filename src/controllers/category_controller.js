const express = require('express');
const Category = require('../models/Category');
const Item = require('../models/Item');
const AuthMiddleware = require('../middlewares/auth_middleware');


const router = express.Router();

router.use(AuthMiddleware);

//CREATE
router.post('/', async (req, res) => {
    try {
        const category = await Category.create(req.body);

        return res.json(category);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao cadastrar categoria.',
        });
    }
});

//CHECK IF NAME IS UNIQUE
router.get('/is/:name/unique-at/:machineId-:categoryId', async (req, res) => {
    try {
        const { name, machineId, categoryId } = req.params;

        const category = await Category.findOne({
            where: {
                name: name,
                machineId: machineId,
                categoryId: categoryId,
            },
        });

        if (category) {
            return res.json({
                result: false,
            });
        }

        return res.json({
            result: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao realizar operação.',
        });
    }
});

//COUNT CATEGORIES
router.get('/:id/count', async (req, res) => {
    try {
        const { id } = req.params;

        const count = await Category.count({
            where: {
                categoryId: id,
            },
        });

        return res.json(count);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao contar categorias',
        });
    }
});

//FIND ALL CHILDREN
router.get('/from/:machineId?/:categoryId?', async (req, res) => {
    try {
        var { machineId, categoryId } = req.params;

        const categories = await Category.findAll({
            where: {
                machineId: machineId,
                categoryId: categoryId,
            },
            order: [['name', 'ASC']],
        });

        if (!categories) {
            return res.status(400).json({
                error: 'Não foi possível encontrar as categorias.',
            });
        }

        return res.json(categories);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao realizar operação.',
        });
    }
});

//COUNT ITEMS
router.get('/:id/items/count', async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(400).json({
                error: 'Erro ao encontrar categoria.',
            });
        }

        return res.json(await category.countItems());
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao contar itens',
        });
    }
});

//FIND
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id, {
            include: [
                {
                    model: Category,
                },
                {
                    model: Item,
                },
            ],
        });

        if (!category) {
            return res.status(400).json({
                error: 'Categoria não cadastrada.',
            });
        }

        return res.json(category);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao encontrar categoria.',
        });
    }
});

//UPDATE
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id, {
            include: [
                {
                    model: Category,
                },
                {
                    model: Item,
                },
            ],
        });

        if (!category) {
            return res.status(400).json({
                error: 'Categoria não cadastrada.',
            });
        }

        await category.update(req.body);

        return res.json(category);
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao atualizar categoria.',
        });
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(400).json({
                error: 'Categoria não cadastrada.',
            });
        }

        await category.destroy({
            where: id,
        });

        return res.json({ message: 'Categoria deletada.' });
    } catch (error) {
        return res.status(400).json({
            error: 'Erro ao deletar categoria.',
        });
    }
});

//ASSIGN ALL ITEMS
router.put('/:id/assign/all/items', async (req, res) => {
    try {
        const { itemsId } = req.body;

        const { id } = req.params;

        const category = await Category.findByPk(id, {
            attributes: ['id'],
        });

        if (!category) {
            return res.status(400).json({
                error: 'Categoria não cadastrada.',
            });
        }

        await category.setItems([]);

        const items = await Item.findAll({
            where: {
                id: itemsId,
            },
            attributes: ['id'],
        });

        if (!items) {
            return res.status(400).json({
                error: 'Item não cadastrado.',
            });
        }

        category.addItems(items);

        return res.json({ message: 'Items adicionados com sucesso.' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Erro ao atualizar categoria.',
        });
    }
});

//REMOVE ALL ITEMS
router.get('/:id/remove/all/items', async (req, res) => {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
        attributes: [],
    });

    if (!category) {
        return res.status(400).json({
            error: 'Categoria não cadastrada.',
        });
    }

    return res.json({ message: 'Items removidos com sucesso.' });
});

//ADD ITEM
router.get('/:id/add/item/:itemId', async (req, res) => {
    const { id, itemId } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
        return res.status(400).json({
            error: 'Categoria não cadastrada.',
        });
    }

    const item = await Item.findByPk(itemId);

    if (!item) {
        return res.status(400).json({
            error: 'Item não cadastrado.',
        });
    }

    category.addItem(item);

    return res.json({ message: 'Item adicionado com sucesso.' });
});

//REMOVE ITEM
router.get('/:id/remove/item/:itemId', async (req, res) => {
    const { id, itemId } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
        return res.status(400).json({
            error: 'Categoria não cadastrada.',
        });
    }

    const item = await Item.findByPk(itemId);

    if (!item) {
        return res.status(400).json({
            error: 'Item não cadastrado.',
        });
    }

    category.removeItem(item);

    return res.json({ message: 'Item removido com sucesso.' });
});

module.exports = (app) => app.use('/category', router);
