import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './Details.css';

export const Details = (onDelete) => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const userId = localStorage.getItem("userId");
  const currentUser = { _id: userId };

  const navigate = useNavigate();

  useEffect(() => {
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

    fetchRecipeDetails();
  }, [recipeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>No recipe found</div>;
  }

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

  return (
    <div className="recipe-details-container">
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
              <Card.Title style={{ fontSize: "30px", marginBottom: "30px" }}>
                {recipe.name}
              </Card.Title>
              <Card.Text>
                Ingredients: {recipe.ingredients.join(", ")}
              </Card.Text>
              <Card.Text>Instructions: {recipe.instructions}</Card.Text>
              <Card.Text>Cooking time: {recipe.cookingTime} minutes</Card.Text>
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
