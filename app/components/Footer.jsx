import React, { useState, useEffect } from "react";
import "../styles/Footer.css";

export default function Footer() {
  const [rotating, setRotating] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [showAsap, setShowAsap] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTopClick = () => {
    if (isMobile) return; // Disable animation on mobile
    if (!rotating && !translated) {
      setRotating(true);
      setTranslated(true);
      setTimeout(() => {
        setShowAsap(true);
      }, 2000);
    } else if (rotating && translated) {
      setRotating(false);
      setTranslated(false);
      setShowAsap(false);
    }
  };

  return (
    <>
      <div id="top">
        <h1
          className={
            isMobile
              ? ""
              : `${rotating ? "rotate" : ""} ${translated ? "translate-left" : ""} ${!rotating && !translated ? "rotate-full" : ""}`
          }
          onClick={handleTopClick}
        >
          V
        </h1>
      </div>

      {!isMobile && (
        <div id="asap" className={showAsap ? "fade-in" : ""}>
          <h1>SAP</h1>
        </div>
      )}

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
