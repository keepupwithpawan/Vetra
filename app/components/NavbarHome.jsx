"use client";
import { useRouter } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";
import { useState, useEffect } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function NavbarHome({ setQuery }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRedirect = () => {
        router.push('/bookmarks');
        setIsMenuOpen(false);
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
        <>
            {/* PC VIEW (Hidden on Mobile) */}
            <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-md shadow-md border-b border-white/10">
                <div className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="" id='left'>
                        V
                    </div>

                    <div className="flex-1 max-w-xl mx-4">
                        <div className="relative">
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-y-0 left-3 flex items-center pointer-events-none"
                            >
                                <Sparkles width={20} className="text-white/50" />
                            </motion.div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                className="w-full bg-white/10 border border-white/10 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                            />
                            {inputValue && (
                                <button
                                    onClick={handleClear}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                                    aria-label="Clear search"
                                >
                                    <i className="fa-solid fa-times" aria-hidden="true"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                            About
                        </button>
                        <button
                            onClick={handleRedirect}
                            className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                        >
                            Bookmarks
                        </button>
                        <div className="pl-4 border-l border-white/10">
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
                        </div>
                    </div>
                </div>
            </nav>

            {/* MOBILE VIEW (Hidden on PC) */}
            <div className="md:hidden">
                <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] bg-black/80 backdrop-blur-md shadow-lg border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between z-50">
                    <div className="" id='left'>
                        V
                    </div>

                    <div className="flex-1 mx-4">
                        <div className="relative">
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-y-0 left-3 flex items-center pointer-events-none"
                            >
                                <Sparkles width={20} className="text-white/50" />
                            </motion.div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                className="w-full bg-white/10 border border-white/10 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                            />
                            {inputValue && (
                                <button
                                    onClick={handleClear}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                                    aria-label="Clear search"
                                >
                                    <i className="fa-solid fa-times" aria-hidden="true"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="text-white relative z-50"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 flex  bg-black/50 backdrop-blur-sm z-40"
                            onClick={() => setIsMenuOpen(false)}
                        />
                    )}
                </AnimatePresence>
{/* Mobile Menu Content */}
<AnimatePresence>
    {isMenuOpen && (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-24 left-0 right-0 mx-auto w-[90%] bg-black/90 backdrop-blur-md shadow-lg border border-white/10 rounded-lg px-6 py-6 z-50"
        >
            <div className="flex flex-col items-start space-y-6">
                <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                    About
                </button>
                <button 
                    onClick={handleRedirect}
                    className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                    Bookmarks
                </button>
                <div className="pt-4 border-t border-white/10 w-full flex justify-start">
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
                </div>
            </div>
        </motion.div>
    )}
</AnimatePresence>

            </div>
        </>
    );
}