import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <Link to="/">Home</Link>

      {/* <Link to="/auth">Login/Register</Link> */}
      {!cookies.access_token ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Link to="/create-recipe">Create Recipe</Link>
          <Link to="/saved-recipes">Saved Recipes</Link>

          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
};
