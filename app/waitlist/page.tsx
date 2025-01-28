"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"

import "./styles/prelaunch.css"; // Import your CSS file
import Vetra from "./assets/Vetra.png";
import supabase from "@/utils/SupabaseClient";
import Image from "next/image";
import './App.css'
import './index.css'


const PrelaunchPage = () => {
      const navigate = useRouter(); // Hook for navigation
    
      const handleRedirectLinkedIn = () => {
        navigate.push("https://www.linkedin.com/company/vetra-dev/"); 
      };      
      
      const handleRedirectInsta = () => {
        navigate.push("https://www.instagram.com/vetra_dev/"); 
      };     
      
      const handleRedirectTwitter = () => {
        navigate.push("https://x.com/vetra_dev"); 
      };

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    // Handle form submission
    const handleSubscribe = async (e: any) => {
        e.preventDefault(); // Prevent page reload
        if (!email.trim()) {
            setMessage("Please enter a valid email address.");
            setShowToast(true);
            return;
        }

        try {
            const { data, error } = await supabase.from("waitlist").insert([{ email }]);
            if (error) {
                console.error("Error adding email to waitlist:", error);
                setMessage("An error occurred. Please try again.");
            } else {
                setMessage("Thank you for subscribing!");
                setEmail(""); // Clear input
            }
            setShowToast(true);
        } catch (err) {
            console.error("Unexpected error:", err);
            setMessage("An unexpected error occurred. Please try again.");
            setShowToast(true);
        }
    };

    // Auto-hide toast after 3 seconds
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
            return () => clearTimeout(timer); // Cleanup timeout
        }
    }, [showToast]);

    return (
        <div id="main-container">
            <div id="main-content">
                <div id="top">
                    <div id="logo">
                        <Image src={Vetra} alt="Vetra Logo" />
                    </div>
                </div>

                <div id="bottom">
                    <h1>A Dribble/Pinterest alternative for developers. Join the waitlist!</h1>
                    <form id="form-container" onSubmit={handleSubscribe}>
                        <input
                            id="email-input"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button id="subscribe-button" type="submit" >
                            Subscribe
                        </button>
                    </form>

                    {/* Toast Notification */}
                    {showToast && (
                        <div className="toast">
                            <p>{message}</p>
                        </div>
                    )}
                </div>
            </div>

            <div id="waitlist-footer" className="text-black">
                <div id="waitlist-bottom">
                    <div id="waitlist-bottom-t">
                        <p>©️ 2025 Vetra - Developed by ASAP</p>
                        <div id="waitlist-links">
                            <ul>
                                <li onClick={handleRedirectLinkedIn}>LinkedIn</li>
                                <li onClick={handleRedirectInsta}>Instagram</li>
                                <li onClick={handleRedirectTwitter}>Twitter</li>
                            </ul>
                        </div>
                    </div>
                    <div id="waitlist-bottom-b">
                        <h4>VETRA</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrelaunchPage;
