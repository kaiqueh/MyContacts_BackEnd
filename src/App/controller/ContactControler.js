const repositories = require("../repositories/ContactRepository");

class contactController {
    async index(req, res) {
        const contacts = await repositories.findall();

        res.json(contacts);
    }

    async show(req, res) {
        const { id } = req.params;

        const contact = await repositories.findbyId(id);

        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        return res.json(contact);
    }

    async store(req, res) {
        const { name, email, phone, category_id } = req.body;

        const emailExists = await repositories.findByEmail(email);

        if (!emailExists) {
            return res.status(400).json({ error: "Email already exists" });
        }

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const contact = await repositories.createcontact({
            name,
            email,
            phone,
            category_id,
        });

        res.json(contact);
    }

    async update(req, res) {
        const { id } = req.params;
        const { name, email, phone, category_id } = req.body;

        const contactExists = await repositories.findbyId(id);

        if (!contactExists) {
            return res.status(404).json({ error: "Contact not found" });
        }

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const constactemail = await repositories.findByEmail(email);

        if (constactemail && constactemail.id !== id) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const contact = await repositories.updatecontact(id, {
            name,
            email,
            phone,
            category_id,
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
}

module.exports = new contactController();
