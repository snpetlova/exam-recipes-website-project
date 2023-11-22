import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router(); //creates an instance of an express router

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, email, password: hashedPassword });
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

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// const verifyToken = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   jwt.verify(token, 'secret', (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Forbidden' });
//     }

//     req.user = user;
//     next();
//   });
// };
