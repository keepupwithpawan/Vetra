"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import "./styles/Grid.css";
import supabase from "@/utils/SupabaseClient";
import { LinkIcon } from "lucide-react";


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

function GridContent({ query }: { query: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRepoName = searchParams.get("repo_name");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [query, currentRepoName]); // ✅ Re-fetch when query changes

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        // Filter based on query
        const filteredProjects = data
          .filter(
            (project) =>
              project.images &&
              project.repo_name !== currentRepoName &&
              (query
                ? project.repo_name.toLowerCase().includes(query.toLowerCase()) ||
                project.category.toLowerCase().includes(query.toLowerCase()) ||
                project.description.toLowerCase().includes(query.toLowerCase())
                : true) // Show all if query is empty
          );
        setProjects(filteredProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (repoName: string) => {
    router.push(`/info?repo_name=${repoName}`);
  };

  if (loading) {
    return <div className="bg-[#030303]">Loading projects...</div>;
  }

  return (
    <div className="columns-2 mt-8 md:mt-32 sm:columns-2 md:columns-3 lg:columns-4 bg-[#030303] md:gap-20 gap-12 md:mx-20 mx-4 max-w-8xl md:space-y-20 space-y-12">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => handleImageClick(project.repo_name)}
          className="break-inside-avoid w-full shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
        >
          <img
            src={project.images}
            className="w-full h-auto object-cover"
            alt={`Project ${project.repo_name}`}
          />
          <div className="bg-white flex gap-2 items-center p-3 sm:p-4 text-black">
            <LinkIcon size={16} className="flex-shrink-0" />
            <h3 className="text-sm font-bold truncate">{project.repo_name}</h3>
          </div>
        </div>
      ))}
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => handleImageClick(project.repo_name)}
          className="break-inside-avoid w-full shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
        >
          <img
            src={project.images}
            className="w-full h-auto object-cover"
            alt={`Project ${project.repo_name}`}
          />
          <div className="bg-white flex gap-2 items-center p-3 sm:p-4 text-black">
            <LinkIcon size={16} className="flex-shrink-0" />
            <h3 className="text-sm font-bold truncate">{project.live_demo}</h3>
          </div>
        </div>
      ))}

    </div>



  );
}

export default function Grid({ query }: { query: string }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GridContent query={query} /> {/* ✅ Pass query to GridContent */}
    </Suspense>
  );
}
