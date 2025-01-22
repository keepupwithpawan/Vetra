"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import "./Upload.css";
import Navbar from "../components/Navbar";
import ColorThief from "colorthief";
import supabase from "@/utils/SupabaseClient";

interface FormData {
    live_demo: string;
    category: string;
    githubusername: string;
    project_image: File | null;
    description: string;
    repo_name: string;
    repo_source: string;
    bookmark_status: boolean;
    images: string;
    keywords: string;
    color: string;
    detail: string;
    color_codes: string[];
}

const Upload: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        live_demo: "",
        category: "",
        githubusername: "",
        project_image: null,
        description: "",
        repo_name: "",
        repo_source: "",
        bookmark_status: false,
        images: "",
        keywords: "",
        color: "",
        detail: "",
        color_codes: [],
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [colorSwatches, setColorSwatches] = useState<string[]>([]);

    const [colorNames, setColorNames] = useState<string[]>([]);


    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, project_image: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                const imageSrc = reader.result as string;
                setImagePreview(imageSrc);

                const img = new Image();
                img.src = imageSrc;

                img.onload = () => {
                    const colorThief = new ColorThief();
                    const palette = colorThief.getPalette(img, 5); // Extract 5 dominant colors
                    const hexColors = palette.map((rgb) => rgbToHex(rgb[0], rgb[1], rgb[2]));
                    const classifiedNames = palette.map((rgb) => classifyColorFromRgb(rgb));

                    setColorSwatches(hexColors);
                    setColorNames(classifiedNames);
                    setFormData((prev) => ({
                        ...prev,
                        color_codes: hexColors,
                    }));
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        try {
            if (!formData.project_image) {
                alert("Please upload an image.");
                return;
            }

            // Upload the image to Supabase storage bucket
            const fileName = `${Date.now()}_${formData.project_image.name}`;
            const { data: storageData, error: storageError } = await supabase.storage
                .from("photos")
                .upload(fileName, formData.project_image);

            if (storageError) {
                console.error("Error uploading image:", storageError);
                alert("Failed to upload the image.");
                return;
            }

            // Get the public URL
            const { data: publicUrlData } = supabase.storage
                .from("photos")
                .getPublicUrl(storageData.path);

            if (publicUrlData?.publicUrl) {
                const imageUrl = publicUrlData.publicUrl;

                // Insert data into the Supabase database
                const { error: dbError } = await supabase.from("projects").insert([
                    {
                        live_demo: formData.live_demo,
                        category: formData.category,
                        githubusername: formData.githubusername,
                        project_image: imageUrl, // Use the public URL
                        description: formData.description,
                        repo_name: formData.repo_name,
                        repo_source: formData.repo_source,
                        bookmark_status: formData.bookmark_status,
                        images: formData.images,
                        keywords: formData.keywords,
                        color: formData.color,
                        detail: formData.detail,
                        color_codes: formData.color_codes,
                    },
                ]);

                if (dbError) {
                    console.error("Error inserting data:", dbError);
                    alert("Failed to upload project data.");
                    return;
                }

                alert("Project uploaded successfully!");
                setFormData({
                    live_demo: "",
                    category: "",
                    githubusername: "",
                    project_image: null,
                    description: "",
                    repo_name: "",
                    repo_source: "",
                    bookmark_status: false,
                    images: "",
                    keywords: "",
                    color: "",
                    detail: "",
                    color_codes: [],
                });
                setImagePreview(null);
                setColorSwatches([]);
                setColorNames([]);
            } else {
                console.error("Failed to retrieve public URL.");
                alert("Could not retrieve public URL.");
            }
        } catch (error) {
            console.error("Error during upload:", error);
            alert("An error occurred during upload.");
        }
    };


    const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        let h = 0;
        let s = 0;
        let l = (max + min) / 2;

        if (diff !== 0) {
            s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / diff + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / diff + 2;
                    break;
                case b:
                    h = (r - g) / diff + 4;
                    break;
            }
            h /= 6;
        }

        return [h * 360, s * 100, l * 100]; // Hue: 0-360, Saturation: 0-100, Lightness: 0-100
    };
    const classifyColorFromRgb = (rgb: [number, number, number]): string => {
        const [r, g, b] = rgb;

        // Check for white
        if (r > 240 && g > 240 && b > 240) return 'White';

        // Convert RGB to HSL for better classification
        const hsl = rgbToHsl(r, g, b);
        const hue = hsl[0];
        const saturation = hsl[1];
        const lightness = hsl[2];

        // Check for white, black, and gray
        if (lightness > 90 && saturation < 10) return 'White';
        if (lightness < 10) return 'Black';
        if (saturation < 15) return 'Gray';

        // Refined color ranges for better blue detection
        if (hue >= 0 && hue < 15) return 'Red';
        if (hue >= 15 && hue < 45) return 'Orange';
        if (hue >= 45 && hue < 70) return 'Yellow';
        if (hue >= 70 && hue < 165) return 'Green';
        if (hue >= 165 && hue < 260) return 'Blue';  // Expanded blue range
        if (hue >= 260 && hue < 315) return 'Purple';
        if (hue >= 315 || hue < 0) return 'Pink';

        return 'Gray';
    };

    // Convert RGB to HEX
    const rgbToHex = (r: number, g: number, b: number): string => {
        const toHex = (n: number) => n.toString(16).padStart(2, "0");
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    // Handle other input changes
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("Submitted Form Data:", formData);
    };

    return (
        <div className="h-screen w-full overflow-y-scroll">
            <Navbar />
            <div className="upload-container">
                <h1 className="upload-title">Upload Your Project</h1>
                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-group">
                        <input
                            type="text"
                            name="live_demo"
                            placeholder="Live Demo URL"
                            value={formData.live_demo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="githubusername"
                            placeholder="GitHub Username"
                            value={formData.githubusername}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group image-upload">
                        <label className="image-upload-label">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="image-preview"
                                />
                            ) : (
                                <div className="upload-placeholder">
                                    <span>Click to upload project image</span>
                                </div>
                            )}
                            <input
                                type="file"
                                name="project_image"
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden-input"
                            />
                        </label>
                    </div>

                    {/* Display extracted color swatches with names */}
                    {colorSwatches.length > 0 && (
                        <div className="color-swatches">
                            <h3>Extracted Colors:</h3>
                            <div className="swatches-container">
                                {colorSwatches.map((color, index) => (
                                    <div key={index} className="swatch-container">
                                        <div
                                            className="swatch"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        ></div>
                                        <p className="color-name">{colorNames[index]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="repo_name"
                            placeholder="Repository Name"
                            value={formData.repo_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="repo_source"
                            placeholder="Repository Source"
                            value={formData.repo_source}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="images"
                            placeholder="Images URL"
                            value={formData.images}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="keywords"
                            placeholder="Keywords"
                            value={formData.keywords}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="color"
                            placeholder="Color"
                            value={formData.color}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <textarea
                            name="detail"
                            placeholder="Detail"
                            value={formData.detail}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="color_codes"
                            placeholder="Color Codes"
                            value={formData.color_codes.join(", ")}
                            readOnly
                        />
                    </div>

                    <button onClick={handleUpload} className="submit-btn">
                        Upload Project
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Upload;