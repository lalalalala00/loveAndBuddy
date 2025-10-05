export function ScheduleImportModal({
    items,
    onImport,
}: {
    items?: SchedulePick[];
    onImport: (v: {
        date?: string;
        timeStart?: string;
        timeEnd?: string;
        place?: string;
        neighborhood?: string;
    }) => void;
}) {
    return (
        <div className="p-2 bg-[#f5f7ee81] h-[490px] overflow-y-scroll">
            {items?.map((it) => {
                const animals = it.animals ?? [];
                const first = animals[0];
                const restCount = Math.max(0, animals.length - 1);

                return (
                    <button
                        key={it.id}
                        type="button"
                        onClick={() =>
                            onImport({
                                date: it.date,
                                timeStart: it.timeStart,
                                timeEnd: it.timeEnd,
                                place: it.place,
                                neighborhood: it.neighborhood,
                            })
                        }
                        className="p-3 border border-[#e3ecdc] bg-white/80 rounded-2xl shadow-sm hover:shadow-md transition w-full text-left"
                    >
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="min-w-0 flex items-center gap-2 flex-wrap">
                                <div className="flex -space-x-2">
                                    {animals.slice(0, 3).map((a) => (
                                        <img
                                            key={a.animal_uuid ?? a.name}
                                            src={a.img}
                                            alt={a.name}
                                            className="rounded-full w-9 h-9 object-cover ring-1 ring-[#e3ecdc] bg-white"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ))}
                                    {animals.length > 3 && (
                                        <div className="w-9 h-9 rounded-full bg-white ring-1 ring-[#e3ecdc] flex items-center justify-center text-[11px] text-gray-600">
                                            +{animals.length - 3}
                                        </div>
                                    )}
                                </div>
                                <div className="text-[15px] font-semibold text-[#475a43] truncate">
                                    {first?.name ? (
                                        restCount > 0 ? (
                                            <>
                                                <b>{first.name}</b> 외 <b>{restCount}</b>마리
                                            </>
                                        ) : (
                                            first.name
                                        )
                                    ) : (
                                        '반려동물'
                                    )}
                                </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-lg border border-[#e3ecdc] bg-white text-[12px] text-[#475a43]">
                                {it.buddyName ? `${it.buddyName}` : 'buddy'}
                            </span>
                        </div>

                        <div className="bg-[#f5f7ee81] border border-[#e3ecdc] rounded-xl px-3 py-2">
                            <div className="text-[11px] text-gray-500 mb-0.5">날짜 · 시간</div>
                            <div className="text-sm text-gray-800">
                                {it.date ?? '-'} {it.timeStart ?? '-'} - {it.timeEnd ?? '-'}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            <div className="bg-[#f5f7ee81] border border-[#e3ecdc] rounded-xl px-3 py-2">
                                <div className="text-[11px] text-gray-500 mb-0.5">동네</div>
                                <div className="text-sm text-gray-800 truncate">{it.neighborhood || '-'}</div>
                            </div>
                            <div className="bg-[#f5f7ee81] border border-[#e3ecdc] rounded-xl px-3 py-2">
                                <div className="text-[11px] text-gray-500 mb-0.5">장소</div>
                                <div className="text-sm text-gray-800 truncate">{it.place || '-'}</div>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
