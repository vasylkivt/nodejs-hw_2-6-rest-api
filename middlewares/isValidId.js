const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../utils");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    const error = new HttpError({
      message: `${contactId} is not valid id`,
      status: 400,
    });

    next(error);
  }

  next();
};

module.exports = isValidId;
