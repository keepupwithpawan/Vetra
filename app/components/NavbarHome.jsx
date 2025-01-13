"use client";
import '../styles/NavbarHome.css';
import { useRouter } from 'next/navigation';

export default function NavbarHome() {
const router = useRouter(); // Function to handle the redirect to /bookmarks

  // Function to handle the redirect to /bookmarks
  const handleRedirect = () => {
    router.push('/bookmarks');
  };

    return (
        <div id="navHome">
            <div id="left">
                <p>V</p>
            </div>

            <div id="search-bar">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Search for 'Portfolio'" />
            </div>

            <div id="floating-barHome">
                <div id="right">
                    <ul>
                        <li>Pricing</li>
                        <li>About</li>
                        <li>Contact</li>
                        <li id="bookmarks" onClick={handleRedirect}>
                            Bookmarks
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
