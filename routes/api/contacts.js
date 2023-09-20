const express = require("express");
const contact = require("../../controllers/contacts");
const { schema } = require("../../models/contact");
const {
  isValidId,
  validateBody,
  authenticate,
  isOwnerContact,
} = require("../../middlewares");

const router = express.Router();

router.get("/", authenticate, contact.list);

router.get(
  "/:contactId",
  authenticate,
  isValidId,
  isOwnerContact,
  contact.getById
);

router.post("/", authenticate, validateBody(schema.addContact), contact.add);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  isOwnerContact,
  validateBody(schema.updateContact),
  contact.update
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  isOwnerContact,
  validateBody(schema.updateFavorite),
  contact.updateFavorite
);

router.delete("/:contactId", authenticate, isValidId, contact.remove);

module.exports = router;
