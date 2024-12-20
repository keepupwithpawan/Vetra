import React from "react";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";
import image6 from "../assets/image6.jpg";
import image7 from "../assets/image7.jpg";

export default function MainOne() {
    const images = [image1, image2, image3, image4, image5, image6];

    return (
        <div id="main-2">
            <div className="container">
                <div className="floating-images">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Floating ${index}`}
                            className="floating-image"
                        />
                    ))}
                </div>
                <div className="center-text">
                    <h1>Explore our curated collection</h1>
                    <p>Explore, Save and get Inspired</p>
                </div>
            </div>
        </div>
    );
}