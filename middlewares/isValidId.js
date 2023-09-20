const { isValidObjectId } = require("mongoose");
const { httpError } = require("../utils");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    const error = httpError({
      message: `${contactId} is not valid id`,
      status: 400,
    });

    next(error);
  }

  next();
};

module.exports = isValidId;
