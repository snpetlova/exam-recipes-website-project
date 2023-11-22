import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Saved from "./pages/Saved";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Details } from "./pages/Details";
import { Edit } from "./pages/Edit";
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-recipe" element={<Create />} />
          <Route path="/saved-recipes" element={<Saved />} />
          <Route path="/recipes/:recipeId" element={<Details />} />
          <Route path="/recipes/:recipeId/edit" element={<Edit />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
