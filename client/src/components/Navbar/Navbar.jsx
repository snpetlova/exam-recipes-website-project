import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
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
      <NavLink to="/" className="navbar-refs" activeClassName="active">Home</NavLink>

      {!cookies.access_token ? (
        <>
          <NavLink to="/login"  className="navbar-refs" activeClassName="active">Login</NavLink>
          <NavLink to="/register"  className="navbar-refs" activeClassName="active">Register</NavLink>
        </>
      ) : (
        <>
          <NavLink to="/create-recipe"  className="navbar-refs" activeClassName="active">Create Recipe</NavLink>
          <NavLink to="/my-recipes"  className="navbar-refs" activeClassName="active">My Recipes</NavLink>
          <NavLink to="/saved-recipes"  className="navbar-refs" activeClassName="active">Saved Recipes</NavLink>

          <button className="logout" onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};
