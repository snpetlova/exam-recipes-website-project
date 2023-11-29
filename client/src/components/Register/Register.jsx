import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import registerImg from "../../assets/registerImg.png";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./Register.css";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const navigate = useNavigate();

  const validateUsername = (username) => {
    return username.length > 5;
  };

  const validateEmail = (email) => {
    const doesEmailMatch = /^\S+@\S+\.\S+$/;
    return doesEmailMatch.test(email);
  };

  const validatePassword = (password) => {
    return password.length > 8;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateUsername(username)) {
      newErrors.username = "Username should be at least 5 symbols!";
    }

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email address!";
    }

    if (!validatePassword(password)) {
      newErrors.password = "Password should be at least 8 symbols!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:3001/auth/register", {
        username,
        email,
        password,
      });

      alert(
        "Registration Completed! Welcome to Flavor Fiesta! Now you should login!"
      );
      navigate("/login");
      setErrors({});
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
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  required
                  id="username"
                  onChange={(event) => setUsername(event.target.value)}
                  isInvalid={errors.username ? true : false}
                />
                <Form.Control.Feedback
                  type="invalid"
                  className="error-message-container"
                >
                  {errors.username && (
                    <p className="error-message">{errors.username}</p>
                  )}
                </Form.Control.Feedback>
              </InputGroup>
            </div>
            <div className="form-group">
              <label htmlFor="email" value={email}>
                Email:
              </label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  required
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  isInvalid={errors.email ? true : false}
                />
                <Form.Control.Feedback
                  type="invalid"
                  className="error-message-container"
                >
                  {errors.email && (
                    <p className="error-message">{errors.email}</p>
                  )}
                </Form.Control.Feedback>
              </InputGroup>
            </div>
            <div className="form-group">
              <label htmlFor="password" value={password}>
                Password:
              </label>
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  required
                  id="password"
                  onChange={(event) => setPassword(event.target.value)}
                  isInvalid={errors.password ? true : false}
                />
                <Form.Control.Feedback
                  type="invalid"
                  className="error-message-container"
                >
                  {errors.password && (
                    <p className="error-message">{errors.password}</p>
                  )}
                </Form.Control.Feedback>
              </InputGroup>
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
