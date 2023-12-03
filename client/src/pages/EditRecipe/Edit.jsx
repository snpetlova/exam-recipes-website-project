import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import editLeft from "../../assets/editLeft.jpg";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../context/AuthContext";
import "./Edit.css";

export const Edit = ({ onEdit }) => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();

  const [editedRecipe, setEditedRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    const storedUserId = localStorage.getItem("userId");
    if (!state.isAuthenticated && !storedUserId) {
      navigate("/login");
    }
  }, [state.isAuthenticated]);

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/${recipeId}`
        );

        // Check if the authenticated user is the owner of the recipe
        const storedUserId = localStorage.getItem("userId");
        const storedUserOwner = response.data.userOwner;
        if (storedUserId !== storedUserOwner) {
          // Redirect to unauthorized page or handle unauthorized access
          navigate("/404");
        }

        setEditedRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    fetchRecipeData();
  }, [recipeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId");

      await axios.put(
        `http://localhost:3001/recipes/${recipeId}`,
        editedRecipe,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          data: { userId },
        }
      );

      alert("Edited succesfully!");
      navigate(`/recipes/${recipeId}`);
      onEdit();
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const handleIngredientChange = (e, idx) => {
    const { value } = e.target;
    setEditedRecipe((prevRecipe) => {
      const updatedIngredients = [...prevRecipe.ingredients];
      updatedIngredients[idx] = value;
      return { ...prevRecipe, ingredients: updatedIngredients };
    });
  };

  const handleAddIngredient = () => {
    setEditedRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, ""],
    }));
  };

  const handleRemoveIngredient = (idx) => {
    setEditedRecipe((prevRecipe) => {
      const updatedIngredients = [...prevRecipe.ingredients];
      updatedIngredients.splice(idx, 1);
      return { ...prevRecipe, ingredients: updatedIngredients };
    });
  };

  return (
    <div className="edit-container">
      <div className="leftSide">
        <img src={editLeft}></img>
      </div>
      <div className="rightSide">
        <h3>Edit Recipe</h3>
        <form className="editForm" onSubmit={handleEdit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editedRecipe.name}
            onChange={handleChange}
          />

          <label htmlFor="ingredients">Ingredients</label>
          {editedRecipe.ingredients.map((ingredient, idx) => (
            <div key={idx}>
              <input
                type="text"
                name="ingredients"
                value={ingredient}
                onChange={(e) => handleIngredientChange(e, idx)}
              />
              <Button
                variant="outline-danger"
                className="ingredientsBtn-remove"
                onClick={() => handleRemoveIngredient(idx)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            className="ingredientsBtn"
            onClick={handleAddIngredient}
          >
            Add Ingredient
          </Button>

          <label htmlFor="instructions">Instructions:</label>
          <textarea
            id="instructions"
            name="instructions"
            value={editedRecipe.instructions}
            onChange={handleChange}
          />

          <label htmlFor="cookingTime">Cooking time:</label>
          <input
            id="cookingTime"
            name="cookingTime"
            value={editedRecipe.cookingTime}
            onChange={handleChange}
          />

          <label htmlFor="imageUrl">Image URL:</label>
          <input
            id="imageUrl"
            name="imageUrl"
            value={editedRecipe.imageUrl}
            onChange={handleChange}
          />
          <Button type="sumbit" variant="dark" className="submitBtn">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
