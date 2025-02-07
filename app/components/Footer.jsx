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

      <div className="w-full h-[80%] flex items-end justify-end overflow-hidden">

<div className="w-full h-[50vh] bg-white text-black rounded-t-[30px] shadow-[0_0_40px_rgba(255,255,255,0.2)] flex flex-col items-center justify-between p-6">
    {/* Top Section */}
    <div className="w-full flex flex-col items-center">
        <p className="text-lg font-bold">©️ 2025 Vetra - All Rights Reserved</p>
        <div className="mt-5">
            <ul className="flex gap-6 text-lg font-bold">
                <li className="relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    <a href="https://www.linkedin.com/company/vetra-dev/">
                        LinkedIn</a>

                </li>
                <li className="relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    <a href="https://www.instagram.com/vetra_dev?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                        Instagram
                    </a>
                </li>
                <li className="relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    <a href="https://x.com/vetra_dev" target="_blank" rel="noopener noreferrer">
                        Twitter
                    </a>
                </li>
            </ul>
        </div>
    </div>

    {/* Bottom Section */}
    <div className="flex items-center justify-center ">
        <h4 className="md:text-[200px] text-[100px] font-bold text-black md:mb-[-130px] ">
            VETRA
        </h4>
    </div>
</div>
</div>
    </>
  );
}