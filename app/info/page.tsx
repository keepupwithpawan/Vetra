"use client";
import React, { Suspense, useEffect, useState } from "react";
import "../styles/Info.css";
import Popup from "../components/Popup";
import supabase from "@/utils/SupabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import CircularLoader from "../components/CircularLoader"
import NavbarHome from "../components/NavbarHome";
import Grid from "../Grid";


interface Project {
  id: number;
  created_at: string;
  live_demo: string | null;
  githubusername: string | null;
  description: string;
  category: string;
  repo_name: string;
  repo_source: string;
  images: string;
}

interface PopupState {
  message: string;
  visible: boolean;
}

function InfoContent({ query }: { query: string }) {
  const { user } = useUser();
  const [project, setProject] = useState<Project | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [popup, setPopup] = useState<PopupState>({
    message: "",
    visible: false,
  });
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const repoName = searchParams.get("repo_name");
  const router = useRouter();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true); // Ensure loading is set to true immediately

        // Artificial delay to make loader visible
        await new Promise(resolve => setTimeout(resolve, 500)); // 1.5 seconds delay

        if (!repoName) {
          setLoading(false);
          return;
        }

        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("repo_name", repoName)
          .single();

        if (projectError) throw projectError;

        setProject(projectData as Project);

        // Check if project is bookmarked
        if (user?.id && projectData.id) {
          const { data: bookmark } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", user.id)
            .eq("project_id", projectData.id)
            .single();

          setIsBookmarked(!!bookmark);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        // Optional: set an error state or show error popup
        setPopup({
          message: "Failed to load project",
          visible: true
        });
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
        visible: true,
      });
      return;
    }

    if (!project) return;

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("project_id", project.id);

        if (error) throw error;

        setIsBookmarked(false);
        setPopup({
          message: "Removed from bookmarks",
          visible: true,
        });
      } else {
        // Add bookmark
        const { error } = await supabase.from("bookmarks").insert({
          user_id: user.id,
          project_id: project.id,
          created_at: new Date().toISOString(),
        });

        if (error) throw error;

        setIsBookmarked(true);
        setPopup({
          message: "Added to bookmarks!",
          visible: true,
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setPopup({
        message: "Error updating bookmark",
        visible: true,
      });
    }

    setTimeout(() => setPopup({ message: "", visible: false }), 3000);
  };

  const handleLiveDemoRedirect = () => {
    if (project?.live_demo) {
      window.open(project.live_demo, "_blank");
    }
  };

  const handleRepoSourceRedirect = () => {
    if (project?.repo_source) {
      window.open(project.repo_source, "_blank");
    }
  };

  if (loading) {
    return <CircularLoader size={60} />
  }

  if (!project) {
    return <div className="bg-black flex-col gap-2 h-screen items-center justify-center w-full flex">
      <p className="text-2xl">Project not found</p>
      <a href="/grid" className="text-sm">Back to Home</a>
    </div>;
  }

  const capitalizeFirstLetter = (string: string): string =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const tags = project.category
    ? project.category.split(",").map((tag: string) => tag.trim())
    : [];

  return (
    <Suspense fallback={<div className="bg-[#030303]"><CircularLoader /></div>}>
      <Popup message={popup.message} visible={popup.visible} />

      <div id="info-wrapper">
        <div>
          <a href="/grid" className="px-8 mt-20"
          >
            Back
          </a>
        </div>
        <div id="info-container">
          <div id="banner">
            {project?.images && (
              <img
                src={project.images}
                alt={project.repo_name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
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
                  className="px-4 py-2 bg-white font-bold rounded-full text-black cursor-pointer transition-all duration-300 hover:shadow-[0_0_10px] hover:shadow-blue-500"
                  title={isBookmarked ? "Remove from Bookmarks" : "Add to Bookmarks"}
                  onClick={handleBookmarkToggle}
                >
                  {isBookmarked ? "Saved" : "Save"}
                </div>

                {project.live_demo && (
                  <div
                    id="website"
                    className="px-4 py-2 w-20 flex items-center justify-center gap-2 bg-white rounded-full font-bold text-black cursor-pointer transition-all duration-300 hover:shadow-[0_0_10px] hover:shadow-blue-500"
                    title="Go to website"
                    onClick={handleLiveDemoRedirect}
                  >
                    <p>Visit</p>
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
              <div id="buttons" className="flex gap-4 mt-4 items-center">
                {project.repo_source && (
                  <button
                    className="github-btn info-btn"
                    title="View on Github"
                    onClick={handleRepoSourceRedirect}
                  >
                    <i className="fa-brands fa-github"></i>&nbsp;&nbsp; Source
                  </button>
                )}
                {project.githubusername && (
                  <a
                    className="github-btn info-btn"
                    href={`https://github.com/${project.githubusername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-user"></i>&nbsp;&nbsp;
                    {project.githubusername}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full items-center justify-center flex pt-20">
          <p id="more-content">Browse some more</p>

        </div>
        <Grid query={query} />

      </div>
    </Suspense>
  );
}

export default function InfoPage() {
  const [query, setQuery] = useState<string>('');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Include NavbarHome at the top */}
      {/* <NavbarHome setQuery={setQuery} /> */}

      <InfoContent query={query} />

    </Suspense>
  );
}
