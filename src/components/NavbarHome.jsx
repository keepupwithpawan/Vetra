import { useNavigate } from "react-router-dom";
import '../styles/NavbarHome.css';

export default function NavbarHome() {
const navigate = useNavigate(); // Initialize the useNavigate hook

  // Function to handle the redirect to /bookmarks
  const handleRedirect = () => {
    navigate("/bookmarks"); // Redirect to the bookmarks page
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
