const CategoriesRepository = require("../repositories/CategoriesRepository");

class CategoryController {
    index(req, res) {
        res.send({ message: "List of categories" });
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
