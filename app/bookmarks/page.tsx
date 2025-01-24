"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import supabase from '@/utils/SupabaseClient';
import NavbarHome from '../components/NavbarHome';
import "./Bookmark.css"  // Import the CSS file

// Updated interface to match exact database column names
interface Project {
    id: number;
    repo_name: string;
    description: string;
    category: string;
    images?: string;
    repo_source: string;
    live_demo: string;
    githubusername: string;
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

            if (data && data.length > 0) {
                const formattedProjects = data
                    .filter((bookmark): bookmark is BookmarkData =>
                        bookmark.projects !== null && typeof bookmark.projects === 'object'
                    )
                    .map(bookmark => ({
                        ...bookmark.projects,
                        images: bookmark.projects.images ? getImageUrl(bookmark.projects.images) : '/placeholder.png'
                    }));

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
            <div className="loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <>
            <NavbarHome />
            {popup.visible && (
                <div className="popup">
                    {popup.message}
                </div>
            )}
            <div className="container">
                <h1 className="text-2xl font-bold mb-6">Your Bookmarks</h1>
                {bookmarkedProjects.length === 0 ? (
                    <div className="no-bookmarks">
                        <p className="no-bookmarks-text">No bookmarks yet</p>
                    </div>
                ) : (
                    <div className="grid">
                        {bookmarkedProjects.map((project: Project) => {
                            const tags = project.category ? project.category.split(',').map(tag => tag.trim()) : [];

                            return (
                                <div key={project.id} className="card">
                                    <div className="card-image-container">
                                        <img
                                            src={project.images || '/placeholder.png'}
                                            alt={project.repo_name}
                                            className="card-image"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder.png';
                                                target.classList.add('opacity-75');
                                            }}
                                        />
                                    </div>
                                    <div className="card-content">
                                        <div className="card-header">
                                            <h3 className="card-title">{project.repo_name}</h3>
                                            <div className="card-actions">
                                                <button
                                                    onClick={() => handleRemoveBookmark(project.id)}
                                                    className="card-action-btn"
                                                    title="Remove from Bookmarks"
                                                >
                                                    <i className="fa-solid fa-bookmark"></i>
                                                </button>
                                                {project.live_demo && (
                                                    <a
                                                        href={project.live_demo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="card-action-btn"
                                                        title="View Live Demo"
                                                    >
                                                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="tag-container">
                                            {tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="tag"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="description">
                                            {project.description}
                                        </p>

                                        <div className="btn-container">
                                            <a
                                                href={project.repo_source}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="source-btn"
                                            >
                                                <i className="fa-brands fa-github mr-2"></i>
                                                Source
                                            </a>
                                            <a
                                                href={`https://github.com/${project.githubusername}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="profile-btn"
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