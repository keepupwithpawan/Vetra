"use client";
import Navbar from "../components/Navbar";
import "./Pricing.css";
import Image from "next/image";
import VetraLogo from "../../public/assets/Vetra-Logo.png";

export default function Pricing() {
    return(
        <>
        <Navbar />
        <div id="pricing-container">
            <div id="pricing-left">
                <h1>VETRA IS FREE TO USE</h1>
                <p className="but">(for the most part *)</p>
                <p className="para">
                    Vetra will always be free to use for all the users, but we need money to keep the website running so we will be coming up with premium content in the future for users who are willing to pay for the premium features.

                    <br />
                    <br />

                    Our core product will always be for everyone, for free, forever ❤ 
                </p>
            </div>

            <div id="pricing-right">
                <Image src={VetraLogo} alt="Vetra Logo" className="vetra-logo-pricing" />
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
    )
}