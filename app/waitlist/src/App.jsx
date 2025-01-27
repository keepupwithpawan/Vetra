import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./styles/prelaunch.css"; // Import your CSS file
import Vetra from "./assets/Vetra.png";

// Initialize Supabase
const SUPABASE_URL = "https://kmkzzsqbmjarjzfpopin.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtta3p6c3FibWphcmp6ZnBvcGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3OTc0NDUsImV4cCI6MjA1MTM3MzQ0NX0.OmV6f7KVTTZi2Vc9Wfb9ssskb8JJpEHNFmpz7_t2I0I";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PrelaunchPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Handle form submission
  const handleSubscribe = async (e) => {
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
      <div id="top">
        <div id="logo">
          <img src={Vetra} alt="Vetra Logo" />
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
          <button id="subscribe-button" type="submit">
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
  );
};

export default PrelaunchPage;
