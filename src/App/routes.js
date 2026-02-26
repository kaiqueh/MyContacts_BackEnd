const { Router } = require("express");
const contactController = require("./controller/contactcontroler");
const router = Router();

router.get("/contacts", contactController.index);
router.get("/contacts/:id", contactController.show);
router.delete("/contacts/:id", contactController.delete);
router.delete("/contacts", contactController.deleteAll);
router.post("/contacts", contactController.store);
router.put("/contacts/:id", contactController.update);

module.exports = router;
