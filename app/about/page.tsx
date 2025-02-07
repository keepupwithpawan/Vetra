import './about.css';
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
                    <div id="left-container">
                        <h1>Why should <br /> you use <br /> Vetra?</h1>
                    </div>
                    <div id="right">
                        <p>We know the countless hours spent by developers and designers to find the perfect website for inspiration on Dribble or Pinterest only to find out it's not a working project but just a concept.
                            <br />
                            <br />
                            With Vetra we are compiling the most beautiful, live websites for you to get inspired, save them to your bookmarks, create moodboards and even develop them. <br />
                        </p>
                    </div>




                </div>
                <div className='mt-20 mb-20'>
                    <a href="/devs" className='bg-[#933EFF] px-4 py-2 rounded-full text-[14px] hover:bg-black hover:border-[1px] hover:border-[#933EFF] '  >
                        From the Devs
                    </a>
                </div>

                {/* <hr className='abour-hr' /> */}

                <div id="feature-container" >
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

                {/* Footer */}

                <div className="w-full h-[80%] flex items-end justify-end overflow-hidden">

                    <div className="w-full h-[50vh] bg-white text-black rounded-t-[30px] shadow-[0_0_40px_rgba(255,255,255,0.2)] flex flex-col items-center justify-between p-6">
                        {/* Top Section */}
                        <div className="w-full flex flex-col items-center">
                            <p className="text-lg font-bold">©️ 2025 Vetra - All Rights Reserved</p>
                            <div className="mt-5">
                                <ul className="flex gap-6 text-lg font-bold">
                                    <li className="relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                                        <a href="https://www.linkedin.com/company/vetra-dev/">
                                            LinkedIn</a>

                                    </li>
                                    <li className="relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                                        <a href="https://www.instagram.com/vetra_dev?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                                            Instagram
                                        </a>
                                    </li>
                                    <li className="relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                                        <a href="https://x.com/vetra_dev" target="_blank" rel="noopener noreferrer">
                                            Twitter
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="flex items-center justify-center ">
                            <h4 className="md:text-[200px] text-[100px] font-bold text-black md:mb-[-130px] ">
                                VETRA
                            </h4>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}