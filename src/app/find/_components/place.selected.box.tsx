'use client';

import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';

type Option = { code: string; name: string };

const CSV_PATH = '/lawd.csv';

export default function KoreaLocationSelector_GlobalQuickSearch() {
    const [names, setNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const [sido, setSido] = useState('');
    const [sigungu, setSigungu] = useState('');
    const [selected, setSelected] = useState<Option[]>([]);

    const [addOpen, setAddOpen] = useState(false);
    const [dongQuery, setDongQuery] = useState('');

    const [quick, setQuick] = useState('');

    const clearDongUI = () => {
        setSelected([]);
        setAddOpen(false);
        setDongQuery('');
    };

    const onChangeSido = (newSido: string) => {
        setSido(newSido);
        setSigungu('');
        clearDongUI();
        setQuick('');
    };

    const onChangeSigungu = (newSigungu: string) => {
        setSigungu(newSigungu);
        clearDongUI();
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErr(null);

                const res = await fetch(CSV_PATH, { cache: 'no-store' });
                if (!res.ok) throw new Error(`CSV HTTP ${res.status}`);
                const buf = await res.arrayBuffer();

                let text = '';
                try {
                    text = new TextDecoder('euc-kr').decode(buf);
                } catch {
                    text = new TextDecoder().decode(buf);
                }
                text = text.replace(/\ufeff/g, '').replace(/\r\n/g, '\n');

                let parsed = Papa.parse<string[]>(text, { header: false, skipEmptyLines: true, delimiter: '\t' });
                let matrix = (parsed.data as string[][]).filter((r) => Array.isArray(r) && r.length);
                if (matrix.every((r) => r.length === 1)) {
                    parsed = Papa.parse<string[]>(text, { header: false, skipEmptyLines: true, delimiter: ',' });
                    matrix = (parsed.data as string[][]).filter((r) => Array.isArray(r) && r.length);
                }
                if (!matrix.length) throw new Error('레코드를 읽지 못했습니다.');

                const head = (matrix[0] || []).map((s) => (s ?? '').replace(/\ufeff/g, '').trim());
                const hasHeader = head.some((c) => ['법정동명', '법정동 명', '명칭'].includes(c));
                const rowsOnly = hasHeader ? matrix.slice(1) : matrix;

                const NAME_COL = 1,
                    CLOSED_COL = 2;
                const namesExisting = rowsOnly
                    .filter((r) => (r[CLOSED_COL] ?? '').toString().trim() === '존재')
                    .map((r) => (r[NAME_COL] ?? '').toString().trim())
                    .filter(Boolean);

                setNames(namesExisting);
            } catch (e: any) {
                setErr(e?.message ?? String(e));
                setNames([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const splitName = (full: string) => {
        const parts = full.trim().split(/\s+/).filter(Boolean);
        const sido = parts[0] ?? '';
        const umd = parts[parts.length - 1] ?? '';
        let mid = parts.length >= 3 ? parts.slice(1, -1).join(' ') : '';
        if (mid) {
            const last = mid.split(' ').pop()!;
            if (!/[시군구]$/.test(last)) mid = '';
        }
        return { sido, sigungu: mid, umd };
    };
    const isDongLike = (x: string) => /(동|읍|면|가)$/.test(x) && !/리$/.test(x);
    const norm = (s: string) => s.replace(/\s+/g, '').toLowerCase();

    const sidoOptions: Option[] = useMemo(() => {
        const set = new Set<string>();
        names.forEach((n) => {
            const { sido } = splitName(n);
            if (sido) set.add(sido);
        });
        return Array.from(set)
            .sort((a, b) => a.localeCompare(b, 'ko'))
            .map((n) => ({ code: n, name: n }));
    }, [names]);

    const sigunguOptions: Option[] = useMemo(() => {
        if (!sido) return [];
        const set = new Set<string>();
        names.forEach((n) => {
            const p = splitName(n);
            if (p.sido === sido && p.sigungu) set.add(p.sigungu);
        });
        return Array.from(set)
            .sort((a, b) => a.localeCompare(b, 'ko'))
            .map((n) => ({ code: n, name: n }));
    }, [names, sido]);

    const dongOptions: Option[] = useMemo(() => {
        if (!sido) return [];
        const onlyEupMyeon = sigungu.endsWith('군');
        const isDongLike = (x: string) => (onlyEupMyeon ? /(읍|면)$/.test(x) : /(동|읍|면|가)$/.test(x));

        const m = new Map<string, string>();
        names.forEach((n) => {
            const p = splitName(n);
            if (p.sido !== sido) return;
            if (sigunguOptions.length > 0) {
                if (!sigungu || p.sigungu !== sigungu) return;
            }
            if (!p.umd || !isDongLike(p.umd)) return;
            if (!m.has(n)) m.set(n, p.umd);
        });
        return Array.from(m, ([full, umd]) => ({ code: full, name: umd })).sort((a, b) =>
            a.name.localeCompare(b.name, 'ko'),
        );
    }, [names, sido, sigungu, sigunguOptions.length]);

    const available = useMemo(
        () => dongOptions.filter((d) => !selected.some((s) => s.code === d.code)),
        [dongOptions, selected],
    );

    const filteredAvailable = useMemo(() => {
        if (!dongQuery.trim()) return available;
        const q = dongQuery.replace(/\s+/g, '').toLowerCase();
        return available.filter((o) => o.name.replace(/\s+/g, '').toLowerCase().includes(q));
    }, [available, dongQuery]);

    const quickCandidates = useMemo(() => {
        if (!quick.trim()) return [];
        const q = norm(quick);
        const list: { full: string; p: ReturnType<typeof splitName> }[] = [];
        for (const n of names) {
            const p = splitName(n);
            if (!p.umd || !isDongLike(p.umd)) continue;
            if (norm(n).includes(q) || norm(p.umd).includes(q)) {
                list.push({ full: n, p });
                if (list.length >= 50) break;
            }
        }

        return list.sort(
            (a, b) =>
                a.p.sido.localeCompare(b.p.sido, 'ko') ||
                a.p.sigungu.localeCompare(b.p.sigungu, 'ko') ||
                a.p.umd.localeCompare(b.p.umd, 'ko'),
        );
    }, [names, quick]);

    const addDong = (d: Option) => {
        if (selected.length >= 3) return;
        if (selected.some((x) => x.code === d.code)) return;
        setSelected((prev) => [...prev, d]);
    };
    const removeDong = (code: string) => setSelected((prev) => prev.filter((x) => x.code !== code));

    const pickFromQuick = (full: string) => {
        const p = splitName(full);
        const changingSido = p.sido !== sido;
        const changingSgg = (p.sigungu || '') !== sigungu;

        if (changingSido) {
            // ✅ 시/도 바뀌면 풀 리셋
            setSigungu('');
            setQuick('');
        }
        if (changingSido || changingSgg) clearDongUI();

        setSido(p.sido);
        setSigungu(p.sigungu || '');
        addDong({ code: full, name: p.umd });
        setQuick('');
    };

    useEffect(() => {
        setSigungu('');
        clearDongUI();
        setQuick('');
    }, [sido]);

    useEffect(() => {
        clearDongUI();
    }, [sigungu]);

    if (loading) return <div className="p-4 text-sm text-gray-600">데이터 불러오는 중…</div>;
    if (err) return <div className="p-4 text-sm text-red-500">에러: {err}</div>;

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
                <input
                    className="border px-3 py-2 rounded w-80"
                    placeholder="빠른 검색 (예: 천동, 관저동, 분당구 정자동)"
                    value={quick}
                    onChange={(e) => setQuick(e.target.value)}
                />
                {quick && quickCandidates.length > 0 && (
                    <div className="border rounded w-80 max-h-72 overflow-auto text-sm bg-white">
                        {quickCandidates.map(({ full, p }) => (
                            <button
                                key={full}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                onClick={() => pickFromQuick(full)}
                                title="클릭하면 즉시 추가"
                            >
                                {p.sido} {p.sigungu && `${p.sigungu} `}
                                {p.umd}
                            </button>
                        ))}
                    </div>
                )}
                {quick && quickCandidates.length === 0 && <div className="text-xs text-gray-500">검색 결과 없음</div>}
            </div>

            <div className="flex items-center gap-2">
                <label className="min-w-20 text-sm text-gray-600">시/도</label>
                <select
                    className="border px-3 py-2 rounded w-64"
                    value={sido}
                    onChange={(e) => onChangeSido(e.target.value)}
                >
                    <option value="">시/도 선택</option>
                    {sidoOptions.map((s) => (
                        <option key={s.code} value={s.code}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            {sigunguOptions.length > 0 && (
                <div className="flex items-center gap-2">
                    <label className="min-w-20 text-sm text-gray-600">시/군/구</label>
                    <select
                        className="border px-3 py-2 rounded w-64"
                        value={sigungu}
                        onChange={(e) => onChangeSigungu(e.target.value)}
                        disabled={!sido}
                    >
                        <option value="">{sido ? '시/군/구 선택' : '시/도를 먼저 선택'}</option>
                        {sigunguOptions.map((sg) => (
                            <option key={sg.code} value={sg.code}>
                                {sg.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {sido && (sigunguOptions.length === 0 || sigungu) && (
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600">동 (최대 3개)</label>

                    <div className="flex flex-wrap gap-2">
                        {selected.map((d) => (
                            <button
                                key={d.code}
                                onClick={() => removeDong(d.code)}
                                className="px-3 py-1 rounded-full bg-green-100 text-sm hover:bg-green-200"
                                title="클릭하면 삭제"
                            >
                                {d.name} ✕
                            </button>
                        ))}
                    </div>

                    {selected.length < 3 && (
                        <div className="flex items-center gap-3">
                            <button
                                className="border border-dashed border-gray-400 px-4 py-2 rounded-2xl text-sm hover:bg-gray-50"
                                onClick={() => setAddOpen((v) => !v)}
                                disabled={available.length === 0}
                            >
                                + 동네 추가하기
                            </button>

                            {addOpen && (
                                <div className="flex flex-col gap-2">
                                    <select
                                        className="border px-3 py-2 rounded w-64"
                                        size={6}
                                        defaultValue=""
                                        onChange={(e) => {
                                            const code = e.target.value;
                                            const found = filteredAvailable.find((d) => d.code === code);
                                            if (found) addDong(found);
                                        }}
                                    >
                                        <option value="">동 선택</option>
                                        {filteredAvailable.map((d) => (
                                            <option key={d.code} value={d.code}>
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
