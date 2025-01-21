import React from "react";

// Full-Screen Overlay Component
const FullScreenOverlay = ({ image, description, onClose, isClosing }) => {
  return (
    <div
      className={`fullscreen-overlay ${isClosing ? "closing" : ""}`}
      onClick={onClose} // Close overlay when clicking outside
    >
      <div
        className="overlay-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
      >
        <img src={image} alt="Enlarged" className="fullscreen-image" />
        <p className="image-description text-white">{description}</p>
      </div>
    </div>
  );
};

export default FullScreenOverlay;
