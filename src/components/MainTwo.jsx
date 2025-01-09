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
            "create moodboards",
            "develop"
        ];

        let index = 0;

        const intervalId = setInterval(() => {
            index = (index + 1) % textList.length;
            setTagText(textList[index]);
            setFadeKey((prevKey) => prevKey + 1);
        }, 4000);

        return () => clearInterval(intervalId);
    }, []);

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
                        <div className="floating-image image-1" data-depth="20">
                            <img src="https://pawan-kamat-portfolio.vercel.app/images/GitaGPT-Home.png" alt="Floating 1" />
                        </div>
                        <div className="floating-image image-2" data-depth="40">
                            <img src="https://pawan-kamat-portfolio.vercel.app/images/WebStyle-Home.png" alt="Floating 2" />
                        </div>
                        <div className="floating-image image-3" data-depth="10">
                            <img src="https://i.pinimg.com/236x/ed/22/95/ed229537f5cb0652e27aaddd76a3e174.jpg" alt="Floating 3" />
                        </div>
                        <div className="floating-image image-4" data-depth="30">
                            <img src="https://pawan-kamat-portfolio.vercel.app/images/Breather-Home.png" alt="Floating 4" />
                        </div>
                        <div className="floating-image image-5" data-depth="25">
                            <img src="https://i.pinimg.com/474x/bd/1c/56/bd1c5628b26db143dff37bef1f2609a9.jpg" alt="Floating 5" />
                        </div>
                        <div className="floating-image image-6" data-depth="25">
                            <img src="https://i.pinimg.com/236x/ce/f2/40/cef240a79e2fd87bb493381e474a5271.jpg" alt="Floating 6" />
                        </div>
                        <div className="floating-image image-7" data-depth="25">
                            <img src={image1} alt="Floating 7" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
