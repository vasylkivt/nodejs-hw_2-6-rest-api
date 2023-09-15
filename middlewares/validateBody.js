const validateBody = (schema) => {
  const foo = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }
    next();
  };

  return foo;
};

module.exports = validateBody;
