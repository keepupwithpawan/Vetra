"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./styles/Grid.css";
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
            <img src={project.images} alt={`Project ${project.repo_name}`} />
          </div>
        ))}
      </div>
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
