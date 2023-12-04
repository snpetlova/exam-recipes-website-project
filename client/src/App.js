import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Create from "./pages/CreateRecipe/Create";
import Saved from "./pages/SavedRecipes/Saved";
import MyRecipes from "./pages/MyRecipes/MyRecipes";
import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { Details } from "./pages/RecipeDetails/Details";
import { Edit } from "./pages/EditRecipe/Edit";
import { NotFound } from "./components/404/404";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-recipe" element={<Create />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/saved-recipes" element={<Saved />} />
          <Route path="/recipes/:recipeId" element={<Details />} />
          <Route path="/recipes/:recipeId/edit" element={<Edit />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

