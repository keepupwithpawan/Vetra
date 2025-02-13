import React, { useState } from "react";
import { useRouter } from "next/navigation"
import "../styles/MainOne.css";

export default function MainOne() {
  const navigate = useRouter(); // Hook for navigation

  const handleRedirect = () => {
    navigate.push("/signup"); // Redirect to /home
  };

  return (
    <div
      id="main"
    >
      <div id="lander-container">
        {/* Video as background */}
        <video src="https://res.cloudinary.com/dwkbeovcw/video/upload/v1737741388/Lander-Shapes_pz1wv4.mp4" autoPlay muted loop></video>

        <div id="lander">
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
