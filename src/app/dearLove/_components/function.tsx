import { DearLove } from '@/utils/data';

const toMs = (t: number) => (t < 1e12 ? t * 1000 : t);

export function normalizeDearLove(input: DearLove): DearLove {
    const dateMs = toMs(input.date);
    const d = new Date(dateMs);

    return {
        ...input,
        date: dateMs,
        representativeImg: input.representativeImg || input.photos[0] || '',
        // year: input.year ?? d.getFullYear(),
        // month: input.month ?? d.getMonth() + 1,
        // day: input.day ?? d.getDate(),
        // weekday: input.weekday ?? d.getDay(),
        created_at: input.created_at ? toMs(input.created_at) : Date.now(),
        updated_at: Date.now(),
    };
}

export const getDearLoveCover = (dl: DearLove) =>
    dl.representativeImg && dl.representativeImg.length > 0 ? dl.representativeImg : (dl.photos[0] ?? '');
