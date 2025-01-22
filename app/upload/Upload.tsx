
"use client"; // Ensure this is a client component

import { useState } from 'react';
import ColorThief from 'colorthief';

export default function ColorSearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any[]>([]);

  const MAX_COLORS_TO_DISPLAY = 5; // Limit the number of colors to display

  // Function to handle image upload and extract color categories
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imagesArray: any[] = [];

      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = async (event: ProgressEvent<FileReader>) => {
          const imageSrc = event.target?.result as string;
          const img = new Image();
          img.src = imageSrc;

          img.onload = () => {
            const colorThief = new ColorThief();

            // Extract a larger palette to improve color accuracy
            const palette = colorThief.getPalette(img, 20); // Increase palette size to 20

            if (palette.length > 0) {
              // Convert RGB palette to broad color categories (like "Red", "Green", etc.)
              const colorCategories = palette.map((rgb) => classifyColorFromRgb(rgb));

              const newImage = {
                id: index,
                src: imageSrc,
                colorCategories: Array.from(new Set(colorCategories)), // Ensure uniqueness of categories
                colorSwatches: palette.slice(0, MAX_COLORS_TO_DISPLAY), // Limit the number of colors
              };

              // Prevent duplicate images by checking 'src'
              setUploadedImages((prevImages) => {
                if (!prevImages.some((image) => image.src === newImage.src)) {
                  return [...prevImages, newImage];
                }
                return prevImages;
              });

              // Update search results immediately
              setSearchResult((prevImages) => {
                if (!prevImages.some((image) => image.src === newImage.src)) {
                  return [...prevImages, newImage];
                }
                return prevImages;
              });
            } else {
              console.warn('Color extraction failed for image:', file.name);
            }
          };
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Function to classify RGB into a wide range of color categories
  const classifyColorFromRgb = (rgb: [number, number, number]): string => {
    const [r, g, b] = rgb;

    // Check for white using an RGB threshold
    if (r > 240 && g > 240 && b > 240) return 'White'; // If RGB values are very high, it's likely white

    // Convert RGB to HSL for better color classification
    const hsl = rgbToHsl(r, g, b);
    const hue = hsl[0]; // Hue is the key for classification
    const saturation = hsl[1]; // Saturation for finer classification
    const lightness = hsl[2]; // Lightness for finer classification

    // Classify white more precisely by checking lightness
    if (lightness > 90 && saturation < 10) return 'White'; // High lightness and low saturation indicates white

    // Classify black similarly
    if (lightness < 10 && saturation < 10) return 'Black'; // Low lightness and low saturation indicates black

    // Broad color classification based on Hue
    if (hue >= 0 && hue < 50) return 'Red';
    if (hue >= 50 && hue < 90) return 'Orange';
    if (hue >= 90 && hue < 150) return 'Yellow';
    if (hue >= 150 && hue < 210) return 'Green';
    if (hue >= 210 && hue < 270) return 'Blue';
    if (hue >= 270 && hue < 330) return 'Purple';
    if (hue >= 330 || hue < 10) return 'Pink';

    return 'Gray'; // Default fallback for undefined or gray-like colors
  };

  // Convert RGB to HSL for finer classification
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

  // Function to handle search and filter images based on color categories
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const colorInput = e.target.value.toLowerCase();
    setSearchTerm(colorInput);

    if (colorInput.trim() === '') {
      setSearchResult(uploadedImages); // Reset to show all images if search is empty
    } else {
      // Filter images based on the color category similarity
      const filtered = uploadedImages.filter((image) =>
        image.colorCategories.some((colorCategory: string) =>
          colorCategory.toLowerCase().includes(colorInput)
        )
      );
      setSearchResult(filtered);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Color-Based Image Search</h1>
      <input
        type="text"
        placeholder="Enter a color (e.g., yellow, red)"
        value={searchTerm}
        className="text-black"
        onChange={handleSearch}
        style={{ padding: '10px', width: '300px', fontSize: '16px' }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        multiple
        className="text-black"
        style={{ padding: '10px', marginTop: '20px' }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {searchResult.length > 0 ? (
          searchResult.map((image) => (
            <div key={image.id} style={{ margin: '10px' }}>
              <img src={image.src} alt="Uploaded" style={{ width: '150px', height: '150px' }} />
              <p>Detected Colors: {image.colorCategories.join(', ')}</p>
              <div style={{ display: 'flex', marginTop: '5px' }}>
                {image.colorSwatches.map((color: [number, number, number], index: number) => (
                  <div
                    key={index}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                      margin: '2px',
                      borderRadius: '50%',
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No images found</p>
        )}
      </div>
    </div>
  );
}