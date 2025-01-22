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
        detail: (string | string[])[] | null; // Make detail nullable
    }

    const [results, setResults] = useState<Project[]>([]);
    const [image, setImage] = useState<string>('');

    const handleSearch = async () => {
        if (!query) {
            console.warn('Search query is empty.');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*');

            if (error) {
                console.error('Error searching:', error.message);
                return;
            }

            // Custom filtering for nested arrays with null checking
            const filteredData = data?.filter(project => {
                // Check if detail exists and is an array
                if (!project.detail || !Array.isArray(project.detail)) {
                    return false;
                }

                return project.detail.some(item => {
                    if (item === null) return false;

                    if (Array.isArray(item)) {
                        // Search within nested arrays
                        return item.some(subItem =>
                            subItem?.toLowerCase().includes(query.toLowerCase())
                        );
                    } else {
                        // Search within string
                        return item?.toLowerCase().includes(query.toLowerCase());
                    }
                });
            });

            if (!filteredData || filteredData.length === 0) {
                console.info('No results found for the query:', query);
                setResults([]);
                setImage('');
                return;
            }

            setResults(filteredData);

            if (filteredData[0]?.images) {
                setImage(filteredData[0].images);
            } else {
                setImage('');
            }

            console.log('Search results:', filteredData);
        } catch (err) {
            console.error('Unexpected error during search:', err);
        }
    };

    const renderDetailItem = (item: string | string[] | null) => {
        if (item === null) return '';
        if (Array.isArray(item)) {
            return item.filter(Boolean).join(', ');
        }
        return item;
    };

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={query}
                    className='text-black'
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
                                <h3>{item.name}</h3>
                                <div>
                                    {item.detail?.map((detailItem, detailIndex) => (
                                        <p key={detailIndex}>
                                            {renderDetailItem(detailItem)}
                                        </p>
                                    ))}
                                </div>
                                {item.images && (
                                    <Image
                                        alt="Project Image"
                                        src={item.images}
                                        width={200}
                                        height={200}
                                        className='w-auto h-auto'
                                    />
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