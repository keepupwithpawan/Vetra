import React, { useState } from "react";
import "../styles/Footer.css";

export default function Footer() {
  const [rotating, setRotating] = useState(false);
  const [translated, setTranslated] = useState(false); // Track translation state
  const [showAsap, setShowAsap] = useState(false); // Track the visibility of ASAP

  const handleTopClick = () => {
    if (!rotating && !translated) {
      // First click: Rotate 180 degrees and translate to the left
      setRotating(true);
      setTranslated(true);

      // After the 180-degree rotation is complete, show the ASAP section
      setTimeout(() => {
        setShowAsap(true);
      }, 2000); // 2000ms corresponds to the animation time of 180-degree rotation
    } else if (rotating && translated) {
      // Second click: Perform full 360-degree rotation and translate back
      setRotating(false);
      setTranslated(false);
      setShowAsap(false); // Hide ASAP when resetting
    }
  };

  return (
    <>
      <div id="top">
        <h1
          className={`${rotating ? "rotate" : ""} ${translated ? "translate-left" : ""} ${!rotating && !translated ? "rotate-full" : ""}`}
          onClick={handleTopClick}
        >
          V
        </h1>
      </div>

      <div id="asap" className={showAsap ? "fade-in" : ""}>
        <h1>SAP</h1>
      </div>

      <div id="bottom">
        <div id="bottom-t">
          <p>© 2024 Vetra - All Rights Reserved</p>
          <div id="links">
            <ul>
              <li>LinkedIn</li>
              <li>Instagram</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>
        <div id="bottom-b">
          <h4>VETRA</h4>
        </div>
      </div>
    </>
  );
}
