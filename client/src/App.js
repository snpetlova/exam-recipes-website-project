import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Create from "./pages/Create";
import AllRecipes from "./pages/AllRecipes";
import Saved from "./pages/Saved";
import { Navbar } from './components/Navbar';
import { Login } from "./components/Login";
import { Register } from "./components/Register";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-recipes" element={<AllRecipes />} />
          {/* <Route path="/auth" element={<Auth />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-recipe" element={<Create />} />
          <Route path="/saved-recipes" element={<Saved />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
