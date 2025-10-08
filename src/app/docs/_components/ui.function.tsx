import { ReactNode } from 'react';

export function Card({ children }: { children: React.ReactNode }) {
    return <section className="rounded-2xl  bg-white dark:bg-neutral-900 p-5 lg:p-6 shadow-sm">{children}</section>;
}

export function Divider() {
    return <hr className="my-5 border-neutral-200 dark:border-neutral-800" />;
}
export function DividerS() {
    return <hr className="my-5 mx-20 border-gray-200 dark:border-neutral-800" />;
}

export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="scroll-mt-24">
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                {title}
                <a
                    href={`#${id}`}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    aria-label="Copy link"
                    onClick={(e) => {
                        navigator.clipboard.writeText(location.origin + location.pathname + `#${id}`);
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                            d="M10 14l-1 1a4 4 0 1 1-6-6l2-2a4 4 0 0 1 6 0"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M14 10l1-1a4 4 0 1 1 6 6l-2 2a4 4 0 0 1-6 0"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </a>
            </h2>
            <div className="mt-3 text-[15px] leading-7 text-neutral-800/90 dark:text-neutral-200/90">{children}</div>
        </section>
    );
}

export function FlowList({ items }: { items: string[] }) {
    return (
        <ol className="relative border-s border-neutral-200 dark:border-neutral-800 pl-6 space-y-3">
            {items.map((item, i) => (
                <li key={i} className="ms-4">
                    <div className="absolute w-2 h-2 rounded-full bg-[#69b225] -start-1 mt-2" />
                    <div className="text-[15px]">{item}</div>
                </li>
            ))}
        </ol>
    );
}

export function PlaceholderImage({ img, label, desc }: { img: string; label?: string; desc?: string | ReactNode }) {
    return (
        <div className="w-full rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-sm mb-5">
            <figure className="w-full rounded-t-xl  ">
                {label && (
                    <figcaption className="px-3 py-2 text-sm font-medium bg-gray-100 rounded-t-xl">{label}</figcaption>
                )}
                <div className="flex justify-center w-full">
                    <img
                        src={img}
                        alt={label || 'wireframe'}
                        className="block w-auto h-auto object-none"
                        loading="lazy"
                    />
                </div>
            </figure>

            {desc && (
                <div className=" p-4 rounded-b-xl border-t border-gray-200  bg-neutral-50 dark:bg-neutral-800 text-sm leading-relaxed whitespace-pre-line">
                    {desc}
                </div>
            )}
        </div>
    );
}

export const conceptImgs = [5, 11, 4, 7, 8, 2];
