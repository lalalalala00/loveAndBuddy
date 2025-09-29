import dayjs from 'dayjs';

export type Filters = {
    dateKey: 'today' | 'tomorrow' | 'weekend' | 'thisweek' | 'custom' | 'none';
    dateFrom?: string;
    dateTo?: string;
    species: 'all' | 'dog' | 'cat' | 'others';
    genders: ('female' | 'male')[];
    sortKey: 'trust' | 'manner' | 'heart' | 'dearlove';
    sortDir: 'desc' | 'asc';
};

export const at0 = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const fmt = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
export const fmtRange = (s: Date, e: Date) =>
    s.getMonth() === e.getMonth() ? `${s.getMonth() + 1}월 ${s.getDate()}–${e.getDate()}일` : `${fmt(s)}–${fmt(e)}`;
export const weekdayKo = (d: Date, style: 'short' | 'long' = 'short') =>
    d.toLocaleDateString('ko-KR', { weekday: style }).replace('요일', '');

// export const getThisWeekRange = (now = new Date()) => {
//     const n = at0(now);
//     const dow = n.getDay(); // 0:일
//     const mon = new Date(n);
//     mon.setDate(n.getDate() - ((dow + 6) % 7));
//     const fri = new Date(mon);
//     fri.setDate(mon.getDate() + 4);
//     return { start: mon, end: fri };
// };

export const getThisWeekRange = (now = new Date(), { weekStart = 'mon', includeWeekend = true } = {}) => {
    const at0 = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const n = at0(now);
    const dow = n.getDay();
    const start = new Date(n);
    if (weekStart === 'mon') {
        start.setDate(n.getDate() - ((dow + 6) % 7));
    } else {
        start.setDate(n.getDate() - dow);
    }
    const end = new Date(start);
    end.setDate(start.getDate() + (includeWeekend ? 6 : 4));

    return { start, end };
};

export const getUpcomingWeekend = (now = new Date()) => {
    const n = at0(now);
    const toSat = (6 - n.getDay() + 7) % 7;
    const sat = new Date(n);
    sat.setDate(n.getDate() + toSat);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    return { start: sat, end: sun };
};

export const buildDateLabel = (key: Filters['dateKey'], from?: string, to?: string) => {
    const now = new Date();
    switch (key) {
        case 'today':
            return `오늘 (${fmt(at0(now))})`;
        case 'tomorrow': {
            const t = at0(now);
            t.setDate(t.getDate() + 1);
            return `내일 (${fmt(t)})`;
        }
        case 'weekend': {
            const r = getUpcomingWeekend(now);
            return `이번 주말 (${fmtRange(r.start, r.end)})`;
        }
        case 'thisweek': {
            const r = getThisWeekRange(now);
            return `이번 주 (${fmtRange(r.start, r.end)})`;
        }
        case 'custom': {
            if (!from || !to) return '날짜';
            const s = new Date(from),
                e = new Date(to);
            return `${fmtRange(s, e)}`;
        }
        case 'none': {
            const t = at0(now);
            return `전체 (${t.getMonth() + 1}월)`;
        }
        default:
            return '날짜';
    }
};

export const formatDateLongEn = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = dayjs(dateStr);
    return d.isValid() ? d.locale('en').format('MMMM D, YYYY') : dateStr;
};

export function getAgeFromYear(birthYear: number | string, baseDate: Date = new Date()): number {
    const y = typeof birthYear === 'string' ? parseInt(birthYear, 10) : birthYear;
    if (!Number.isFinite(y)) return 0;
    return Math.max(0, baseDate.getFullYear() - y);
}

export function getDecadeLabel(birthYear?: string | number | null, fallback = '20대') {
    const y = Number(birthYear);
    if (!y || !Number.isFinite(y) || String(y).length !== 4) return fallback;
    const now = new Date();
    const currentYear = now.getFullYear();
    const age = Math.max(0, currentYear - y);
    const decade = Math.floor(age / 10) * 10;
    return `${decade}대`;
}

export function inRange(item: any, range: { start: number; end: number }) {
    const bookings: any[] = (item as any).bookings ?? [];
    if (!bookings.length) return true; // 예약 정보가 없으면 날짜 필터 패스
    return bookings.some((b) => {
        if (typeof b.date === 'number') {
            const ms = b.date > 2_000_000_000 ? b.date : b.date * 1000;
            return ms >= range.start && ms <= range.end;
        }
        if (b.start_at) {
            const ms = new Date(b.start_at).getTime();
            return ms >= range.start && ms <= range.end;
        }
        return false;
    });
}

export const formatDate = (ts?: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.toLocaleString('en-US', {
        month: 'short',
    })} ${d.getDate()}, ${d.getFullYear()}`;
};

export function getWeekdayEnCap(dateStr?: string) {
    if (!dateStr) return '';
    const hasTZ = /([zZ])|([+-]\d{2}:\d{2})$/.test(dateStr);
    const iso = hasTZ ? dateStr : `${dateStr}+09:00`;

    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';

    const weekday = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: 'Asia/Seoul',
    }).format(d);

    return weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase();
}
