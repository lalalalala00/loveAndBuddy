import { useEffect, useState } from 'react';
import { Active, scrollToId, SECTIONS } from '.';
import cx from 'classnames';

export default function Sidebar({ active, onNavigate }: { active: Active; onNavigate?: () => void }) {
    const [open, setOpen] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (active?.groupId) setOpen((o) => ({ ...o, [active.groupId]: true }));
    }, [active?.groupId]);

    const toggle = (gid: string) => setOpen((o) => ({ ...o, [gid]: !o[gid] }));

    return (
        <nav className="bg-white dark:bg-neutral-900/60 backdrop-blur border border-neutral-200/70 dark:border-neutral-800 rounded-2xl p-3 shadow-sm max-h-[80vh] overflow-auto no-scrollbar">
            {SECTIONS.map((group) => {
                const isGroupActive = active && active.groupId === group.id;
                const isOpen = open[group.id] ?? true;

                return (
                    <section
                        key={group.id}
                        className={cx('mb-2 rounded-xl transition', isGroupActive && 'bg-[#f9fbf6]')}
                    >
                        <button
                            type="button"
                            className={cx(
                                'w-full flex items-center justify-between px-2 py-2 text-xs uppercase tracking-wide rounded-xl',
                                'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60',
                            )}
                            aria-expanded={isOpen}
                            aria-controls={`group-${group.id}`}
                            onClick={() => toggle(group.id)}
                        >
                            <span>{group.title}</span>
                            <svg
                                className={cx('h-4 w-4 transition', isOpen ? 'rotate-180' : 'rotate-0')}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        <div
                            id={`group-${group.id}`}
                            className={cx('mt-1 overflow-hidden transition-all', isOpen ? 'max-h-96' : 'max-h-0')}
                        >
                            <ul
                                role="list"
                                className={cx(
                                    'space-y-0.5 rounded-xl p-1 border border-transparent',
                                    isGroupActive && 'border-[#eff2ed] shadow',
                                )}
                            >
                                {group.items.map((item) => {
                                    const isActive = active && active.groupId === group.id && active.itemId === item.id;
                                    return (
                                        <li key={item.id}>
                                            <button
                                                className={cx(
                                                    'w-full text-left px-2 py-1.5 rounded-lg transition focus:outline-none  dark:focus:ring-emerald-800/60',
                                                    isActive
                                                        ? 'bg-[#e3ecdc] text-[#303d23] font-semibold dark:bg-emerald-900/40 dark:text-emerald-200'
                                                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                                                )}
                                                onClick={() => {
                                                    scrollToId(`${group.id}__${item.id}`);
                                                    onNavigate?.();
                                                }}
                                                aria-current={isActive ? 'page' : undefined}
                                            >
                                                <span className="text-sm">{item.title}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </section>
                );
            })}
        </nav>
    );
}
