import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";

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

//Save recipe to a certain user
router.put("/", async (req, res) => {
  try {
    const recipe = await RecipesModel.findById(req.body.recipeId);
    const user = await UserModel.findById(req.body.userId);
    user.savedRecipes.push(recipe);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

//Get id of the saved recipe
router.get("/savedRecipes/ids", async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    res.json({savedRecipes: user?.savedRecipes});
  } catch (error) {
    res.json(error);
  }
});

//Get saved recipes
router.get("/savedRecipes", async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes}
    })
    res.json({savedRecipes});
  } catch (error) {
    res.json(error);
  }
})

export { router as recipesRouter };
