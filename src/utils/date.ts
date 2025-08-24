import dayjs from "dayjs";

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