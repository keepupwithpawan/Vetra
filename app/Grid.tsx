"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./styles/Grid.css";
import FullScreenOverlay from "./components/FullScreenOverlay";
import supabase from "@/utils/SupabaseClient";

interface Project {
  id: number;
  created_at: string;
  live_demo: string;
  category: string;
  githubusername: string;
  description: string;
  repo_name: string;
  repo_source: string;
  bookmark_status: boolean;
  images: string;
}

export default function Grid() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const filteredProjects = data.filter(project => project.images);
        setProjects(filteredProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (repoName: string) => {
    router.push(`/info?repo_name=${repoName}`);
  };

  const handleOverlayButtonClick = (liveDemo: string) => {
    if (liveDemo) {
      window.open(liveDemo, '_blank');
    }
  };

  if (loading) {
    return <div className="scrollable-container">Loading projects...</div>;
  }

  return (
    <div className="scrollable-container">
      <div className="pinterest-grid">
        {projects.map((project) => (
          <div 
            className="grid-item" 
            key={project.id} 
            onClick={() => handleImageClick(project.repo_name)}
          >
            <img 
              src={project.images} 
              alt={`Project ${project.repo_name}`} 
            />
            <div className="overlay">
              <button 
                className="overlay-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOverlayButtonClick(project.live_demo);
                }}
                title="Visit Website"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
