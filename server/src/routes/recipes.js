import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await RecipesModel.find({});
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

//Create new recipe
router.post("/", async (req, res) => {
    const recipe = new RecipesModel(...req.body);
  try {
    const response = await recipe.save();
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

export { router as recipesRouter };
