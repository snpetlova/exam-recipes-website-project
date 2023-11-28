import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import loginImg from "../../assets/loginImg.png";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../context/AuthContext";
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [_, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const { login } = useAuth();  

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      setCookies("access_token", response.data.token);
      window.localStorage.setItem("userId", response.data.userId);
      login(response.data.user);
      navigate("/");
    } catch (error) {
      console.error(error);
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
            <Button type="sumbit" variant="dark" className="loginBtn">
              Login
            </Button>
            <p className="login-link">
              You don't have an account? 
              <Link
                style={{ textDecoration: "none", color: "black" }}
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
