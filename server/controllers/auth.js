const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedpass = bcryptjs.hashSync(password, 10);

  const sameUsername = await User.findOne({ username });
  if (sameUsername) {
    return res.status(400).json({ message: "userName already taken" });
  }

  const sameEmail = await User.findOne({ email });
  if (sameEmail) {
    return res.status(400).json({ message: "Email already taken" });
  }

  try {
    const newUser = User({
      username,
      email,
      password: hashedpass,
    });
    await newUser.save();

    const { password: pass, ...info } = newUser._doc;
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(info);
  } catch (e) {
    res.status(400).json({ message: error.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const validUser = await User.findOne({ email });
  if (!validUser) {
    return res.status(400).json({ message: "User not exists" });
  }

  const validPassword = bcryptjs.compareSync(password, validUser.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Wrong Credentials" });
  }

  const { password: pass, ...info } = validUser._doc;

  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
  res.cookie("access_token", token, { httpOnly: true }).status(200).json(info);

  try {
  } catch (e) {
    res.status(400).json({ message: error.message });
  }
};

const google = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const { password: pass, ...info } = user._doc;

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(info);
    } else {
      const newPassword = Math.random().toString(36).slice(-8);
      const hashedpass = bcryptjs.hashSync(newPassword, 10);

      const newUser = User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedpass,
        avatar: req.body.photo,
      });

      await newUser.save();

      const { password: pass, ...info } = newUser._doc;
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(info);
    }
  } catch (e) {
    res.status(400).json({ message: error.message });
  }
};

const signout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    return res.status(200).json({ message: "User has been logged out!!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  signup,
  signin,
  google,
  signout,
};
