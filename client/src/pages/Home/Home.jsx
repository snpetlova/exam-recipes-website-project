import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserId } from "../../hooks/getUserId";
import { useCookies } from "react-cookie";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import landing from "../../assets/landing.jpg";
import welcome from "../../assets/welcome.jpg";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import './Home.css';

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);

  const userId = getUserId();

  useEffect(() => {
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

    fetchRecipes();
    fetchSavedRecipes();
  }, []);

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

  const isRecipeSaved = (id) =>
    Array.isArray(savedRecipes) && savedRecipes.includes(id);

  return (
    <div className="welcome">
      <Card style={{ border: "none" }}>
        <Card.Img src={landing} alt="Card image" className="landing" />
        <Card.Img src={welcome} alt="Card image" className="welcome" />
        <Card.ImgOverlay></Card.ImgOverlay>
        <Card.Text></Card.Text>
      </Card>
      <div className="box">
        <h1>Recipes</h1>
        {/* <div>
      <ul className="recipe-cards">
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>  
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} minutes</p>
          </li>
        ))}
      </ul>
    </div> */}

        <Row xs={1} md={3} className="g-4">
          {recipes.map((recipe) => (
            <Col key={recipe._id}>
              <Card>
                <Card.Img variant="top" src={recipe.imageUrl} />
                <Card.Body>
                  <Card.Title>{recipe.name}</Card.Title>
                  <p>Cooking Time: {recipe.cookingTime} minutes</p>
                  <Button
                    variant="secondary"
                    onClick={() => saveRecipe(recipe._id)}
                    disabled={isRecipeSaved(recipe._id)}
                  >
                    {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                  </Button>
                  <Button variant="primary" className="detailsBtn">
                    <Link to={`/recipes/${recipe._id}`} style={{ color: 'white', textDecoration: 'none' }}>Details</Link>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Home;
