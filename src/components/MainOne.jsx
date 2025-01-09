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
      <div id="lander" className={isTransitioning ? "fade-out" : ""}>
        <p id="heading">Discovery Engine for Developers</p>
        <p id="sub-heading">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
          consectetur quos voluptas eius autem soluta!
        </p>
        <button onClick={handleRedirect}>Get Started</button>
      </div>

      <div id="cube" className={isTransitioning ? "zoom" : ""}>
        <video src={CubeVid} autoPlay muted loop playsInline></video>
      </div>
    </div>
  );
}
