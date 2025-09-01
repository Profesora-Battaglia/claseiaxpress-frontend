
import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    visible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, visible }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (visible) {
            setShow(true);
        } else {
            // Delay hiding to allow for fade-out animation
            const timer = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timer);
        }
    }, [visible]);
    
    if (!show) return null;

    return (
        <div 
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800 font-semibold rounded-lg shadow-lg transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ zIndex: 1000 }}
        >
            {message}
        </div>
    );
};

export default Toast;