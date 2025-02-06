import React from 'react';

const CircularLoader = ({ size = 5, color = '#FFFF' }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
      <div className="flex space-x-1">
        <span
          className="dot"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            animationDelay: '0s',
          }}
        ></span>
        <span
          className="dot"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            animationDelay: '0.2s',
          }}
        ></span>
        <span
          className="dot"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            animationDelay: '0.4s',
          }}
        ></span>
      </div>

      <style jsx>{`
        .dot {
          display: inline-block;
          border-radius: 50%;
          animation: bounce 1.2s infinite ease-in-out;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default CircularLoader;
