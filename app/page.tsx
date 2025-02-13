"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import './globals.css';
import Navbar from "./components/Navbar";
import MainOne from "./components/MainOne";
import MainTwo from "./components/MainTwo";
import Footer from "./components/Footer";

export default function Home() {
  const [currentView, setCurrentView] = useState<number>(1);
  const [showLoading, setShowLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [letterVisibility, setLetterVisibility] = useState<number[]>([0, 0, 0, 0, 0]);
  const [showFlash, setShowFlash] = useState<boolean>(false);
  const [showWhiteOverlay, setShowWhiteOverlay] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    // Check if this is the first visit in the current session
    const hasVisited = sessionStorage.getItem('hasVisitedVetra');
    
    if (hasVisited) {
      // If already visited in this session, skip loading animation
      setShowLoading(false);
      return;
    }

    // If first visit, start loading animation
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleLoadingComplete();
          return 100;
        }

        const newLetterVisibility = [
          Math.min(100, prev * 5),
          Math.max(0, Math.min(100, (prev - 20) * 5)),
          Math.max(0, Math.min(100, (prev - 40) * 5)),
          Math.max(0, Math.min(100, (prev - 60) * 5)),
          Math.max(0, Math.min(100, (prev - 80) * 5)),
        ];
        setLetterVisibility(newLetterVisibility);

        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const handleLoadingComplete = () => {
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
      setShowWhiteOverlay(true);
    }, 1000);

    setTimeout(() => {
      setShowWhiteOverlay(false);
      setShowLoading(false);
      // Set session storage to indicate the animation has been shown
      sessionStorage.setItem('hasVisitedVetra', 'true');
    }, 2000);
  };

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (showLoading) return;

    if (e.deltaY > 0) {
      if (currentView === 1) setCurrentView(2);
      else if (currentView === 2) setCurrentView(3);
    } else if (e.deltaY < 0) {
      if (currentView === 3) setCurrentView(2);
      else if (currentView === 2) setCurrentView(1);
    }
  };

  const touchStartYRef = React.useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (showLoading) return;

    const touchEndY = e.touches[0].clientY;
    if (touchStartYRef.current - touchEndY > 50) {
      if (currentView === 1) setCurrentView(2);
      else if (currentView === 2) setCurrentView(3);
    } else if (touchEndY - touchStartYRef.current > 50) {
      if (currentView === 3) setCurrentView(2);
      else if (currentView === 2) setCurrentView(1);
    }
  };

  const renderLoadingScreen = () => (
    <div className="loading-container">
      <h1 className={`loading-text ${showFlash ? "flash" : ""}`}>
        <span style={{ opacity: letterVisibility[0] / 100 }}>V</span>
        <span style={{ opacity: letterVisibility[1] / 100 }}>E</span>
        <span style={{ opacity: letterVisibility[2] / 100 }}>T</span>
        <span style={{ opacity: letterVisibility[3] / 100 }}>R</span>
        <span style={{ opacity: letterVisibility[4] / 100 }}>A</span>
      </h1>
      {showWhiteOverlay && <div className="white-overlay" />}
    </div>
  );

  const renderMainContent = () => (
    <div
      className="app-container"
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {currentView !== 3 && <Navbar />}
      {currentView === 1 && <MainOne />}
      {currentView === 2 && <MainTwo />}
      {currentView === 3 && <Footer />}
    </div>
  );

  return (
    <>
      {showLoading ? renderLoadingScreen() : renderMainContent()}
    </>
  );
}
