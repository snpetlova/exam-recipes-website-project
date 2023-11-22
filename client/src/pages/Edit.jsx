import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export const Edit = ({ onEdit }) => {
  const { recipeId } = useParams();
  const navigate = useNavigate();

  const [editedRecipe, setEditedRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
  });

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/${recipeId}`
        );
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

  return (
    <div>
      <form id="edit" onSubmit={handleEdit}>
        <div className="container-edit">
          <h1>Edit Recipe</h1>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editedRecipe.name}
            onChange={handleChange}
          />

          <label htmlFor="ingredients">Ingredients:</label>
          <input
            id="ingredients"
            name="ingredients"
            value={editedRecipe.ingredients}
            onChange={handleChange}
          />

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

          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
