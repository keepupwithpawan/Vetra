import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './styles/Bookmarks.css';
import NavbarHome from './components/NavbarHome';
import loader from "./assets/spinner.png";
import Popup from './components/Popup'; // Import the Popup component

// Supabase client setup
const supabaseUrl = 'https://kmkzzsqbmjarjzfpopin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtta3p6c3FibWphcmp6ZnBvcGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3OTc0NDUsImV4cCI6MjA1MTM3MzQ0NX0.OmV6f7KVTTZi2Vc9Wfb9ssskb8JJpEHNFmpz7_t2I0I';
const supabase = createClient(supabaseUrl, supabaseKey);

function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popupMessage, setPopupMessage] = useState(''); // State for popup message
    const [popupVisible, setPopupVisible] = useState(false); // State for popup visibility

    useEffect(() => {
        const fetchBookmarks = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('bookmark_status', true); // Fetch only bookmarked items

            if (error) {
                console.error('Error fetching bookmarks:', error);
            } else {
                setBookmarks(data);
            }
            setLoading(false);
        };

        fetchBookmarks();
    }, []);

    const toggleBookmark = async (item) => {
        // Update bookmark_status to false
        const { error } = await supabase
            .from('projects')
            .update({ bookmark_status: false })
            .eq('id', item.id); // Update the specific item by its id

        if (error) {
            console.error('Error updating bookmark status:', error);
            setPopupMessage('Failed to remove bookmark.');
            setPopupVisible(true);
        } else {
            // Update local state to reflect the removal
            setBookmarks(bookmarks.filter(b => b.id !== item.id));
            setPopupMessage('Bookmark Removed');
            setPopupVisible(true);
        }

        // Hide the popup after 3 seconds
        setTimeout(() => {
            setPopupVisible(false);
        }, 3000);
    };

    // Helper function to truncate the description after 12 words
    const truncateDescription = (description) => {
        const words = description.split(' ');
        if (words.length > 20) {
            return words.slice(0, 20).join(' ') + '...';
        }
        return description;
    };

    if (loading) {
        return <div id="loading"><img src={loader} alt="" /></div>;
    }

    if (bookmarks.length === 0) {
        return (
            <>
                <NavbarHome />
                <div id='empty'>
                    <h4>Bookmark something to view later</h4>
                    <i class="fa-solid fa-bookmark"></i>
                </div>
            </>
        );
    }

    return (
        <>
            <NavbarHome />
            <Popup message={popupMessage} visible={popupVisible} /> {/* Display Popup */}
            <div id="bookmarks-wrapper">
                {bookmarks.map((item) => {
                    const tags = item.category ? item.category.split(',').map(tag => tag.trim()) : [];

                    return (
                        <div id="bookmarks-container" key={item.id}>
                            <div id="banner" style={{ backgroundImage: `url(${item.banner_image || 'https://pawan-kamat-portfolio.vercel.app/images/Breather-Home.png'})` }}></div>
                            <div id="bookmarks">
                                <div id="bookmarks-nav">
                                    <div id="title">{item.repo_name}</div>
                                    <div id="bookmarks-btns">
                                        {/* Bookmark toggle button */}
                                        <div
                                            id="collection"
                                            className="bookmarks-btn"
                                            title="Remove from Bookmarks"
                                            onClick={() => toggleBookmark(item)} // Call toggleBookmark on click
                                        >
                                            <i className={`fa-${item.bookmark_status ? 'solid' : 'regular'} fa-bookmark`}></i>
                                        </div>
                                        <div
                                            id="website"
                                            className="bookmarks-btn"
                                            title="Go to website"
                                            onClick={() => window.open(item.live_demo, '_blank')}
                                        >
                                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                        </div>
                                    </div>
                                </div>
                                <div id="bookmarks-content">
                                    <div id="tags">
                                        <ul>
                                            {tags.map((tag, index) => (
                                                <li key={index}>{tag}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div id="about">
                                        <p id="github-about">{truncateDescription(item.description)}</p>
                                    </div>
                                    <div id="buttons">
                                        <a
                                            href={item.repo_source}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            id="github-btn"
                                        >
                                            <i className="fa-brands fa-github"></i>&nbsp;&nbsp; Source
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Bookmarks;
