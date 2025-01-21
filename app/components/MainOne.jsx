import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainOne.css";
import CubeVid from "../assets/cube-trans.webm";

export default function MainOne({ onTransition }) {
  const navigate = useNavigate(); // Hook for navigation

  const handleRedirect = () => {
    navigate("/home"); // Redirect to /home
  };

  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleScroll = (e) => {
    if (isTransitioning) return;

    if (e.deltaY > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        if (onTransition) onTransition(); // Ensure onTransition is called if defined
      }, 1500);
    }
  };

  return (
    <div
      id="main"
      className={`main-one ${isTransitioning ? "transitioning" : ""}`}
      onWheel={handleScroll}
    >
      <div id="lander-container">
        <div id="lander-img">

        </div>
        <div id="lander" className={isTransitioning ? "fade-out" : ""}>
          <p id="heading">From Exploration to Execution</p>
          <p id="sub-heading">
            Discover designs, explore source code, and customize instantly. Vetra makes your ideas actionable!
          </p>
          <button onClick={handleRedirect}>Get Started</button>
        </div>
      </div>
    </div>
  );
}
