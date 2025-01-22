"use client";
import '../styles/NavbarHome.css';
import { useRouter } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";

export default function NavbarHome() {
    const router = useRouter();

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
                        <li>About</li>
                        <li>Contact</li>
                        <li id="bookmarks" onClick={handleRedirect}>
                            Bookmarks
                        </li>
                        <li className="profile-button">
                            <UserButton 
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "",
                                        userButtonBox: "hover:bg-white/10",
                                        userButtonTrigger: "rounded-full",
                                        userButtonPopoverCard: "bg-black border border-white/10",
                                        userButtonPopoverFooter: "hidden"
                                    }
                                }}
                                afterSignOutUrl="/"
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
