"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./styles/Grid.css";
import FullScreenOverlay from "./components/FullScreenOverlay";
import supabase from "@/utils/SupabaseClient";
import Image from "next/image";

interface ProjectImage {
  src: string;
  repo_name: string;
  description: string;
}

export default function Grid() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [activedescription, setActivedescription] = useState<string | null>(null);



  const openOverlay = (image: string, description: string) => {
    setIsClosing(false);
    setSelectedImage(image);
    setActivedescription(description);
  };

  const closeOverlay = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedImage(null);
      setDescription(null);
      setIsClosing(false);
    }, 500);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("images, repo_name, description");

      if (error) {
        console.error("Error fetching data:", error.message);
        return;
      }

      if (data) {
        // Map the fetched data to match the `ProjectImage` format
        const formattedImages = data.map((item: { images: string; repo_name: string; description: string }) => ({
          src: item.images,
          repo_name: item.repo_name,
          description: item.description
        }));
        setImages(formattedImages);

        console.log("formattedImages", formattedImages);


      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleImageClick = (repoName: string) => {
    router.push(`/info?repo_name=${repoName}`);
  };

  return (
    <>
      <div className="scrollable-container">

        <div className="pinterest-grid">
          {images.map((project, index) => (
            <div className="grid-item" key={index}>
              <Image
                src={project.src}
                alt={`Project ${project.repo_name}`}
                width={200}
                height={200}
                className="object-cover"
              />
              <div className="overlay">
                <button
                  className="overlay-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openOverlay(project.src, project.description);
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
          isClosing={isClosing} description={activedescription} />
      )}
    </>
  );
}
