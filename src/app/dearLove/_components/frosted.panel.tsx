// components/FrostedPanel.tsx
import React from 'react';

export default function FrostedPanel({
    img,
    children,
    className = '',
}: {
    img: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={`relative overflow-hidden rounded-2xl border border-[#e3ecdc] shadow-sm ${className}`}>
            {/* BG layers only for THIS component */}
            <div className="absolute inset-0 -z-10">
                {/* cover image */}
                <div
                    className="absolute inset-0 bg-center bg-cover scale-[1.06] blur-[6px] saturate-[.85] brightness-[.9]"
                    style={{ backgroundImage: `url(${img})` }}
                />
                {/* wash + radial + top/bottom gradient */}
                <div className="absolute inset-0 bg-white/65" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.6)_45%,rgba(0,0,0,0.04)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#f3f7ee]/70 via-transparent to-[#f3f7ee]/80" />
            </div>

            {/* content sits on top */}
            <div className="relative">{children}</div>
        </section>
    );
}
