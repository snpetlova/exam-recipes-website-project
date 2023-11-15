import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router(); //creates an instance of an express router

router.post("/register", async (req, res) => {
  const { username, password } = req.body; //TODO Add more requierments

  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();

  res.json({ message: "Registration was successful!" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body; //TODO Add more requierments

  const user = await UserModel.findOne({ username });

  if (!user) {
    return res.json({ message: "User does not exist!" });
  }

  const isPassValid = await bcrypt.compare(password, user.password);

  if (!isPassValid) {
    return res.json({ message: "Username or password is incorrect!" });
  }

  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, userId: user._id });
});

export { router as userRouter };
