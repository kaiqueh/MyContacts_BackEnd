const db = require("../../database");

class CategoriesRepository {
    findAll() {
        return db.Query("SELECT * FROM categories");
    }

    async create({ name }) {
        const [row] = await db.Query(
            `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
            [name],
        );
        return row;
    }
}

module.exports = new CategoriesRepository();
