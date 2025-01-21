"use client";
import React, { useEffect, useState } from "react";
import "../styles/Info.css";
import NavbarHome from "../components/NavbarHome";
import Grid, { projectImages } from "../Grid";
import Image from "next/image";
import loader from "../../public/assets/spinner.png";
import Popup from "../components/Popup";
import supabase from "@/utils/SupabaseClient";
import { useSearchParams } from "next/navigation";
import { useUser } from '@clerk/clerk-react';

interface Project {
  id: number;
  created_at: string;
  live_demo: string | null;
  githubusername: string | null;
  description: string;
  category: string;
  repo_name: string;
  repo_source: string;
  display_image?: string;
}

interface PopupState {
  message: string;
  visible: boolean;
}

export default function Info() {
  const { user } = useUser();
  const [project, setProject] = useState<Project | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [popup, setPopup] = useState<PopupState>({ message: "", visible: false });
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const repoName = searchParams.get("repo_name");

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        if (!repoName) return;

        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("repo_name", repoName)
          .single();

        if (projectError) throw projectError;

        const projectImage = projectImages.find((img: { repo_name: string; src: string }) => img.repo_name === repoName);

        setProject({
          ...projectData,
          display_image: projectImage?.src
        } as Project);

        // Check if project is bookmarked
        if (user?.id && projectData.id) {
          const { data: bookmark } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('user_id', user.id)
            .eq('project_id', projectData.id)
            .single();

          setIsBookmarked(!!bookmark);
        }

      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [repoName, user]);

  const handleBookmarkToggle = async () => {
    if (!user) {
      setPopup({
        message: "Please log in to bookmark projects",
        visible: true
      });
      return;
    }

    if (!project) return;

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', project.id);

        if (error) throw error;

        setIsBookmarked(false);
        setPopup({
          message: "Removed from bookmarks",
          visible: true
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            project_id: project.id,
            created_at: new Date().toISOString()
          });

        if (error) throw error;

        setIsBookmarked(true);
        setPopup({
          message: "Added to bookmarks!",
          visible: true
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setPopup({
        message: "Error updating bookmark",
        visible: true
      });
    }

    setTimeout(() => setPopup({ message: "", visible: false }), 3000);
  };

  if (loading) {
    return <div id="loading"><Image src={loader} alt="Loading..." /></div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const capitalizeFirstLetter = (string: string): string =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const tags = project.category
    ? project.category.split(",").map((tag: string) => tag.trim())
    : [];

  const handleLiveDemoRedirect = () => {
    if (project.live_demo) {
      window.open(project.live_demo, '_blank');
    }
  };

  const handleRepoSourceRedirect = () => {
    if (project.repo_source) {
      window.open(project.repo_source, '_blank');
    }
  };

  return (
    <>
      <NavbarHome />
      <Popup message={popup.message} visible={popup.visible} />
      <div id="info-wrapper">
        <div id="info-container">
          <div id="banner">
            {project.display_image && (
              <img
                src={project.display_image}
                alt={project.repo_name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
          </div>
          <div id="info">
            <div id="info-nav">
              <div id="title">{capitalizeFirstLetter(project.repo_name)}</div>
              <div id="info-btns">
                <div
                  id="collection"
                  className="info-btn"
                  title={isBookmarked ? "Remove from Bookmarks" : "Add to Bookmarks"}
                  onClick={handleBookmarkToggle}
                >
                  <i className={`fa-${isBookmarked ? "solid" : "regular"} fa-bookmark`}></i>
                </div>
                {project.live_demo && (
                  <div
                    id="website"
                    className="info-btn"
                    title="Go to website"
                    onClick={handleLiveDemoRedirect}
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </div>
                )}
              </div>
            </div>
            <div id="info-content">
              <div id="tags">
                <ul>
                  {tags.map((tag: string, index: number) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>
              <div id="about">
                <p id="github-about">{project.description}</p>
              </div>
              <div id="buttons">
                {project.repo_source && (
                  <button
                    id="github-btn"
                    title="View on Github"
                    onClick={handleRepoSourceRedirect}
                  >
                    <i className="fa-brands fa-github"></i>&nbsp;&nbsp; Source
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <p id="more-content">Browse some more</p>
        <Grid />
      </div>
    </>
  );
}