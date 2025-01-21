import './About.css';
import { BookTextIcon } from './components/BookTextIcon';
import { LayoutPanelTopIcon } from './components/LayoutPanelTopIcon.jsx';
import { SearchIcon } from './components/SearchIcon.jsx';
import Navbar from '../components/Navbar';
import { GithubIcon } from './components/GithubIcon';

export default function About() {
    return (
        <>
            <Navbar />
            <div id="about-container">
                <div id="header">
                    <div id="left">
                        <h1>Why should <br /> you use <br /> Vetra?</h1>
                    </div>
                    <div id="right">
                        <p>We know the countless hours spent by developers and designers to find the perfect website for inspiration on Dribble or Pinterest only to find out it's not a working project but just a concept.
                            <br />
                            <br />
                            With Vetra we are compiling the most beautiful, live websites for you to get inspired, save them to your bookmarks, create moodboards and even develop them. <br />
                        </p>
                    </div>
                    <div id="devs">From the Devs</div>
                </div>

                <hr className='abour-hr' />

                <div id="feature-container">
                    <div id="feature-container-grid">
                        <div className="feature" id="bookmark">
                            <BookTextIcon />
                            <p>Bookmark your <br /> favorite project</p>
                        </div>
                        <div className="feature" id="github">
                            <GithubIcon />
                            <p>Check out <br /> Github Repository</p>
                        </div>
                        <div className="feature" id="explore">
                            <LayoutPanelTopIcon />
                            <p>Explore the best <br /> projects out there</p>
                        </div>
                        <div className="feature" id="search">
                            <SearchIcon />
                            <p>Search from a curated <br /> collection of projects</p>
                        </div>
                    </div>
                </div>

                <div id="about-footer">
                    <div id="bottom">
                        <div id="bottom-t">
                            <p>©️ 2025 Vetra - All Rights Reserved</p>
                            <div id="links">
                                <ul>
                                    <li>LinkedIn</li>
                                    <li>Instagram</li>
                                    <li>Twitter</li>
                                </ul>
                            </div>
                        </div>
                        <div id="bottom-b">
                            <h4>VETRA</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}