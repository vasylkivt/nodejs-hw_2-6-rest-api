const { httpError } = require("../utils");

const validateBody = (schema) => {
  const foo = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(
        httpError({
          message: error.message,
          status: 400,
        })
      );
    }

    next();
  };

  return foo;
};

module.exports = validateBody;
