// App.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar';
import MainOne from './components/MainOne';
import MainTwo from './components/MainTwo';
import Footer from './components/Footer';
import SignIn from "./SignIn"

function App() {
  // const [currentView, setCurrentView] = useState(1);
  // const [isFading, setIsFading] = useState(false);
  // const [showLoading, setShowLoading] = useState(false);
  // const [loadingProgress, setLoadingProgress] = useState(0);
  // const [letterVisibility, setLetterVisibility] = useState([0, 0, 0, 0, 0]);
  // const [showFlash, setShowFlash] = useState(false);
  // const [showWhiteOverlay, setShowWhiteOverlay] = useState(false);

  // const location = useLocation();

  // useEffect(() => {
  //   if (location.pathname === "/") {
  //     setShowLoading(true);
  //     const interval = setInterval(() => {
  //       setLoadingProgress((prev) => {
  //         if (prev >= 100) {
  //           clearInterval(interval);
  //           handleLoadingComplete();
  //           return 100;
  //         }
          
  //         const newLetterVisibility = [
  //           Math.min(100, prev * 5),
  //           Math.max(0, Math.min(100, (prev - 20) * 5)),
  //           Math.max(0, Math.min(100, (prev - 40) * 5)),
  //           Math.max(0, Math.min(100, (prev - 60) * 5)),
  //           Math.max(0, Math.min(100, (prev - 80) * 5))
  //         ];
  //         setLetterVisibility(newLetterVisibility);
          
  //         return prev + 1;
  //       });
  //     }, 20);

  //     return () => clearInterval(interval);
  //   }
  // }, [location.pathname]);

  // const handleLoadingComplete = () => {
  //   // Trigger the flash effect
  //   setShowFlash(true);
    
  //   // After flash, trigger white overlay
  //   setTimeout(() => {
  //     setShowFlash(false);
  //     setShowWhiteOverlay(true);
  //   }, 1000);

  //   // Finally, transition to main content
  //   setTimeout(() => {
  //     setShowWhiteOverlay(false);
  //     setShowLoading(false);
  //   }, 2000);
  // };

  // const handleScroll = (e) => {
  //   if (isFading || showLoading) return;

  //   if (e.deltaY > 0) {
  //     if (currentView === 1) {
  //       triggerFade(2);
  //     } else if (currentView === 2) {
  //       triggerFade(3);
  //     }
  //   } else if (e.deltaY < 0) {
  //     if (currentView === 3) {
  //       triggerFade(2);
  //     } else if (currentView === 2) {
  //       triggerFade(1);
  //     }
  //   }
  // };

  // const handleTouchStart = (e) => {
  //   window.touchStartY = e.touches[0].clientY;
  // };

  // const handleTouchMove = (e) => {
  //   if (isFading || showLoading) return;

  //   const touchEndY = e.touches[0].clientY;
  //   if (window.touchStartY - touchEndY > 50) {
  //     if (currentView === 1) {
  //       triggerFade(2);
  //     } else if (currentView === 2) {
  //       triggerFade(3);
  //     }
  //   } else if (touchEndY - window.touchStartY > 50) {
  //     if (currentView === 3) {
  //       triggerFade(2);
  //     } else if (currentView === 2) {
  //       triggerFade(1);
  //     }
  //   }
  // };

  // const triggerFade = (view) => {
  //   setIsFading(true);
  //   setTimeout(() => {
  //     setCurrentView(view);
  //     setIsFading(false);
  //   }, 1000);
  // };

  // const shouldShowNavbar = location.pathname === "/" && currentView !== 3;

  // const renderLoadingScreen = () => (
  //   <div className="loading-container">
  //     <h1 className={`loading-text ${showFlash ? 'flash' : ''}`}>
  //       <span style={{ opacity: letterVisibility[0] / 100 }}>V</span>
  //       <span style={{ opacity: letterVisibility[1] / 100 }}>E</span>
  //       <span style={{ opacity: letterVisibility[2] / 100 }}>T</span>
  //       <span style={{ opacity: letterVisibility[3] / 100 }}>R</span>
  //       <span style={{ opacity: letterVisibility[4] / 100 }}>A</span>
  //     </h1>
  //     {showWhiteOverlay && <div className="white-overlay" />}
  //   </div>
  // );

  // const renderMainContent = () => (
  //   <div
  //     className="app-container"
  //     onWheel={handleScroll}
  //     onTouchStart={handleTouchStart}
  //     onTouchMove={handleTouchMove}
  //   >
  //     {shouldShowNavbar && <Navbar />}
  //     <div className={`fade-overlay ${isFading ? 'active' : ''}`} />
  //     {currentView === 1 && <MainOne />}
  //     {currentView === 2 && <MainTwo />}
  //     {currentView === 3 && <Footer />}
  //   </div>
  // );

  return (
    <>
      {/* {showLoading ? renderLoadingScreen() : renderMainContent()} */}
      <SignIn />
    </>
  );
}

export default App;