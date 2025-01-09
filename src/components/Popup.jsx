import React from 'react';
import '../styles/Popup.css';

const Popup = ({ message, visible }) => {
    return (
        <div className={`popup ${visible ? 'visible' : ''}`}>
            {message}
        </div>
    );
};

export default Popup;
