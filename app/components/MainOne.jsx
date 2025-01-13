import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/MainOne.css";

export default function MainOne({ onTransition }) {
  const router = useRouter(); // Changed from navigate to router to match Next.js conventions

  const handleRedirect = () => {
    router.push("/signin"); // Changed from navigate to router.push
  };

  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleScroll = (e) => {
    if (isTransitioning) return;

    if (e.deltaY > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        if (onTransition) onTransition();
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
        <button 
          onClick={handleRedirect}
          className="px-6 py-2  text-black bg-white rounded-lg transition-colors"
        >
          Get Started
        </button>
      </div>

      <div id="cube" className={isTransitioning ? "zoom" : ""}>
        <video
          className="w-[450px] h-[450px] object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/assets/cube-trans.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}