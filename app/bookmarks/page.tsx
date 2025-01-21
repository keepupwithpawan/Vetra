"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import supabase from '@/utils/SupabaseClient';
import NavbarHome from '../components/NavbarHome';

// Updated interface to match exact database column names
interface Project {
    id: number;
    repo_name: string;
    description: string;
    category: string;
    images?: string;
    repo_source: string;
    live_demo: string;
    githubusername: string;  // Changed from github_username to githubusername
    created_at: string;
}

interface BookmarkData {
    project_id: number;
    projects: Project;
}

interface PopupState {
    message: string;
    visible: boolean;
}

export default function BookmarksPage() {
    const { user } = useUser();
    const [bookmarkedProjects, setBookmarkedProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [popup, setPopup] = useState<PopupState>({ message: '', visible: false });

    const getImageUrl = (imageUrl: string | undefined) => {
        if (!imageUrl) return '/placeholder.png';

        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }

        try {
            const { data } = supabase.storage
                .from('photos')
                .getPublicUrl(imageUrl);
            return data.publicUrl;
        } catch (error) {
            console.error("Error processing image URL:", error);
            return '/placeholder.png';
        }
    };

    const fetchBookmarkedProjects = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);

            // Updated query to match exact database column names
            const { data, error } = await supabase
                .from('bookmarks')
                .select(`
                    project_id,
                    projects (
                        id,
                        repo_name,
                        description,
                        category,
                        images,
                        repo_source,
                        live_demo,
                        githubusername,
                        created_at
                    )
                `)
                .eq('user_id', user.id);

            if (error) {
                console.error("Supabase query error:", error);
                throw error;
            }

            console.log("Raw bookmarks data:", data);

            if (data && data.length > 0) {
                const formattedProjects = data
                    .filter((bookmark): bookmark is BookmarkData =>
                        bookmark.projects !== null && typeof bookmark.projects === 'object'
                    )
                    .map(bookmark => ({
                        ...bookmark.projects,
                        images: bookmark.projects.images ? getImageUrl(bookmark.projects.images) : '/placeholder.png'
                    }));

                console.log("Formatted projects:", formattedProjects);
                setBookmarkedProjects(formattedProjects);
            } else {
                setBookmarkedProjects([]);
            }
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            setPopup({
                message: 'Error fetching bookmarks',
                visible: true
            });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (user) {
            fetchBookmarkedProjects();
        }
    }, [user]);
    const handleRemoveBookmark = async (projectId: number) => {
        if (!user?.id) return;

        try {
            const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', user.id)
                .eq('project_id', projectId);

            if (error) throw error;

            setBookmarkedProjects(prev => prev.filter(project => project.id !== projectId));
            setPopup({
                message: 'Removed from Bookmarks',
                visible: true
            });

            setTimeout(() => {
                setPopup(prev => ({ ...prev, visible: false }));
            }, 3000);
        } catch (error) {
            console.error('Error removing bookmark:', error);
            setPopup({
                message: 'Error removing bookmark',
                visible: true
            });
        }
    };

    const truncateDescription = (description: string) => {
        const words = description.split(' ');
        return words.length > 20 ? words.slice(0, 20).join(' ') + '...' : description;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <NavbarHome />
            {popup.visible && (
                <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    {popup.message}
                </div>
            )}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Your Bookmarks</h1>
                {bookmarkedProjects.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-600">No bookmarks yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarkedProjects.map((project: Project) => {
                            const tags = project.category ? project.category.split(',').map(tag => tag.trim()) : [];

                            return (
                                <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative h-48 w-full">
                                        <img
                                            src={project.images || '/placeholder.png'}
                                            alt={project.repo_name}
                                            className="w-full h-full object-cover transition-opacity duration-300"
                                            onError={(e) => {
                                                console.error("Image load error for:", project.images);
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder.png';
                                                target.classList.add('opacity-75');
                                            }}
                                        />
                                    </div>
                                    <div className="p-4">
                                        {/* ... card content ... */}
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-semibold text-gray-800">{project.repo_name}</h3>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleRemoveBookmark(project.id)}
                                                    className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                                    title="Remove from Bookmarks"
                                                >
                                                    <i className="fa-solid fa-bookmark"></i>
                                                </button>
                                                {project.live_demo && (
                                                    <a
                                                        href={project.live_demo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                                        title="View Live Demo"
                                                    >
                                                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-gray-100 text-sm text-gray-600 rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex space-x-3">
                                            <a
                                                href={project.repo_source}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <i className="fa-brands fa-github mr-2"></i>
                                                Source
                                            </a>
                                            <a
                                                href={`https://github.com/${project.githubusername}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
                                            >
                                                <i className="fa-solid fa-user mr-2"></i>
                                                {project.githubusername}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}