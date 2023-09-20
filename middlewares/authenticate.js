const jwt = require("jsonwebtoken");
const { httpError } = require("../utils");
const models = require("../models/user");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(httpError({ status: 401, message: "Not authorized" }));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await models.User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(httpError({ status: 401, message: "Not authorized" }));
    }

    req.user = user;
    next();
  } catch {
    next(httpError({ status: 401, message: "Not authorized" }));
  }
};

module.exports = authenticate;
