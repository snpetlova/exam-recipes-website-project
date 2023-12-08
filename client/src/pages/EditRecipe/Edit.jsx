import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import editLeft from "../../assets/editLeft.jpg";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../context/AuthContext";
import { useCookies } from "react-cookie";
import Alert from "react-bootstrap/Alert";
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
  const [errors, setErrors] = useState({});
  const [cookies, _] = useCookies(["access_token"]);

  const validateRecipeName = (name) => {
    return name.length >= 5;
  };

  const isObjectEmpty = (obj) => {
    return Object.values(obj).every(value => !value);
  };
  
  const validateIngredients = (ingredients) => {
    return ingredients.length > 0 && ingredients.every(ingredient => !isObjectEmpty(ingredient));
  };

  const validateInstructions = (instructions) => {
    return instructions.length >= 20;
  };

  const validateCookingTime = (cookingTime) => {
    return cookingTime >= 0;
  };

  const validateImageUrl = (url) => {
    const isValidUrl = /^http(s)?:\/\/\S+\.\S+$/i.test(url);
    return isValidUrl;
  };

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
          `https://flavor-fiesta.vercel.app/recipes/${recipeId}`
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
    const newErrors = {};

    if (!validateRecipeName(editedRecipe.name)) {
      newErrors.recipeName = "Recipe name should be at least 5 symbols!";
    }

    if (!validateIngredients(editedRecipe.ingredients)) {
      newErrors.ingredients = "At least one ingredient is required!";
    }

    if (!validateInstructions(editedRecipe.instructions)) {
      newErrors.instructions = "Instructions should be at least 20 symbols!";
    }

    if (!validateCookingTime(editedRecipe.cookingTime)) {
      newErrors.cookingTime = "Cooking time is required!";
    }

    if (!validateImageUrl(editedRecipe.imageUrl)) {
      newErrors.imageUrl = "Invalid Image URL!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const userId = localStorage.getItem("userId");

      await axios.put(
        `https://flavor-fiesta.vercel.app/recipes/${recipeId}`,
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

    setErrors((prevErrors) => {
      return { ...prevErrors, ingredients: undefined };
    });
  };

  const handleAddIngredient = () => {
    setEditedRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, ""],
    }));
  
    setErrors((prevErrors) => {
      return { ...prevErrors, ingredients: undefined };
    });
  };

  const handleRemoveIngredient = (idx) => {
    setEditedRecipe((prevRecipe) => {
      const updatedIngredients = [...prevRecipe.ingredients];
      updatedIngredients.splice(idx, 1);
      return { ...prevRecipe, ingredients: updatedIngredients };
    });
  
    setErrors((prevErrors) => {
      return { ...prevErrors, ingredients: undefined };
    });
  };

  return (
    <div className="edit-container">
      <div className="leftSide">
        <img src={editLeft}></img>
      </div>
      <div className="rightSide">
        <h3>Edit Recipe</h3>
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
        {errors.imageUrl && (
          <Alert key="danger" variant="danger" className="alert-danger">
            <p className="error-message">{errors.imageUrl}</p>
          </Alert>
        )}
        {errors.cookingTime && (
          <Alert key="danger" variant="danger" className="alert-danger">
            <p className="error-message">{errors.cookingTime}</p>
          </Alert>
        )}
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

          <label htmlFor="imageUrl">Image URL:</label>
          <input
            id="imageUrl"
            name="imageUrl"
            value={editedRecipe.imageUrl}
            onChange={handleChange}
          />

          <label htmlFor="cookingTime">Cooking time:</label>
          <input
            id="cookingTime"
            name="cookingTime"
            value={editedRecipe.cookingTime}
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
