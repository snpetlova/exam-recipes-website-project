import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

export const Details = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

 // const { user } = useContext(AuthContext); TODO

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
  };

  // const isOwner = user && recipe.userOwner && user.id === recipe.userOwner.id; TODD

  return (
    <div className="recipe-details-container">
      <Card style={{ width: "1000px",  }} border="0">
        <div className="recipe-details-content">
          <div className="recipe-details-image">
            <Card.Img
              variant="top"
              src={recipe.imageUrl}
              alt={recipe.name}
              style={{
                height: "400px",
                width: '550px',
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
          <div className="recipe-details-info">
            <Card.Body>
              <Card.Title style={{ fontSize: '30px', marginBottom: '30px' }}>{recipe.name}</Card.Title>
              <Card.Text>Instructions: {recipe.instructions}</Card.Text>
              <Card.Text>
                Ingredients: {recipe.ingredients.join(", ")}
              </Card.Text>
              <Card.Text>Cooking time: {recipe.cookingTime} minutes</Card.Text>
              {/* {isOwner && (<Button variant="primary" className="editBtn">Edit</Button> )}
              {isOwner && (<Button variant="danger" className="deleteBtn">Delete</Button> )} */}
            </Card.Body>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Details;
