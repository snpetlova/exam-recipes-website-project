import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserId } from "../../hooks/getUserId";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Button from "react-bootstrap/Button";
import dishesLeft from "../../assets/dishesLeft.jpg";
import { useAuth } from "../../context/AuthContext";
import Alert from "react-bootstrap/Alert";
import "./Create.css";

function Create() {
  const navigate = useNavigate();
  const { state } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    const storedUserId = localStorage.getItem("userId");
    if (!state.isAuthenticated && !storedUserId) {
      navigate("/login");
    }
  }, [state.isAuthenticated]);

  const userId = getUserId();

  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userId,
  });
  const [cookies, _] = useCookies(["access_token"]);
  const [errors, setErrors] = useState({});

  const validateRecipeName = (name) => {
    return name.length >= 5;
  };

  const validateIngredients = (ingredients) => {
    return ingredients.length > 0;
  };

  const validateInstructions = (instructions) => {
    return instructions.length >= 20;
  };

  const validateCookingTime = (cookingTime) => {
    return cookingTime.length > 0;
  };

  const validateImageUrl = (url) => {
    const isValidUrl = /^http(s)?:\/\/\S+\.\S+$/i.test(url);
    return isValidUrl;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (e, idx) => {
    const { value } = e.target;
    const ingredients = recipe.ingredients;
    ingredients[idx] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] }); ///keeping the object the same with the spread op, changes only on ingredients
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateRecipeName(recipe.name)) {
      newErrors.recipeName = "Recipe name should be at least 5 symbols!";
    }

    if (!validateIngredients(recipe.ingredients)) {
      newErrors.ingredients = "At least one ingredient is required!";
    }

    if (!validateInstructions(recipe.instructions)) {
      newErrors.instructions = "Instructions should be at least 20 symbols!";
    }

    if (!validateCookingTime(recipe.cookingTime)) {
      newErrors.cookingTime = "Cooking time is required!";
    }

    if (!validateImageUrl(recipe.imageUrl)) {
      newErrors.imageUrl = "Invalid Image URL!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:3001/recipes", recipe, {
        headers: { authorization: cookies.access_token },
      });
      alert("Recipe Created!");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-recipe">
      <div className="leftSide">
        <img src={dishesLeft}></img>
      </div>
      <div className="rightSide">
        <h3>Create Recipe</h3>
        {errors.recipeName && (
          <Alert key="danger" variant="danger" className="alert-danger">
            <p className="error-message">{errors.recipeName}</p>
          </Alert>
        )}
        {errors.ingredients && (
          <Alert key="danger" variant="danger" className="alert-danger">
            <p className="error-message">{errors.ingredients}</p>
          </Alert>
        )}
        {errors.instructions && (
          <Alert key="danger" variant="danger" className="alert-danger">
            <p className="error-message">{errors.instructions}</p>
          </Alert>
        )}
        {errors.cookingTime && (
          <Alert key="danger" variant="danger" className="alert-danger">
            <p className="error-message">{errors.cookingTime}</p>
          </Alert>
        )}
        {errors.imageUrl && (
          <Alert key="danger" variant="danger" className="alert-danger">
            <p className="error-message">{errors.imageUrl}</p>
          </Alert>
        )}
        <form className="createForm" onSubmit={onSubmit}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" onChange={handleChange} />
          <label htmlFor="ingredients">Ingredients</label>
          {recipe.ingredients.map((ingredient, idx) => (
            <input
              key={idx}
              type="text"
              name="ingredients"
              value={ingredient}
              onChange={(e) => handleIngredientChange(e, idx)}
            />
          ))}
          <Button
            variant="secondary"
            className="ingredientsBtn"
            onClick={addIngredient}
          >
            Add Ingredient
          </Button>

          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            onChange={handleChange}
          ></textarea>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            onChange={handleChange}
          />
          <label htmlFor="cookingTime">Cooking Time (Minutes)</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            onChange={handleChange}
          />
          <Button type="sumbit" variant="dark" className="submitBtn">
            Create Recipe
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Create;
