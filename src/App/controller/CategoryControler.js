const CategoriesRepository = require("../repositories/CategoriesRepository");

class CategoryController {
    async index(req, res) {
        const category = await CategoriesRepository.findAll();
        res.json(category);
    }

    async store(req, res) {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const category = await CategoriesRepository.create({ name });

        res.json(category);
    }
}

module.exports = new CategoryController();
