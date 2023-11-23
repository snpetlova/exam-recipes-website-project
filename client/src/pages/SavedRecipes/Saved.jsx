import React, { useEffect, useState } from "react";
import { getUserId } from "../../hooks/getUserId";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Saved.css";

function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);
  const userId = getUserId();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/${userId}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSavedRecipes();
  }, []);

  const unsaveRecipe = async (recipeId) => {
    try {
      const response = await axios.delete("http://localhost:3001/recipes", {
        data: { recipeId, userId },
        headers: { authorization: cookies.access_token },
      });

      setSavedRecipes(savedRecipes.filter((recipe) => recipe._id !== recipeId));
      
    } catch (err) {
      console.error("Error unsaving recipe:", err);
    }
  };

  return (
    <div className="box">
      <h1>Saved Recipes</h1>
      <Row xs={1} md={3} className="g-4">
        {savedRecipes.map((recipe) => (
          <Col key={recipe._id}>
            <Card>
              <Card.Img variant="top" src={recipe.imageUrl} />
              <Card.Body>
                <Card.Title>{recipe.name}</Card.Title>
                <p>Cooking Time: {recipe.cookingTime} minutes</p>
                <Button
                  variant="secondary"
                  className="unsave-btn"
                  onClick={() => unsaveRecipe(recipe._id)}
                >
                  Unsave
                </Button>
                <Button variant="primary" className="detailsBtn">
                  <Link
                    to={`/recipes/${recipe._id}`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Details
                  </Link>
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Saved;
