import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { userRouter } from './routes/users.js';
import { recipesRouter } from './routes/recipes.js';

const app = express();

app.use(express.json()); //converts data from the front-end to json
app.use(cors()); //restrict web pages from making requests to a different domain than the one that served the web page

app.use('/auth', userRouter);
app.use('/recipes', recipesRouter); 

const dbUsername = encodeURIComponent("snpetlova")
const dbPassword = encodeURIComponent("projectPassword123")
mongoose.connect(
  `mongodb+srv://${dbUsername}:${dbPassword}@recepies.b2ae3ky.mongodb.net/recepies?retryWrites=true&w=majority`
);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
