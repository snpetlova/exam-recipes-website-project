import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserId } from "../../hooks/getUserId";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Button from "react-bootstrap/Button";
import dishesLeft from "../../assets/dishesLeft.jpg";
import { useAuth } from "../../context/AuthContext";
import "./Create.css";

function Create() {
  const navigate = useNavigate();
  const { state } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!state.isAuthenticated) {
      navigate("/login");
    }
  }, [state.isAuthenticated, navigate]);

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
