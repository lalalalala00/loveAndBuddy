function toMinutes(hhmm?: string) {
    if (!hhmm) return null;
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
}
function fromMinutes(total: number) {
    const h = String(Math.floor(total / 60)).padStart(2, '0');
    const m = String(total % 60).padStart(2, '0');
    return `${h}:${m}`;
}

const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES_60 = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export function TimeSelect24({
    value,
    onChange,
    min,
}: {
    value?: string; // 'HH:MM'
    onChange: (v: string) => void;
    min?: string; // 'HH:MM' (종료시간에서 시작시간 제약용)
}) {
    const [hour, minute] = (value ?? '').split(':');
    const chosenH = HOURS_24.includes(hour) ? hour : '';
    const chosenM = MINUTES_60.includes(minute) ? minute : '';

    const handleHour = (h: string) => {
        const m = chosenM || '00';
        let next = `${h}:${m}`;
        if (min && toMinutes(next)! < toMinutes(min)!) next = min; // min 보정
        onChange(next);
    };
    const handleMinute = (m: string) => {
        const h = chosenH || '00';
        let next = `${h}:${m}`;
        if (min && toMinutes(next)! < toMinutes(min)!) next = min;
        onChange(next);
    };

    // 종료 셀렉트에서 min이 같은 시간일 때 허용할 분 옵션 보정
    const minMin = min ? toMinutes(min)! : null;

    return (
        <div className="flex items-center gap-2 w-full">
            <select
                value={chosenH}
                onChange={(e) => handleHour(e.target.value)}
                className="w-full rounded-md border border-[#e3ecdc] px-2 py-1 text-sm bg-white"
                aria-label="시간(시)"
            >
                {!chosenH && <option value="">시</option>}
                {HOURS_24.map((h) => (
                    <option key={h} value={h}>
                        {h}
                    </option>
                ))}
            </select>

            <span className="text-gray-400">:</span>

            <select
                value={chosenM}
                onChange={(e) => handleMinute(e.target.value)}
                className="w-full rounded-md border border-[#e3ecdc] px-2 py-1 text-sm bg-white"
                aria-label="시간(분)"
            >
                {!chosenM && <option value="">분</option>}
                {MINUTES_60.map((m) => {
                    if (minMin !== null && value) {
                        const h = chosenH || '00';
                        const candidate = toMinutes(`${h}:${m}`)!;
                        if (candidate < minMin) return null; // min 이전 분 옵션 숨김
                    }
                    return (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
