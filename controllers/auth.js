const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { httpError } = require("../utils");
const { User } = require("../models/user");

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { password, email } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      email,
      password: hashPassword,
    });

    res
      .status(201)
      .json({ email: newUser.email, subscription: newUser.subscription });
  } catch (error) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      next(httpError({ message: "Email in use", status: 409 }));
    } else {
      next(httpError({ message: error.message, status: 400 }));
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw httpError({ message: "Email or password invalid", status: 401 });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw httpError({ message: "Email or password invalid", status: 401 });
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const subscription = async (req, res, next) => {
  const { subscription } = req.body;
  const { _id } = req.user;

  try {
    await User.findByIdAndUpdate(_id, { subscription });
    res.json({ subscription });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;

  try {
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json({ message: "Logout success" });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, current, logout, subscription };
