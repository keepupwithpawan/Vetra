import React from 'react';

const CircularLoader = ({ size = 50 }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
      <div 
        style={{
          width: `${size}px`, 
          height: `${size}px`, 
          borderColor: '#8E44AD', // Deep purple color
          borderTopColor: 'transparent'
        }}
        className="animate-spin rounded-full border-4 border-solid"
      ></div>
    </div>
  );
};

export default CircularLoader;