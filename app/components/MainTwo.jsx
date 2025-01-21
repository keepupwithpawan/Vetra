import React, { useState, useEffect } from "react";
import "../styles/MainTwo.css";
import image1 from "../assets/image1.jpg";

export default function MainTwo() {
  const [tagText, setTagText] = useState("get inspired");
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    const textList = [
      "get inspired",
      "save websites",
      "create collections",
      "execute more",
    ];

    let index = 0;

    const intervalId = setInterval(() => {
      index = (index + 1) % textList.length;
      setTagText(textList[index]);
      setFadeKey((prevKey) => prevKey + 1);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  const images = [
    {
      src: "https://pawan-kamat-portfolio.vercel.app/images/GitaGPT-Home.png",
      depth: 20,
      text: "Explore AI Tools",
    },
    {
      src: "https://pawan-kamat-portfolio.vercel.app/images/WebStyle-Home.png",
      depth: 40,
      text: "Design Better Websites",
    },
    {
      src: "https://github.com/bryanleezh/www/raw/master/images/demo/main.png",
      depth: 10,
      text: "Discover Live Previews",
    },
    {
      src: "https://pawan-kamat-portfolio.vercel.app/images/Breather-Home.png",
      depth: 30,
      text: "Collaborate Effortlessly",
    },
    {
      src: "https://github.com/Yuteoctober/wins95Portfolio/raw/main/src/assets/markdown.png?raw=true",
      depth: 25,
      text: "Markdown in Style",
    },
    {
      src: "https://kmkzzsqbmjarjzfpopin.supabase.co/storage/v1/object/sign/photos/andrijaweb.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvYW5kcmlqYXdlYi5wbmciLCJpYXQiOjE3MzY4NDkyNDQsImV4cCI6MTc2ODM4NTI0NH0.Jguj3KLkcM5SozoqxQu2a-iooA1ROCucyp-YG5UR_UU&t=2025-01-14T10%3A07%3A26.099Z",
      depth: 25,
      text: "Fast Prototyping",
    },
    { src: image1, depth: 25, text: "Next-Level Development" },
  ];

  return (
    <div className="main-two-container">
      <div className="main-two">
        <div className="content-wrapper">
          <h1>
            Browse through a curated <br /> collection of resources
          </h1>
          <div className="sub-heading">
            Use Vetra to{" "}
            <span className="notes-tag">
              <span id="notes-animate" key={fadeKey}>
                {tagText}
              </span>
            </span>
          </div>
        </div>
        <div className="gallery-container">
          <div className="floating-images">
            {images.map((img, index) => (
              <div
                key={index}
                className={`floating-image image-${index + 1}`}
                data-depth={img.depth}
              >
                <img src={img.src} alt={`Floating ${index + 1}`} />
                {/* <div className="floating-text">{img.text}</div> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
