import React, { useEffect, useState } from 'react';
import './styles/Info.css';
import NavbarHome from './components/NavbarHome';
import Grid from './Grid';
import { createClient } from '@supabase/supabase-js';
import loader from "./assets/spinner.png";
import Popup from './components/Popup'; // Import Popup component

// Supabase client setup
const supabaseUrl = 'https://kmkzzsqbmjarjzfpopin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtta3p6c3FibWphcmp6ZnBvcGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3OTc0NDUsImV4cCI6MjA1MTM3MzQ0NX0.OmV6f7KVTTZi2Vc9Wfb9ssskb8JJpEHNFmpz7_t2I0I';
const supabase = createClient(supabaseUrl, supabaseKey);


function Info() {
    const [project, setProject] = useState(null);
    const [popup, setPopup] = useState({ message: '', visible: false });

    useEffect(() => {
        const fetchProject = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('repo_name', 'breather')
                .single();

            if (error) {
                console.error('Error fetching project:', error);
            } else {
                setProject(data);
            }
        };

        fetchProject();
    }, []);

    if (!project) {
        return <div id='loading'><img src={loader} alt="" /></div>;
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const tags = project.category ? project.category.split(',').map(tag => tag.trim()) : [];

    const handleLiveDemoRedirect = () => {
        window.location.href = project.live_demo;
    };

    const handleRepoSourceRedirect = () => {
        window.location.href = project.repo_source;
    };

    const handleBookmarkToggle = async () => {
        try {
            const newBookmarkStatus = !project.bookmark_status;

            const { error } = await supabase
                .from('projects')
                .update({ bookmark_status: newBookmarkStatus })
                .eq('repo_name', project.repo_name);

            if (error) {
                console.error('Error updating bookmark status:', error);
                return;
            }

            setProject({ ...project, bookmark_status: newBookmarkStatus });

            setPopup({
                message: newBookmarkStatus ? 'Added to Bookmarks!' : 'Removed from Bookmarks',
                visible: true
            });

            setTimeout(() => {
                setPopup({ message: '', visible: false });
            }, 3000); // Hide after 3 seconds
        } catch (error) {
            console.error('Error toggling bookmark status:', error);
        }
    };

    return (
        <>
            <NavbarHome />
            <Popup message={popup.message} visible={popup.visible} />
            <div id="info-wrapper">
                <div id="info-container">
                    <div id="banner"></div>
                    <div id="info">
                        <div id="info-nav">
                            <div id="title">{capitalizeFirstLetter(project.repo_name)}</div>
                            <div id="info-btns">
                                <div
                                    id="collection"
                                    className="info-btn"
                                    title="Add to Bookmarks"
                                    onClick={handleBookmarkToggle}
                                >
                                    <i className={`fa-${project.bookmark_status ? 'solid' : 'regular'} fa-bookmark`}></i>
                                </div>
                                <div
                                    id="website"
                                    className="info-btn"
                                    title="Go to website"
                                    onClick={handleLiveDemoRedirect}
                                >
                                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                </div>
                            </div>
                        </div>
                        <div id="info-content">
                            <div id="tags">
                                <ul>
                                    {tags.map((tag, index) => (
                                        <li key={index}>{tag}</li>
                                    ))}
                                </ul>
                            </div>
                            <div id="about">
                                <p id="github-about">{project.description}</p>
                            </div>
                            <div id="buttons">
                                <button
                                    id="github-btn"
                                    title="View on Github"
                                    onClick={handleRepoSourceRedirect}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <i className="fa-brands fa-github"></i>&nbsp;&nbsp; Source
                                </button>
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

export default Info;
