"use client";
import { useRouter } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";
import { useState, useEffect } from 'react';
import '../styles/NavbarHome.css';

export default function NavbarHome({ setQuery }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRedirect = () => {
        router.push('/bookmarks');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          setQuery(inputValue.trim());
        }
      };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleClear = () => {
        setInputValue('');
        setQuery('');
    };

    if (!mounted) return null;

    return (
        <div id="navHome">
            <div id="left">
                <p>V</p>
            </div>

            <div id="search-bar">
                <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                <input
        type="text"
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress} // ✅ Trigger search
      />
                {inputValue && (
                    <button
                        onClick={handleClear}
                        className="clear-button"
                        aria-label="Clear search"
                    >
                        <i className="fa-solid fa-times" aria-hidden="true"></i>
                    </button>
                )}
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
