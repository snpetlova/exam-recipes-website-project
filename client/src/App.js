import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Create from "./pages/Create";
import Saved from "./pages/Saved";
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Login } from "./components/Login";
import { Register } from "./components/Register";
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/auth" element={<Auth />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-recipe" element={<Create />} />
          <Route path="/saved-recipes" element={<Saved />} />
        </Routes>
        <Footer />
      </Router> 
    </div>
  );
}

export default App;
