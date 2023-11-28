import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import registerImg from "../../assets/registerImg.png";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./Register.css";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/auth/register", {
        username,
        email,
        password,
      });

      alert("Registration Completed! Welcome to Flavor Fiesta! Now you should login!");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="register">
      <div className="leftSide-register">
        <img src={registerImg} alt="1" />
      </div>
      <div className="rightSide-register">
        <div className="auth-container">
          <form onSubmit={onSubmit}>
            <h2 className="loginRegLabel">Register</h2>
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
              <label htmlFor="email" value={email}>
                Email:
              </label>
              <input
                type="text"
                id="email"
                onChange={(event) => setEmail(event.target.value)}
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
            <Button type="sumbit" variant="dark" className="registerBtn">
              Register
            </Button>
            <p className="register-link">
              You have an account?
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to="/login"
              >
                <span> Log in</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
