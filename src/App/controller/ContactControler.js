const repositories = require("../repositories/ContactRepository");
const ValidUUID = require("../Utils/ValidUUID");

class contactController {
    async index(req, res) {
        const { orderBy } = req.query;
        const contacts = await repositories.findall(orderBy);
        res.json(contacts);
    }

    async show(req, res) {
        const { id } = req.params;

        if (ValidUUID(id)) {
            return res.status(400).json({ error: "Id invalid" });
        }

        const contact = await repositories.findbyId(id);

        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        return res.json(contact);
    }

    async store(req, res) {
        const { name, email, phone, category_id, category_name } = req.body;

        if (category_id && !ValidUUID(category_id)) {
            return res.status(400).json({ error: "invalid category" });
        }

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        if (email) {
            const emailExists = await repositories.findByEmail(email);
            if (emailExists) {
                return res.status(400).json({ error: "Email already exists" });
            }
        }

        const contact = await repositories.createcontact({
            name,
            email: email || null,
            phone,
            category_id: category_id || null,
            category_name,
        });

        res.json(contact);
    }

    async update(req, res) {
        const { id } = req.params;
        const { name, email, phone, category_id } = req.body;

        if (category_id && !ValidUUID(category_id)) {
            return res.status(400).json({ error: "invalid category" });
        }

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const contactExists = await repositories.findbyId(id);

        if (!contactExists) {
            return res.status(404).json({ error: "Contact not found" });
        }

        const constactemail = await repositories.findByEmail(email);

        if (constactemail && constactemail.id !== id) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const contact = await repositories.updatecontact(id, {
            name,
            email,
            phone,
            category_id: category_id || null,
        });

        res.json(contact);
    }

    async delete(req, res) {
        const { id } = req.params;

        const contact = await repositories.findbyId(id);
        console.log(contact);

        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        await repositories.delete(id);
        return res.sendStatus(204);
    }

    async deleteAll(req, res) {
        await repositories.deleteAll();
        return res.sendStatus(204);
    }
}

module.exports = new contactController();
