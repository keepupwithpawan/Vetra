// Grid.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./styles/Grid.css";
import FullScreenOverlay from "./components/FullScreenOverlay";

export const projectImages = [
  {
    src: "https://kmkzzsqbmjarjzfpopin.supabase.co/storage/v1/object/sign/photos/andrijaweb.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvYW5kcmlqYXdlYi5wbmciLCJpYXQiOjE3MzY4NzM5MTksImV4cCI6MTc2ODQwOTkxOX0.CbqdJQ0G8Ut0Bgwy2HI6n2hIk9GRyNLX_kQMlBEknto&t=2025-01-14T16%3A58%3A41.051Z",
    repo_name: "portfolio-website",
  },
  {
    src: "https://kmkzzsqbmjarjzfpopin.supabase.co/storage/v1/object/sign/photos/bencode.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvYmVuY29kZS5wbmciLCJpYXQiOjE3MzY4NzM5NDEsImV4cCI6MTc2ODQwOTk0MX0.z-rgMGY05ey1NB-8d8K7PsgKoPwXRThnTNGmQZeIod4&t=2025-01-14T16%3A59%3A03.154Z",
    repo_name: "portfolio_v3",
  },
  {
    src:"https://kmkzzsqbmjarjzfpopin.supabase.co/storage/v1/object/sign/photos/Breather.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvQnJlYXRoZXIucG5nIiwiaWF0IjoxNzM2ODc0MTM3LCJleHAiOjE3Njg0MTAxMzd9.hYhPJKbbB6a0u3R77OrIxUXEa_dmFoaKYbNcNwaYUV0&t=2025-01-14T17%3A02%3A20.042Z",
    repo_name: "breather",
  },
  {
    src:"https://kmkzzsqbmjarjzfpopin.supabase.co/storage/v1/object/sign/photos/Bryan.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvQnJ5YW4ucG5nIiwiaWF0IjoxNzM2ODc0MTQ4LCJleHAiOjE3Njg0MTAxNDh9.KVJmyiPXaIeduOdtkhm90oaXvx30IwtBA17feFMqoSw&t=2025-01-14T17%3A02%3A30.412Z",
    repo_name: "Bryanleezh Portfolio",
  },
  {
    src:"https://kmkzzsqbmjarjzfpopin.supabase.co/storage/v1/object/sign/photos/supermooo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3Mvc3VwZXJtb29vLnBuZyIsImlhdCI6MTczNjg3NDE2OSwiZXhwIjoxNzY4NDEwMTY5fQ.yB_6JAfOJuXVqW7sFJF76ZXZ2Lz49SBmLtPd9HT1sxg&t=2025-01-14T17%3A02%3A51.220Z",
    repo_name: "Portfolio",
  },
  {
    src:"https://kmkzzsqbmjarjzfpopin.supabase.co/storage/v1/object/sign/photos/Web%20style%20SS.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvV2ViIHN0eWxlIFNTLnBuZyIsImlhdCI6MTczNjg3NDE4NywiZXhwIjoxNzY4NDEwMTg3fQ.rprcesWP-jrWmvtMCTHZvoPVds0P6zubgA9WEUkgOCs&t=2025-01-14T17%3A03%3A09.191Z",
    repo_name: "web-style",
  },
  {
    src:"https://kmkzzsqbmjarjzfpopin.supabase.co/storage/v1/object/sign/photos/WhatsApp%20Image%202025-01-14%20at%2015.51.59.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvV2hhdHNBcHAgSW1hZ2UgMjAyNS0wMS0xNCBhdCAxNS41MS41OS5qcGVnIiwiaWF0IjoxNzM2ODc0MjAzLCJleHAiOjE3Njg0MTAyMDN9.I9QNirb6WQqKA55FIgtYCjw_R-kSCTBY_4HPqCIQsJg&t=2025-01-14T17%3A03%3A24.889Z",
    repo_name: "",
  },
  {
    src:"https://kmkzzsqbmjarjzfpopin.supabase.co/storage/v1/object/sign/photos/WhatsApp%20Image%202025-01-14%20at%2015.52.00%20(1).jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvV2hhdHNBcHAgSW1hZ2UgMjAyNS0wMS0xNCBhdCAxNS41Mi4wMCAoMSkuanBlZyIsImlhdCI6MTczNjg3NDIyMSwiZXhwIjoxNzY4NDEwMjIxfQ.j27bS6sd_I-TS9oEZ6i97Y00HMBXhhXTGQxXfyYSsD8&t=2025-01-14T17%3A03%3A43.526Z",
    repo_name: "",
  },
  {
    src:"https://kmkzzsqbmjarjzfpopin.supabase.co/storage/v1/object/sign/photos/WhatsApp%20Image%202025-01-14%20at%2015.52.00%20(2).jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvV2hhdHNBcHAgSW1hZ2UgMjAyNS0wMS0xNCBhdCAxNS41Mi4wMCAoMikuanBlZyIsImlhdCI6MTczNjg3NDIzMSwiZXhwIjoxNzY4NDEwMjMxfQ.VPZtdUBYLPdk04f2XTcN9CxxPTNweMkj3Ehp_aZTMag&t=2025-01-14T17%3A03%3A53.077Z",
    repo_name: "",
  },
  {
  src:"https://kmkzzsqbmjarjzfpopin.supabase.co/storage/v1/object/sign/photos/WhatsApp%20Image%202025-01-14%20at%2015.52.00.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvV2hhdHNBcHAgSW1hZ2UgMjAyNS0wMS0xNCBhdCAxNS41Mi4wMC5qcGVnIiwiaWF0IjoxNzM2ODc0MjczLCJleHAiOjE3Njg0MTAyNzN9.eP8EdlLUQ4jVUhtN5UIsX2IgufsOl59NvyQA7TBO058&t=2025-01-14T17%3A04%3A35.790Z",
  repo_name:""
  },
  {
    src:"https://kmkzzsqbmjarjzfpopin.supabase.co/storage/v1/object/sign/photos/yuteoctober.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MveXV0ZW9jdG9iZXIucG5nIiwiaWF0IjoxNzM2ODc0MzAxLCJleHAiOjE3Njg0MTAzMDF9.i0EWP2BNCZ_tSv5jyPtBEsWJur5xGMPJg9AKaseSsYc&t=2025-01-14T17%3A05%3A03.172Z",
    repo_name:"wins95Portfolio"
  }
  // Add your other images here
];

interface ProjectImage {
  src: string;
  repo_name: string;
}

export default function Grid() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const openOverlay = (image: string) => {
    setIsClosing(false);
    setSelectedImage(image);
  };

  const closeOverlay = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedImage(null);
      setIsClosing(false);
    }, 500);
  };

  const handleImageClick = (repoName: string) => {
    router.push(`/info?repo_name=${repoName}`);
  };

  return (
    <>
      <div className="scrollable-container">
        <div className="pinterest-grid">
          {projectImages.map((project, index) => (
            <div className="grid-item" key={index}>
              <img 
                src={project.src} 
                alt={`Project ${project.repo_name}`} 
              />
              <div className="overlay">
                <button 
                  className="overlay-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openOverlay(project.src);
                  }}
                  title="View Image"
                >
                  <i className="fa-solid fa-eye"></i>
                </button>
                <button 
                  className="overlay-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick(project.repo_name);
                  }}
                  title="View Details"
                >
                  <i className="fa-solid fa-link"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <FullScreenOverlay
          image={selectedImage}
          onClose={closeOverlay}
          isClosing={isClosing}
        />
      )}
    </>
  );
}
