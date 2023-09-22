const { HttpError } = require("../utils");

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    next(
      new HttpError({
        message: error.message,
        status: 400,
      })
    );
  }

  next();
};

module.exports = validateBody;
