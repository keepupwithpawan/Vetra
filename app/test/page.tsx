"use client";
import supabase from '@/utils/SupabaseClient';
import Image from 'next/image';
import React, { useState } from 'react';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    interface Project {
        id: number;
        name: string;
        images: string;
    }

    const [results, setResults] = useState<Project[]>([]);
    const [image, setImage] = useState<string>('');

    const handleSearch = async () => {
        if (!query) {
            console.warn('Search query is empty.');
            return;
        }

        try {
            // Perform a text search on the 'keywords_color' column
            const { data, error } = await supabase
                .from('projects')
                .select()
                .textSearch('color', query, {
                    type: 'websearch', // Optional: Use websearch for more natural language search
                    config: 'english', // Optional: Specify language configuration
                });

            if (error) {
                console.error('Error searching:', error.message);
                return;
            }

            if (!data || data.length === 0) {
                console.info('No results found for the query:', query);
                setResults([]); // Clear results if no data found
                setImage(''); // Clear image if no results
                return;
            }

            // Set results to the fetched data
            setResults(data);

            // Assuming 'images' field holds URLs or paths to images
            if (data[0]?.images) {
                setImage(data[0].images); // Update with the first image URL/path
            } else {
                setImage(''); // Clear image if no valid image is found
            }

            console.log('Search results:', data);
        } catch (err) {
            console.error('Unexpected error during search:', err);
        }
    };


    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    style={{
                        padding: '0.5rem',
                        width: '100%',
                        maxWidth: '400px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        marginLeft: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#0070f3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Search
                </button>
            </div>

            {results.length > 0 && (
                <div>
                    <ul>
                        {results.map((item, index) => (
                            <li key={index} className='text-white'>
                                {/* Display image if available */}
                                {item.images && (
                                    <>
                                        <Image
                                            alt="Project Image"
                                            src={item.images} // Use image URL here
                                            width={200}
                                            height={200}
                                            className='w-auto h-auto'
                                        />
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
