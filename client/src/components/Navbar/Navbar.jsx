import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './Navbar.css';

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setCookies("access_token", "");
    window.localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="navbar1">
      <Link to="/" className="navbar-refs">Home</Link>

      {!cookies.access_token ? (
        <>
          <Link to="/login"  className="navbar-refs">Login</Link>
          <Link to="/register"  className="navbar-refs">Register</Link>
        </>
      ) : (
        <>
          <Link to="/create-recipe"  className="navbar-refs">Create Recipe</Link>
          <Link to="/saved-recipes"  className="navbar-refs">Saved Recipes</Link>

          <button className="logout" onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};
