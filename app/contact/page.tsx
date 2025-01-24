"use client";
import React, { useEffect, useState, FormEvent } from "react";
import Navbar from "../components/Navbar";
import "./Contact.css";

export default function Contact() {
  const [time, setTime] = useState<string>("");
  const [country, setCountry] = useState<string>("Unknown");

  // Function to fetch location (country)
  const fetchLocation = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) throw new Error("Failed to fetch location");
      const data = await response.json();
      setCountry(data.country_name);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to update time
  const updateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    setTime(`${hours}:${minutes}:${seconds}`);
  };

  useEffect(() => {
    // Client-side only modifications
    if (typeof document !== "undefined") {
      document.body.style.opacity = "0";
      document.body.style.transition = "opacity 0.5s ease";
      document.body.style.opacity = "1";
    }

    fetchLocation();
    updateTime();

    const timeInterval = setInterval(updateTime, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Type-safe element access
    const form = e.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const messageInput = form.elements.namedItem("message") as HTMLTextAreaElement;

    const name = nameInput.value;
    const email = emailInput.value;
    const message = messageInput.value;

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const subject = `It's ${encodeURIComponent(name)} from Vetra's website`;
    const body = `${encodeURIComponent(message)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=vetradev@gmail.com&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank");
  };

  return (
    <>
      <Navbar />
      {/* Outer wrapper ensures scrollability */}
      <div style={{ height: "100vh", overflowY: "auto" }}>
        <div id="contact-container">
          <div id="contact">
            <div id="info-container"></div>

            <div id="form-container">
              <form id="contact-form" onSubmit={handleSendMessage}>
                <div id="form-fields">
                  <input type="text" name="name" id="name" placeholder="Name" />
                  <input type="email" name="email" id="email" placeholder="Email" />
                  <textarea name="message" id="message" placeholder="Your Message" rows={5}></textarea>
                </div>

                <button type="submit" id="send-btn">Send Message</button>
              </form>
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
        </div>
      </div>
    </>
  );
}
