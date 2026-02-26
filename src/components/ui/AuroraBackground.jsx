import React from "react";

export const AuroraBackground = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={`aurora-wrapper ${className || ""}`}
            {...props}
        >
            <div className="aurora-container">
                <div className="aurora-inner" />
                <div className="aurora-mask" />
            </div>
            <div className="relative z-10 w-full min-h-screen">
                {children}
            </div>
        </div>
    );
};

