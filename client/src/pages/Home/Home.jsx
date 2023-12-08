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
import "./Home.css";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);

  const userId = getUserId();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("https://flavor-fiesta-fe.vercel.app/recipes");
        setRecipes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://flavor-fiesta-fe.vercel.app/recipes/savedRecipes/ids/${userId}`
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
        "https://flavor-fiesta-fe.vercel.app/recipes",
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
      const response = await axios.delete("https://flavor-fiesta-fe.vercel.app/recipes", {
        data: { recipeId, userId },
        headers: { authorization: cookies.access_token },
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) =>
    Array.isArray(savedRecipes) && savedRecipes.includes(id);

  const isLoggedIn = window.localStorage.getItem("userId") !== null;

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

        <Row xs={1} md={3} className="g-4">
          {recipes.map((recipe) => (
            <Col key={recipe._id}>
              <Card>
                <Card.Img variant="top" src={recipe.imageUrl} />
                <Card.Body>
                  <Card.Title
                    style={{
                      height: "30px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {recipe.name}
                  </Card.Title>
                  <p>Cooking Time: {recipe.cookingTime} minutes</p>
                  {isLoggedIn && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        if (isRecipeSaved(recipe._id)) {
                          unsaveRecipe(recipe._id);
                        } else {
                          saveRecipe(recipe._id);
                        }
                      }}
                    >
                      {isRecipeSaved(recipe._id) ? "Unsave" : "Save"}
                    </Button>
                  )}

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
    </div>
  );
};

export default Home;
