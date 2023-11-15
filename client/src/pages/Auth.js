import React from "react";
import { Register } from "../components/Register";
import { Login } from "../components/Login";

function Auth() {
  return (
    <div className="auth">
      <Login />
      <Register />
    </div>
  );
}

export const Form = ({
  username,
  setUsername,
  password,
  setPassword,
  label,
  onSubmit,
}) => {
  return (
    <div className="auth-container">
      <form onSubmit={onSubmit}>
        <h2>{label}</h2>
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
        <button type="submit">{label}</button>
      </form>
    </div>
  );
};

export default Auth;
