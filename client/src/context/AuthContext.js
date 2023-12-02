import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const SET_USER = 'SET_USER';
const LOGOUT = 'LOGOUT';

const authReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload, isAuthenticated: true };
    case LOGOUT:
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load authentication state from localStorage on component mount
  useEffect(() => {
    const storedAuthState = localStorage.getItem('authState');
    if (storedAuthState) {
      dispatch({ type: SET_USER, payload: JSON.parse(storedAuthState) });
    }
  }, []);

  const login = (user) => {
    dispatch({ type: SET_USER, payload: user });
    // Save authentication state to localStorage
    localStorage.setItem('authState', JSON.stringify({ ...state, user }));
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
    // Remove authentication state from localStorage
    localStorage.removeItem('authState');
  };

  const navigate = useNavigate();

  // Check if there's a user in the initial state before redirecting
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');

    if (!state.isAuthenticated && !storedUserId) {
      navigate("/login");
    }
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
