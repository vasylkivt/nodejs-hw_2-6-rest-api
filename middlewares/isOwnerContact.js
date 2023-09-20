const jwt = require("jsonwebtoken");
const { httpError } = require("../utils");
const { Contact } = require("../models/contact");
const { SECRET_KEY } = process.env;

const isOwnerContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findById(contactId);

    if (!contact) {
      throw httpError({ message: "Not found", status: 404 });
    }

    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
      next(httpError({ status: 401, message: "Not authorized" }));
    }
    const { id } = jwt.verify(token, SECRET_KEY);

    const stringContactId = contact.owner.toString();

    if (id !== stringContactId) {
      next(httpError({ status: 401, message: "Not authorized" }));
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isOwnerContact;
