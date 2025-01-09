import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/Grid.css'
import FullScreenOverlay from "./components/FullScreenOverlay";

const images = [
  "https://pawan-kamat-portfolio.vercel.app/images/GitaGPT-Home.png",
  "https://private-user-images.githubusercontent.com/134961694/389270736-2c19626b-dc3d-48d0-a313-341ba101d31a.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzU4ODc0MjYsIm5iZiI6MTczNTg4NzEyNiwicGF0aCI6Ii8xMzQ5NjE2OTQvMzg5MjcwNzM2LTJjMTk2MjZiLWRjM2QtNDhkMC1hMzEzLTM0MWJhMTAxZDMxYS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwMTAzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDEwM1QwNjUyMDZaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lOTg3MTY3NDY1ZGU4MjY3MTUyYTdlYWNiYzJmZTQ5NTAzNDkzYTViN2M4MzA3OTVjOGVmZTIxOTVhNTkzODE3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.Oi6jVRZ-7A1ea5GqVpUsCC6eCDTqvUirK_wFgL0-TKk",
  "https://pawan-kamat-portfolio.vercel.app/images/WebStyle-Home.png",
  "https://i.pinimg.com/474x/c6/3e/65/c63e654185b56558fb6d84460ef058f2.jpg",
  "https://i.pinimg.com/236x/ed/22/95/ed229537f5cb0652e27aaddd76a3e174.jpg",
  "https://i.pinimg.com/474x/27/06/8c/27068c587a3f0101b5f2773eee1aa5ad.jpg",
  "https://i.pinimg.com/236x/b4/8d/81/b48d81657d26a49292278ccf4011d168.jpg",
  "https://i.pinimg.com/474x/01/11/b7/0111b72edb489ee6aba96f3e8287dc77.jpg",
  "https://i.pinimg.com/236x/02/e4/77/02e4771b051185d0cb900798ea612da1.jpg",
  "https://i.pinimg.com/236x/36/ab/ae/36abaed69bd5b4e84bf31d2ddc348a96.jpg",
  "https://i.pinimg.com/474x/9f/c4/ab/9fc4ab4451cb7a4a9a296eeed999e2b6.jpg",
  "https://i.pinimg.com/236x/c0/19/75/c019751c7491a631753e617c0bf345df.jpg",
  "https://i.pinimg.com/236x/4b/5a/ce/4b5acefbd891517243c447bcb1854187.jpg",
  "https://pawan-kamat-portfolio.vercel.app/images/Breather-Home.png",
  "https://i.pinimg.com/474x/f1/ad/91/f1ad911a2c262549913b21e318313ad8.jpg",
  "https://i.pinimg.com/474x/e3/55/5b/e3555bba6c3f4587105a9650b50f6438.jpg",
  "https://i.pinimg.com/474x/c9/2f/15/c92f15d2e5aabf851698b0bb7927aea1.jpg",
  "https://i.pinimg.com/474x/bd/1c/56/bd1c5628b26db143dff37bef1f2609a9.jpg",
  "https://i.pinimg.com/474x/38/8d/62/388d623fad4165ded25eb6e64bfe64ab.jpg",
  "https://i.pinimg.com/236x/ce/f2/40/cef240a79e2fd87bb493381e474a5271.jpg",
];

export default function Grid() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const navigate = useNavigate(); // Move useNavigate inside the component

  const infoRedirect = () => {
    navigate("/info"); // Redirect to the /info page
  };

  const openOverlay = (image) => {
    setIsClosing(false); // Reset closing state
    setSelectedImage(image);
  };

  const closeOverlay = () => {
    setIsClosing(true); // Trigger closing animation
    setTimeout(() => {
      setSelectedImage(null); // Remove overlay after animation ends
      setIsClosing(false); // Reset state
    }, 500); // Duration matches CSS animation
  };

  return (
    <>
      <div className="scrollable-container">
        <div className="pinterest-grid">
          {images.map((image, index) => (
            <div
              className="grid-item"
              key={index}
              onClick={() => openOverlay(image)}
            >
              <img src={image} alt={`Pinterest Grid Item ${index + 1}`} />
              <div className="overlay">
                <button className="overlay-btn">
                  <i className="fa-solid fa-link"></i>
                </button>
                <button className="overlay-btn" onClick={infoRedirect}>
                  <i className="fa-solid fa-code"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Use the FullScreenOverlay component when an image is selected */}
      {selectedImage && (
        <FullScreenOverlay
          image={selectedImage}
          description="This is a description of the image."
          onClose={closeOverlay}
          isClosing={isClosing}
        />
      )}
    </>
  );
}
