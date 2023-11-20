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
    <div className="navbar1">
      <Link to="/" className="navbar-refs">Home</Link>

      {/* <Link to="/auth">Login/Register</Link> */}
      {!cookies.access_token ? (
        <>
          <Link to="/login"  className="navbar-refs">Login</Link>
          <Link to="/register"  className="navbar-refs">Register</Link>
        </>
      ) : (
        <>
          <Link to="/create-recipe"  className="navbar-refs">Create Recipe</Link>
          <Link to="/saved-recipes"  className="navbar-refs">Saved Recipes</Link>

          <button className="logout" onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
};
