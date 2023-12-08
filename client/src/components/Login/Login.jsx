import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import loginImg from "../../assets/loginImg.png";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../context/AuthContext";
import Alert from "react-bootstrap/Alert";
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const [_, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const { login } = useAuth();  

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://flavor-fiesta-fe.vercel.app/auth/login", {
        username,
        password,
      });

      setErrors({});

      setCookies("access_token", response.data.token);
      window.localStorage.setItem("userId", response.data.userId);
      login(response.data.user);
      navigate("/");
    } catch (error) {
      console.error(error);

      if (error.response) {
    
        const { data } = error.response;
        if (data.message === "User does not exist!") {
          // User does not exist
          setErrors({ userNotFound: "User does not exist. Please check your username." });
        } else if (data.message === "Username or password is incorrect!") {
          // Incorrect password
          setErrors({ incorrectPassword: "Incorrect password. Please try again." });
        } else {
          // Other server-related errors
          setErrors({ loginError: "Error during login. Please try again." });
        }
      } else {
        // Network error or other issues
        setErrors({ loginError: "Error during login. Please check your network connection." });
      }
  
    }
  };

  return (
    <div className="login">
      <div className="leftSide-login">  
        <img src={loginImg}></img>
      </div>
      <div className="rightSide-login">
        <div className="auth-container">
          <form onSubmit={onSubmit}>
            <h2 className="loginRegLabel">Login</h2>
            {errors.userNotFound && (
              <Alert key="danger" variant="danger" className="alert-danger">
                <p className="error-message">{errors.userNotFound}</p>
              </Alert>
            )}
            {errors.incorrectPassword && (
              <Alert key="danger" variant="danger" className="alert-danger">
                <p className="error-message">{errors.incorrectPassword}</p>
              </Alert>
            )}
            {errors.loginError && (
              <Alert key="danger" variant="danger" className="alert-danger">
                <p className="error-message">{errors.loginError}</p>
              </Alert>
            )}
            <div className="form-group">
              <label htmlFor="username" value={username}>
                Username:
              </label>
              <input
                type="text"
                id="username"
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" value={password}>
                Password:
              </label>
              <input
                type="password"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button type="submit" variant="dark" className="loginBtn">
              Login
            </Button>
            <p className="login-link">
              You don't have an account? 
              <Link
                style={{ textDecoration: "none", color: "rgb(198, 72, 16)" }}
                to="/register"
              >
                <span> Register</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
