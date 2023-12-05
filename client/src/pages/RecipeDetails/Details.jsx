import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./Details.css";

export const Details = (onDelete) => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isRecipeBeingSaved, setIsRecipeBeingSaved] = useState(false);
  const [cookies, _] = useCookies(["access_token"]);

  const userId = localStorage.getItem("userId");
  const currentUser = { _id: userId };

  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/recipes");
      setRecipes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/recipes/savedRecipes/ids/${userId}`
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRecipeDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/recipes/${recipeId}`
      );
      setRecipe(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchSavedRecipes();
    fetchRecipeDetails();
  }, [recipeId]);

  useEffect(() => {
    if (savedRecipes) {
      setIsRecipeBeingSaved(savedRecipes.includes(recipeId));
    }
  }, [savedRecipes, recipeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>No recipes found.</div>;
  }

  const saveRecipe = async (recipeId) => {
    try {
      const response = await axios.put(
        "http://localhost:3001/recipes",
        {
          recipeId,
          userId,
        },
        { headers: { authorization: cookies.access_token } }
      );

      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const unsaveRecipe = async (recipeId) => {
    try {
      const response = await axios.delete("http://localhost:3001/recipes", {
        data: { recipeId, userId },
        headers: { authorization: cookies.access_token },
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveClick = () => {
    if (isRecipeBeingSaved) {
      unsaveRecipe(recipeId);
    } else {
      saveRecipe(recipeId);
    }
  };

  const isOwner = currentUser._id === recipe.userOwner;

  const handleDelete = async (recipeIdToDelete) => {
    try {
      const userId = localStorage.getItem("userId");
      setDeleting(true);

      await axios.delete(`http://localhost:3001/recipes/${recipeIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: { userId },
      });
      alert("Deleted succesfully!");
      navigate("/");

      onDelete();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const isLoggedIn = window.localStorage.getItem("userId") !== null;

  return (
    <div className="recipe-details-container">
      <Button variant="secondary" className="goBackBtn" onClick={handleGoBack}>
        ← Go Back
      </Button>
      <Card style={{ width: "1000px" }} border="0">
        <div className="recipe-details-content">
          <div className="recipe-details-image">
            <Card.Img
              variant="top"
              src={recipe.imageUrl}
              alt={recipe.name}
              style={{
                height: "400px",
                width: "550px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
          <div className="recipe-details-info">
            <Card.Body>
              <div className="heart-and-title">
                {isLoggedIn && (
                  <Button
                    variant="link"
                    className="saveBtn"
                    onClick={handleSaveClick}
                  >
                    {isRecipeBeingSaved ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </Button>
                )}
                <Card.Title style={{ fontSize: "30px", marginBottom: "30px" }}>
                  {recipe.name}
                </Card.Title>
              </div>
              <Card.Text>
                <span style={{ fontWeight: "bold" }}>Ingredients: </span>
                {recipe.ingredients.join(", ")}
              </Card.Text>
              <Card.Text>
                <span style={{ fontWeight: "bold" }}>Instructions: </span>
                {recipe.instructions}
              </Card.Text>

              <Card.Text>
                <span style={{ fontWeight: "bold" }}>Cooking time: </span>
                {recipe.cookingTime} minutes
              </Card.Text>

              {isOwner && (
                <Button variant="primary" className="editBtn">
                  <Link
                    to={`/recipes/${recipe._id}/edit`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                </Button>
              )}
              {isOwner && (
                <Button
                  variant="danger"
                  className="deleteBtn"
                  onClick={() => handleDelete(recipeId)}
                >
                  Delete
                </Button>
              )}
            </Card.Body>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Details;
