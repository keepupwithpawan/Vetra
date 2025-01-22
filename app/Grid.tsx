"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./styles/Grid.css";
import FullScreenOverlay from "./components/FullScreenOverlay";
import supabase from "@/utils/SupabaseClient";

interface Project {
  keywords: string[] | null;
  color: string[] | null;
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

interface GridProps {
  query: string;
}

export default function Grid({ query }: GridProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchProjects();
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted) {
      filterProjects(query);
    }
  }, [query, projects, mounted]);

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
        setFilteredProjects(filteredProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = (searchQuery: string) => {
    if (!searchQuery) {
      setFilteredProjects(projects);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = projects.filter((project) => {
      const keywordsMatch = project.keywords?.some(keyword =>
        keyword.toLowerCase().includes(lowercasedQuery)
      ) || false;

      const colorsMatch = project.color?.some(color =>
        color.toLowerCase().includes(lowercasedQuery)
      ) || false;

      return (
        (project.repo_name?.toLowerCase() || '').includes(lowercasedQuery) ||
        (project.description?.toLowerCase() || '').includes(lowercasedQuery) ||
        (project.category?.toLowerCase() || '').includes(lowercasedQuery) ||
        (project.githubusername?.toLowerCase() || '').includes(lowercasedQuery) ||
        (project.repo_source?.toLowerCase() || '').includes(lowercasedQuery) ||
        keywordsMatch ||
        colorsMatch
      );
    });

    setFilteredProjects(filtered);
  };

  const openOverlay = (image: string) => {
    setSelectedImage(image);
  };

  const closeOverlay = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedImage(null);
      setIsClosing(false);
    }, 300);
  };

  const handleImageClick = (repoName: string) => {
    router.push(`/info?repo_name=${repoName}`);
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return <div className="scrollable-container">Loading projects...</div>;
  }

  return (
    <>
      <div className="scrollable-container">
        <div className="pinterest-grid h-full pb-20">
          {filteredProjects.map((project) => (
            <div className="grid-item" key={project.id}>
              <img
                src={project.images}
                alt={`Project ${project.repo_name}`}
                loading="lazy"
                className="image"
              />
              <div className="overlay">
                <button
                  className="overlay-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openOverlay(project.images);
                  }}
                  title="View Image"
                >
                  <i className="fa-solid fa-eye" aria-hidden="true"></i>
                </button>
                <button
                  className="overlay-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick(project.repo_name);
                  }}
                  title="View Details"
                >
                  <i className="fa-solid fa-link" aria-hidden="true"></i>
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
          description={filteredProjects.find(project => project.images === selectedImage)?.description || ''}
        />
      )}
    </>
  );
}