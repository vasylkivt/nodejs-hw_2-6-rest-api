const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const bcrypt = require("bcrypt");
const { HttpError } = require("../utils");
const fs = require("fs/promises");
const User = require("../models/user");
const gravatar = require("gravatar");
const path = require("path");

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  const { password, email } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  try {
    const newUser = await User.create({
      email,
      password: hashPassword,
      avatarURL,
    });

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      next(new HttpError({ message: "Email in use", status: 409 }));
    } else {
      next(new HttpError({ message: error.message, status: 400 }));
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new HttpError({
        message: "Email or password invalid",
        status: 401,
      });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw new HttpError({
        message: "Email or password invalid",
        status: 401,
      });
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

const avatar = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const { path: tempUpload, originalname } = req.file;

    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, fileName);

    const img = await Jimp.read(tempUpload);
    await img
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(tempUpload);

    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", fileName);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL });
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

module.exports = { register, login, current, logout, subscription, avatar };
