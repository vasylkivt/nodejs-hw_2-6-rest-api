const jwt = require("jsonwebtoken");
const { HttpError } = require("../utils");
const User = require("../models/user");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(new HttpError({ status: 401, message: "Not authorized" }));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(new HttpError({ status: 401, message: "Not authorized" }));
    }

    req.user = user;
    next();
  } catch {
    console.log(342);
    next(new HttpError({ status: 401, message: "Not authorized" }));
  }
};

module.exports = authenticate;
