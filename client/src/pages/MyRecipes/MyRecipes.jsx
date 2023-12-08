import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { getUserId } from "../../hooks/getUserId";

const MyRecipes = () => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const userId = getUserId();

        const response = await axios.get(
          `https://flavor-fiesta-fe.vercel.app/recipes/recipes/${userId}`
        );
        setUserRecipes(response.data);
      } catch (error) {
        console.error("Error fetching user recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="box">
      <h1>Your Recipes</h1>
      {userRecipes.length === 0 ? (
        <p>You haven't created any recipes. Create now!</p>
      ) : (
        <Row xs={1} md={3} className="g-4">
          {userRecipes.map((recipe) => (
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
      )}

      <Button
        variant="dark"
        className="createBtn"
        style={{ "margin-top": "2em"}}
      >
        <Link
          to={`/create-recipe`}
          style={{ color: "white", textDecoration: "none" }}
        >
          Create Recipe
        </Link>
      </Button>
    </div>
  );
};

export default MyRecipes;
