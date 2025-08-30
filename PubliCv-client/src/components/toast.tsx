import React, { useEffect, useState } from "react";

interface ToastProps {
    message: string;
    isPositive?: boolean; // default true
    duration?: number; // in ms, default 3000
}

const Toast: React.FC<ToastProps> = ({ message, isPositive = true, duration = 4000 }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    return (
        <div
            style={{
                position: "fixed",
                bottom: "2rem",
                left: "50%",
                transform: "translateX(-50%)",
                background: isPositive ? "#0a1d49" : "red",
                color: "#fff",
                padding: "1rem 2rem",
                borderRadius: "8px",
                boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.3s, transform 0.3s",
                transformOrigin: "bottom",
                zIndex: 9999,
            }}
        >
            {message}
        </div>
    );
};

export default Toast;
