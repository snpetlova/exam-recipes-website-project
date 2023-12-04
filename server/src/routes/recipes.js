import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

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
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  });
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
    user.savedRecipes.push(recipe._id);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

// Unsave a recipe for a user
router.delete("/", async (req, res) => {
  try {
    const recipe = await RecipesModel.findById(req.body.recipeId);
    const user = await UserModel.findById(req.body.userId);
    
    // Remove the recipe ID from the user's savedRecipes 
    user.savedRecipes = user.savedRecipes.filter(savedRecipeId => savedRecipeId.toString() !== req.body.recipeId);

    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

//Get id of the saved recipe
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

//Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

//Get recipes details
router.get("/:recipeId", async (req, res) => {
  try {
    const recipe = await RecipesModel.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all recipes created by a specific user
router.get('/recipes/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Use the find method to get all recipes with the specified userOwner
    const recipes = await RecipesModel.find({ userOwner: userId });

    res.json(recipes);
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Delete recipe
router.delete("/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await RecipesModel.findByIdAndDelete(
      req.params.recipeId
    );

    if (!deletedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully", deletedRecipe });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Edit recipe
router.put("/:recipeId", async (req, res) => {
  try {
    const updatedRecipe = await RecipesModel.findByIdAndUpdate(
      req.params.recipeId,
      req.body,
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe updated successfully", updatedRecipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as recipesRouter };
