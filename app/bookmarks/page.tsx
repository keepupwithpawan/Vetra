"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import supabase from '@/utils/SupabaseClient';
import NavbarHome from '../components/NavbarHome';

interface Project {
    id: number;
    repo_name: string;
    description: string;
    category: string;
    image?: string;
    banner_image?: string;
    repo_source: string;
    live_demo?: string;
    github_username: string;
    created_at: string;
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
        if (!imageUrl) return null;
        try {
            const { data } = supabase.storage
                .from('photos')
                .getPublicUrl(imageUrl.split('photos/')[1]);
            console.log("Generated URL:", data.publicUrl); // Debug log
            return data.publicUrl;
        } catch (error) {
            console.error("Error processing image URL:", error);
            return null;
        }
    };

    const fetchBookmarkedProjects = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            
            // Fetch bookmarked projects
            const { data: bookmarks, error: bookmarksError } = await supabase
                .from('bookmarks')
                .select(`
                    project_id,
                    projects(*)
                `)
                .eq('user_id', user.id);

            if (bookmarksError) {
                throw bookmarksError;
            }

            console.log("Fetched bookmarks:", bookmarks); // Debug log

            if (bookmarks && bookmarks.length > 0) {
                const formattedProjects = bookmarks.map(bookmark => {
                    const project = bookmark.projects;
                    if (project && project.image) {
                        console.log("Original image URL:", project.image); // Debug log
                        const processedImageUrl = getImageUrl(project.image);
                        console.log("Processed image URL:", processedImageUrl); // Debug log
                        return {
                            ...project,
                            image: processedImageUrl
                        };
                    }
                    return project;
                });

                console.log("Formatted projects:", formattedProjects); // Debug log
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {bookmarkedProjects.map((project: Project) => {
                    const tags = project.category ? project.category.split(',').map(tag => tag.trim()) : [];

                    return (
                        <div 
                            key={project.id} 
                            className="bg-white rounded-lg shadow-lg overflow-hidden"
                        >
                            <div className="relative h-48 w-full">
                                {project.image ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={project.image}
                                            alt={project.repo_name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error("Image load error for:", project.image); // Debug log
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder.png';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No image available</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold">{project.repo_name}</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleRemoveBookmark(project.id)}
                                            className="text-blue-500 hover:text-blue-600"
                                            title="Remove from Bookmarks"
                                        >
                                            <i className="fa-solid fa-bookmark"></i>
                                        </button>
                                        {project.live_demo && (
                                            <button
                                                onClick={() => window.open(project.live_demo, '_blank')}
                                                className="text-blue-500 hover:text-blue-600"
                                                title="Go to website"
                                            >
                                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {tags.map((tag, index) => (
                                            <span 
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-sm text-gray-600 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {truncateDescription(project.description)}
                                    </p>
                                </div>
                                
                                <div className="mt-4">
                                    <a
                                        href={project.repo_source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                                    >
                                        <i className="fa-brands fa-github mr-2"></i>
                                        Source
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
