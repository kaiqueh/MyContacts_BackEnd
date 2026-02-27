const db = require("../../database");

class concatRepository {
    async findall(orderBy = "ASC") {
        const direction = orderBy.toUpperCase() === "DESC" ? "DESC" : "ASC";
        const rows = await db.Query(
            `SELECT * FROM contacts ORDER BY name ${direction}`,
        );
        return rows;
    }
    async findbyId(id) {
        const [row] = await db.Query("SELECT * FROM contacts WHERE id = $1", [
            id,
        ]);
        return row;
    }
    async findByEmail(email) {
        const [row] = await db.Query(
            "SELECT * FROM contacts WHERE email = $1",
            [email],
        );
        return row;
    }
    async delete(id) {
        const deleteOp = await db.Query("DELETE FROM contacts WHERE id = $1", [
            id,
        ]);
        return deleteOp;
    }
    async deleteAll() {
        const deleteOp = await db.Query("DELETE FROM contacts");
        return deleteOp;
    }
    async createcontact({ name, email, phone, category_id, category_name }) {
        const [row] = await db.Query(
            `INSERT INTO contacts (name, email, phone, category_id, category_name ) VALUES ($1 , $2, $3, $4, $5) RETURNING *`,
            [name, email, phone, category_id, category_name],
        );
        return row;
    }
    async updatecontact(id, { name, email, phone, category_id }) {
        const [row] = await db.Query(
            `UPDATE contacts SET name = $1, email = $2, phone = $3, category_id = $4 WHERE id = $5 RETURNING *`,
            [name, email, phone, category_id, id],
        );
        return row;
    }
}

module.exports = new concatRepository();
