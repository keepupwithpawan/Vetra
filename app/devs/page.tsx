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
                    <Image src={DEVS} alt="Developers GIF" className="devs-img-content" objectFit="cover" />
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
                    <p>- Pawan, Shridhar, Arya, Aryan from <span>Vetra</span></p>
                </div>
            </div>

            <div id="about-footer">
                <div id="bottom">
                    <div id="bottom-t">
                        <p>© 2025 Vetra - All Rights Reserved</p>
                        <div id="links">
                            <ul>
                                <li>LinkedIn</li>
                                <li>Instagram</li>
                                <li>Twitter</li>
                            </ul>
                        </div>
                    </div>
                    <div id="bottom-b">
                        <h4>VETRA</h4>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Devs;