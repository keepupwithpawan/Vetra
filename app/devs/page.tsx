import React from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import "./Devs.css";
import DEVS from "../../public/assets/DEVS.png";


const Devs = () => {
    return (
        <>
            <Navbar />
            <div id="devs-container">
                <div id="devs-img" className="pop-animation">
                 
                </div>
                <div id="text-container">
                    <h1 className="gradient-text">DEVS</h1>
                </div>

                <div id="devs-info">
                    <h4>
                        <span className="devs-span">Vetra</span> was the result of a random brainstorming session post a roadtrip we went on. We wanted to get developers out of the Pinterest, Dribbble, Behance scroll cycle and get them to view the code, play with it and <span className="devs-span">start developing instead</span>.
                        <br /><br />
                        We aim to make <span className="devs-span">Vetra</span> a tool which will be the first step in any developer's process. We encourage people to <span className="devs-span">share the source</span> of their projects and let others understand how they created what they created!
                        <br /><br />
                    </h4>
                    <p>- Pawan, Shridhar from <span>Vetra</span></p>
                </div>
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
};

export default Devs;
