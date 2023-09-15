const express = require("express");
const contact = require("../../controllers/contacts");
const schema = require("../../models/contact");
const { isValidId, validateBody } = require("../../middlewares");

const router = express.Router();

router.get("/", contact.list);

router.get("/:contactId", isValidId, contact.getById);

router.post("/", validateBody(schema.addContact), contact.add);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schema.updateContact),
  contact.update
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schema.updateFavorite),
  contact.updateFavorite
);

router.delete("/:contactId", isValidId, contact.remove);

module.exports = router;
