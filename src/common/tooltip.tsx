'use client';

import React, { useState } from 'react';

const Tooltip = ({
    comment,
    tooltip,
    click,
    onClick,
    clickCss,
    double,
}: {
    comment: string | React.ReactNode;
    tooltip: string;
    click?: boolean;
    onClick?: () => void;
    clickCss?: string;
    double?: boolean;
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const clickHandlers = double ? { onDoubleClick: onClick } : { onClick };

    return (
        <div>
            <div className="flex-1 flex justify-end items-center">
                <button
                    type="button"
                    className={`cursor-pointer ${clickCss || ''}`}
                    {...clickHandlers}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    aria-label={typeof comment === 'string' ? comment : 'tooltip button'}
                >
                    {comment}
                </button>
            </div>

            {showTooltip && (
                <div
                    className="fixed z-50 px-2 py-1 text-[12px] font-semibold text-white bg-black shadow pointer-events-none transition-opacity duration-150"
                    style={{
                        left: cursorPos.x + 15,
                        top: cursorPos.y + 10,
                    }}
                >
                    {tooltip}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
