const db = require("../../database");

class CategoriesRepository {
    findAll() {}

    async create({ name }) {
        const [row] = await db.Query(
            `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
            [name],
        );
        return row;
    }
}

module.exports = new CategoriesRepository();
