import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './Home.jsx'
import Info from './Info.jsx'
import Bookmarks from "./Bookmarks.jsx";

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<Home />} />
      <Route path="/info" element={<Info />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
    </Routes>
  </Router>
)
