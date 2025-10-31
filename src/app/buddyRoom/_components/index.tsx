'use client';

import ModalIos from '@/common/modal.ios';
import { useUserState } from '@/context/useUserContext';
import { Booking, Card, DearLove, SelectedAnimals } from '@/utils/data';
import { getDecadeLabel } from '@/utils/date';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

type SelectedAnimalExtra = {
    animalId: string;
    birth_year: number;
    type: 'dog' | 'cat' | 'others' | 'rabbit' | 'ferret' | 'bird' | 'raccoon' | 'hamster';
    variety: string;
    color: string;
    personality: 'introvert' | 'extrovert';
    level: number | string;
    comment: string;
    img: string;

    animal_uuid: string;
    owner_uuid?: string;
    heart?: number | null;
    manner?: number | null;
    owner_nickname?: string;
};

type LocalSelectedAnimal = SelectedAnimals & Partial<SelectedAnimalExtra>;
type BookingLocal = Omit<Booking, 'animals'> & {
    animals: LocalSelectedAnimal[];
};

const fmtDate = (input?: number | string | null) => {
    if (input === null || input === undefined) return '-';
    let d: Date;

    if (typeof input === 'number') {
        d = input < 2_000_000_000 ? new Date(input * 1000) : new Date(input);
    } else if (typeof input === 'string') {
        d = new Date(input);
    } else {
        return '-';
    }

    if (isNaN(d.getTime())) return '-';
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const wk = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    return `${y}.${m}.${day} (${wk})`;
};

const ymd = (input?: number | string | null) => {
    if (input === null || input === undefined) return '';
    const d =
        typeof input === 'number'
            ? input < 2_000_000_000
                ? new Date(input * 1000)
                : new Date(input)
            : new Date(input);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const keyFromBooking = (r: BookingLocal) => `${r.user?.uuid ?? ''}__${ymd(r.date)}`;
const keyFromDearLove = (d: DearLove) => `${d.author_id ?? ''}__${ymd(d.date_at)}`;

const Line = () => <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />;

const InfoRow = ({ label, value }: { label: React.ReactNode; value: React.ReactNode }) => (
    <div className="flex justify-between w-full items-center py-1">
        <span className="text-[12px] text-gray-600">{label}</span>
        <span className="text-[13px] font-medium text-gray-800">{value}</span>
    </div>
);

const ReservationCard = ({ r }: { r: BookingLocal }) => {
    const first = r.animals?.[0];
    const firstLevel = (first as any)?.level ?? '-';
    const firstName = first?.name ?? 'Love';
    const ownerName = r.user?.name ?? r.user?.uuid ?? '상대';

    return (
        <div
            className="min-w-[280px] snap-start rounded-xl border border-[#e3ecdc] bg-white shadow-[4px_4px_10px_#f1f4ee,-4px_-4px_10px_#fff] p-3"
            role="group"
        >
            <div className="flex items-center gap-3">
                <img
                    src={r.user?.avatar_url || '/project/buddy_sit_1.png'}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover shadow"
                />
                <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 truncate">
                        {ownerName}
                        <span className="text-gray-400"> / </span>
                        <span className="text-gray-700">{firstName}</span>
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">{fmtDate(r.date)}</p>
                </div>
            </div>

            <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="space-y-1">
                <InfoRow label="📍 동네" value={r.location?.join(' ') || '-'} />
                <InfoRow label="🏠 장소" value={r.place || '-'} />
                <InfoRow label="⚡️ 난이도" value={<span>Lv.{firstLevel}</span>} />
            </div>
        </div>
    );
};

const DearLoveCard = ({ d, onClick }: { d: DearLove; onClick?: (d: DearLove) => void }) => (
    <button
        type="button"
        onClick={onClick ? () => onClick(d) : undefined}
        className="text-left rounded-xl overflow-hidden border border-[#e3ecdc] bg-white shadow-[4px_4px_10px_#f1f4ee,-4px_-4px_10px_#fff] hover:shadow-[6px_6px_14px_#eef3e6,-6px_-6px_14px_#fff] transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-100"
    >
        <div className="w-full h-28 bg-gray-100">
            {d.representative_img ? (
                <img src={d.representative_img} alt="" className="w-full h-full object-cover" />
            ) : null}
        </div>
        <div className="p-3">
            <p className="text-[13px] font-semibold text-gray-900 truncate">{d.title ?? 'Dear Love'}</p>
            <p className="text-[11px] text-gray-500 mb-1">{d.date_at ? fmtDate(d.date_at) : ''}</p>
            {d.comment ? <p className="text-[12px] text-gray-600 line-clamp-2">{d.comment}</p> : null}
        </div>
    </button>
);

function BuddyRoom({
    buddy,
    upcoming,
    past,
    dearLove,
}: {
    buddy: Card;
    upcoming: BookingLocal[];
    past: BookingLocal[];
    dearLove: DearLove[];
}) {
    const router = useRouter();
    const { certificates, getUser } = useUserState();
    const [open, setOpen] = useState<boolean>(false);

    const [dlOpen, setDlOpen] = useState(false);
    const [dlItem, setDlItem] = useState<DearLove | null>(null);

    const sp = useSearchParams();

    const buddyInfo = {
        from: sp.get('from'),
        name: sp.get('name') ?? getUser?.name,
        avatar_url: sp.get('avatar_url') ?? getUser?.avatar_url,
        heart: Number(sp.get('heart') ?? 3),
        manner: Number(sp.get('manner') ?? 9),
        dearLove: Number(sp.get('dear_love') ?? 34),
        type: sp.get('type') ?? getUser?.type,
        gender: sp.get('gender') ?? 'female',
        user_id: sp.get('user_id') ?? getUser?.id,
        birth_year: sp.get('user_birth_year') ?? getUser?.birth_year,
        user_comment: sp.get('user_comment') ?? getUser?.user_comment,
        animal_type: sp.get('animal_type') ?? 'Dog',
    };

    const isMyRoom = !buddyInfo.user_id;

    const dlMap = useMemo(() => {
        const m = new Map<string, DearLove>();
        for (const d of dearLove) m.set(keyFromDearLove(d), d);
        return m;
    }, [dearLove]);

    const openDL = (d: DearLove) => {
        setDlItem(d);
        setDlOpen(true);
    };
    const writeDL = (r: BookingLocal) => {
        router.push('/dearLove/write');
    };

    return (
        <div className="mx-auto max-w-4xl w-full p-4 space-y-6 mb-40 mt-8">
            <h2 className="text-[16px] font-semibold">{isMyRoom ? '내 버디룸' : `${buddyInfo.name}님의 버디룸`}</h2>
            <section className="rounded-2xl border border-[#e3ecdc] bg-white/80 backdrop-blur p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <div className="rounded-xl border border-[#e3ecdc] bg-white overflow-hidden">
                            <img
                                src={buddyInfo?.avatar_url || '/project/buddy_sit_1.png'}
                                alt=""
                                className="w-full aspect-[4/3] object-cover"
                            />
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-[#e3ecdc] to-transparent mt-1" />

                        <div className="mt-1 flex items-center justify-between px-2">
                            <p className="text-[15px] font-semibold text-gray-900 truncate">{buddyInfo?.name}</p>
                            <span className="shrink-0 font-semibold inline-flex items-center rounded-full border border-[#e3ecdc] bg-white px-2 py-0.5 text-[11px] text-gray-700">
                                🌿 {buddyInfo?.type}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <figure className="rounded-xl border border-[#e3ecdc] bg-white px-4 py-2">
                            <blockquote className="text-[14px] text-gray-700 font-semibold">
                                “ {buddyInfo?.user_comment} ”
                            </blockquote>
                        </figure>
                        <div className="rounded-xl border border-[#e3ecdc] bg-white px-2 py-3 space-y-3">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="rounded-xl border border-[#e3ecdc] bg-white px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                                    <p className="text-[11px] text-gray-500">ꯁꯧ 마음</p>
                                    <p className="text-[14px] font-semibold text-gray-900">{buddyInfo.heart}</p>
                                </div>
                                <div className="rounded-xl border border-[#e3ecdc] bg-white px-3 py-2">
                                    <p className="text-[11px] text-gray-500">🍃 매너</p>
                                    <p className="text-[14px] font-semibold text-gray-900">{buddyInfo.manner}</p>
                                </div>
                                <div className="rounded-xl border border-[#e3ecdc] bg-white px-3 py-2">
                                    <p className="text-[11px] text-gray-500">✎ 디얼러브</p>
                                    <p className="text-[14px] font-semibold text-gray-900">{buddyInfo.dearLove}</p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-[#e3ecdc] bg-white px-3 py-3">
                                <p className="text-[11px] text-gray-500 mb-2">버디 정보</p>
                                <div className="divide-y divide-[#f3f7ee]">
                                    <div className="flex justify-between py-1">
                                        <span className="text-[12px] text-gray-500">연령대</span>
                                        <span className="text-[13px] font-medium text-gray-800">
                                            {getDecadeLabel(buddyInfo?.birth_year)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-[12px] text-gray-500">성별</span>
                                        <span className="text-[13px] font-medium text-gray-800">
                                            {buddyInfo.gender}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-[12px] text-gray-500">선호 동물</span>
                                        <span className="text-[13px] font-medium text-gray-800">
                                            {buddyInfo.animal_type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-[#e3ecdc] to-transparent" />

                            <div>
                                <div className="flex items-center justify-between text-[12px] text-[#4a6ea8] mb-1">
                                    <span>신뢰도</span>
                                    <span className="font-medium">79/100%</span>
                                </div>
                                <div className="w-full h-2.5 rounded-full bg-[#e9effa] overflow-hidden shadow-inner">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#dce8ff] to-[#9fbdf2] transition-[width]"
                                        style={{ width: `${(79 / 100) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-[#e3ecdc] bg-gradient-to-br from-[#f8faf6] to-white backdrop-blur p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[13px] font-semibold text-[#3c5732]">자격증 정보</h3>
                    <span className="text-[11px] text-gray-500">인증된 자격증 {certificates.length}개</span>
                </div>

                {certificates.length === 0 ? (
                    <p className="text-[12px] text-gray-500 text-center py-4">등록된 자격증 정보가 없습니다.</p>
                ) : (
                    <ul className="divide-y divide-[#e3ecdc]">
                        {certificates.map((c, i) => (
                            <li key={i} className="py-3">
                                <p className="text-[13px] font-semibold text-gray-800">✰ {c.name}</p>
                                <p className="text-[11px] text-gray-500">
                                    기관: <span className="text-gray-700">{c.issuer}</span>
                                    <span className="mx-1 text-gray-300">·</span>
                                    취득: <span className="text-gray-700">{c.acquired_at}</span>
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="rounded-2xl border border-[#e3ecdc] bg-white/80 backdrop-blur p-4">
                <header className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-semibold text-gray-900">📅 다가오는 예약</h2>
                </header>
                {upcoming.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
                        <p className="text-[13px] text-gray-500">다가오는 예약이 없어요.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-3">
                        {upcoming.map((r) => (
                            <ReservationCard key={r.uuid} r={r} />
                        ))}
                    </div>
                )}
            </section>

            <section className="rounded-2xl border border-[#e3ecdc] bg-white/80 backdrop-blur p-4">
                <header className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-semibold text-gray-900">⏳ 지난 예약</h2>
                    <button onClick={() => setOpen(true)} className="text-[12px] text-gray-600 hover:text-gray-800">
                        전체 보기
                    </button>
                </header>

                {past.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
                        <p className="text-[13px] text-gray-500">지난 예약 기록이 아직 없어요.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="inline-flex gap-3 snap-x snap-mandatory pr-1">
                            {past.map((r) => {
                                const hasDL = dlMap.has(keyFromBooking(r));
                                const dl = hasDL ? dlMap.get(keyFromBooking(r))! : null;
                                return (
                                    <div key={r.uuid} className="relative flex flex-col items-stretch">
                                        <ReservationCard r={r} />
                                        <div className="absolute top-4 right-2">
                                            {hasDL ? (
                                                <button
                                                    className="text-[12px] px-3 py-1 rounded-lg border border-[#e3ecdc] bg-white hover:bg-[#f7faf3] text-gray-700"
                                                    onClick={() => openDL(dl!)}
                                                >
                                                    디얼러브 보기
                                                </button>
                                            ) : (
                                                <button
                                                    className="text-[12px] px-3 py-1 rounded-lg border border-dashed border-gray-300 bg-white hover:bg-[#fafafa] text-gray-500"
                                                    onClick={() => writeDL(r)}
                                                >
                                                    디얼러브 쓰기
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </section>

            <section className="rounded-2xl border border-[#e3ecdc] bg-white/80 backdrop-blur p-4">
                <header className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-semibold text-gray-900">✎ Dear Love</h2>
                    <button className="text-[12px] text-gray-600 hover:text-gray-800">새 글 쓰기</button>
                </header>

                {dearLove.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
                        <p className="text-[13px] text-gray-500">아직 작성된 디얼러브가 없어요.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {dearLove.map((d) => (
                            <DearLoveCard key={d.id} d={d} onClick={openDL} />
                        ))}
                    </div>
                )}
            </section>

            {open && (
                <ModalIos
                    isOpen={open}
                    handleModalState={() => setOpen(!open)}
                    width="420px"
                    height="620px"
                    title="전체보기"
                >
                    <div className="max-h-[500px] overflow-y-auto p-4 space-y-3 no-scrollbar">
                        <div className="flex flex-col">
                            {past.map((r) => {
                                const hasDL = dlMap.has(keyFromBooking(r));
                                const dl = hasDL ? dlMap.get(keyFromBooking(r))! : null;
                                return (
                                    <div key={r.uuid} className="relative flex flex-col items-stretch mb-2">
                                        <ReservationCard r={r} />
                                        <div className="absolute top-4 right-2">
                                            {hasDL ? (
                                                <button
                                                    className="text-[12px] px-3 py-1 rounded-lg border border-[#e3ecdc] bg-white hover:bg-[#f7faf3] text-gray-700"
                                                    onClick={() => openDL(dl!)}
                                                >
                                                    디얼러브 보기
                                                </button>
                                            ) : (
                                                <button
                                                    className="text-[12px] px-3 py-1 rounded-lg border border-dashed border-gray-300 bg-white hover:bg-[#fafafa] text-gray-500"
                                                    onClick={() => writeDL(r)}
                                                >
                                                    디얼러브 쓰기
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </ModalIos>
            )}

            {dlOpen && dlItem && (
                <ModalIos
                    isOpen={dlOpen}
                    handleModalState={() => setDlOpen(false)}
                    width="420px"
                    height="620px"
                    title="디얼러브"
                >
                    <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto no-scrollbar">
                        {dlItem.representative_img ? (
                            <div className="rounded-xl overflow-hidden border border-[#e3ecdc]">
                                <img src={dlItem.representative_img} alt="" className="w-full object-cover" />
                            </div>
                        ) : null}
                        <div>
                            <p className="text-[14px] font-semibold text-gray-900">{dlItem.title}</p>
                            <p className="text-[11px] text-gray-500">{fmtDate(dlItem.date_at)}</p>
                        </div>
                        {dlItem.comment ? (
                            <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {dlItem.comment}
                            </p>
                        ) : null}
                        <div className="grid grid-cols-2 gap-2">
                            <InfoRow label="📍 동네" value={dlItem.location ?? '-'} />
                            <InfoRow label="🏠 장소" value={dlItem.place ?? '-'} />
                        </div>
                    </div>
                </ModalIos>
            )}
        </div>
    );
}
export default function Index() {
    const buddy: Card = {
        uuid: 'b1',
        name: '버디 토끼',
        avatar_url: '/cha/1_1.png',
        type: 'buddy',
        birth_year: '1995',
        user_comment: '사랑스러운 러브들과 따뜻한 시간을 만듭니다.',

        cardKind: 'buddy',
        heart: 12,
        manner: 8,
        dearLove: 34,
        reliability: 96,

        gender: 'female',
        bookmarks: null,
        bookings: null,
        certificates: [],
        animals: [],
    };

    const upcoming: BookingLocal[] = [
        {
            uuid: 'u1',
            user: {
                uuid: 'love-1',
                name: '라라',
                avatar_url: '/cha/1_2.png',
                type: 'love',
                birth_year: '1993',
                user_comment: '첫 만남입니다. 천천히 산책 위주로 부탁드려요.',
            },
            buddy: {
                uuid: buddy.uuid,
                name: buddy.name,
                avatar_url: buddy.avatar_url,
                type: buddy.type,
                birth_year: buddy.birth_year,
                user_comment: buddy.user_comment,
            },
            date: Math.floor(new Date('2025-11-04').getTime() / 1000),
            place: '서울숲',
            location: ['성동구', '성수동'],
            animals: [
                {
                    id: 'a1',
                    name: '몽글',
                    isFirst: true,
                    avatar_url: '/cha/1_2.png',
                    animalId: 'a1',
                    birth_year: 2020,
                    type: 'dog',
                    variety: '',
                    color: '',
                    personality: 'introvert',
                    level: 4,
                    comment: '',
                    img: '/cha/1_2.png',
                    animal_uuid: 'a1',
                },
            ],
        },

        {
            uuid: 'u2',
            user: {
                uuid: 'love-4',
                name: '보리',
                avatar_url: '/cha/1_3.png',
                type: 'love',
                birth_year: '1992',
                user_comment: '처음이라 천천히 적응할게요.',
            },
            buddy: {
                uuid: buddy.uuid,
                name: buddy.name,
                avatar_url: buddy.avatar_url,
                type: buddy.type,
                birth_year: buddy.birth_year,
                user_comment: buddy.user_comment,
            },
            date: Math.floor(new Date('2025-11-07').getTime() / 1000),
            place: '애견카페 [잘놀아]',
            location: ['광진구', '자양동'],
            animals: [
                {
                    id: 'a4',
                    name: '보리',
                    isFirst: true,
                    avatar_url: '/cha/1_3.png',
                    animalId: 'a4',
                    birth_year: 2022,
                    type: 'dog',
                    variety: '',
                    color: '',
                    personality: 'extrovert',
                    level: 5,
                    comment: '',
                    img: '/cha/1_3.png',
                    animal_uuid: 'a4',
                },
            ],
        },

        {
            uuid: 'u3',
            user: {
                uuid: 'love-5',
                name: '새벽이엄마',
                avatar_url: '/cha/1_4.png',
                type: 'love',
                birth_year: '1997',
                user_comment: '사람은 조금 무서워해요.',
            },
            buddy: {
                uuid: buddy.uuid,
                name: buddy.name,
                avatar_url: buddy.avatar_url,
                type: buddy.type,
                birth_year: buddy.birth_year,
                user_comment: buddy.user_comment,
            },
            date: Math.floor(new Date('2025-11-12').getTime() / 1000),
            place: '한강 시민공원',
            location: ['마포구', '망원동'],
            animals: [
                {
                    id: 'a5',
                    name: '새벽',
                    isFirst: true,
                    avatar_url: '/cha/1_4.png',
                    animalId: 'a5',
                    birth_year: 2021,
                    type: 'cat',
                    variety: '',
                    color: '',
                    personality: 'introvert',
                    level: 2,
                    comment: '',
                    img: '/cha/1_4.png',
                    animal_uuid: 'a5',
                },
            ],
        },
    ];

    const past: BookingLocal[] = [
        {
            uuid: 'p1',
            user: {
                uuid: 'love-2',
                name: '초코송이',
                avatar_url: '/cha/1_3.png',
                type: 'love',
                birth_year: '1990',
                user_comment: '바람이 강해서 짧게 산책했어요.',
            },
            buddy: {
                uuid: buddy.uuid,
                name: buddy.name,
                avatar_url: buddy.avatar_url,
                type: buddy.type,
                birth_year: buddy.birth_year,
                user_comment: buddy.user_comment,
            },
            date: Math.floor(new Date('2025-10-21').getTime() / 1000),
            place: '망원 한강공원',
            location: ['마포구', '합정동'],
            animals: [
                {
                    id: 'a2',
                    name: '초코',
                    isFirst: true,
                    avatar_url: '/cha/1_3.png',
                    animalId: 'a2',
                    birth_year: 2019,
                    type: 'dog',
                    variety: '',
                    color: '',
                    personality: 'extrovert',
                    level: 6,
                    comment: '',
                    img: '/cha/1_3.png',
                    animal_uuid: 'a2',
                },
            ],
        },

        {
            uuid: 'p2',
            user: {
                uuid: 'love-3',
                name: '민트',
                avatar_url: '/cha/1_4.png',
                type: 'love',
                birth_year: '1996',
                user_comment: '소리에 민감해서 조용히 놀아줬어요.',
            },
            buddy: {
                uuid: buddy.uuid,
                name: buddy.name,
                avatar_url: buddy.avatar_url,
                type: buddy.type,
                birth_year: buddy.birth_year,
                user_comment: buddy.user_comment,
            },
            date: Math.floor(new Date('2025-10-18').getTime() / 1000),
            place: '집 앞 정원',
            location: ['성북구', '성북동'],
            animals: [
                {
                    id: 'a3',
                    name: '나뭇잎',
                    isFirst: true,
                    avatar_url: '/cha/1_4.png',
                    animalId: 'a3',
                    birth_year: 2021,
                    type: 'cat',
                    variety: '',
                    color: '',
                    personality: 'introvert',
                    level: 3,
                    comment: '',
                    img: '/cha/1_4.png',
                    animal_uuid: 'a3',
                },
            ],
        },

        {
            uuid: 'p3',
            user: {
                uuid: 'love-6',
                name: '유리',
                avatar_url: '/cha/1_1.png',
                type: 'love',
                birth_year: '1994',
                user_comment: '',
            },
            buddy: {
                uuid: buddy.uuid,
                name: buddy.name,
                avatar_url: buddy.avatar_url,
                type: buddy.type,
                birth_year: buddy.birth_year,
                user_comment: buddy.user_comment,
            },
            date: Math.floor(new Date('2025-10-15').getTime() / 1000),
            place: '남산 둘레길',
            location: ['용산구', '이태원동'],
            animals: [
                {
                    id: 'a6',
                    name: '밤비',
                    isFirst: true,
                    avatar_url: '/cha/1_1.png',
                    animalId: 'a6',
                    birth_year: 2018,
                    type: 'dog',
                    variety: '',
                    color: '',
                    personality: 'extrovert',
                    level: 5,
                    comment: '',
                    img: '/cha/1_1.png',
                    animal_uuid: 'a6',
                },
            ],
        },

        {
            uuid: 'p4',
            user: {
                uuid: 'love-7',
                name: '보늬',
                avatar_url: '/cha/1_2.png',
                type: 'love',
                birth_year: '1991',
                user_comment: '',
            },
            buddy: {
                uuid: buddy.uuid,
                name: buddy.name,
                avatar_url: buddy.avatar_url,
                type: buddy.type,
                birth_year: buddy.birth_year,
                user_comment: buddy.user_comment,
            },
            date: Math.floor(new Date('2025-10-10').getTime() / 1000),
            place: '뚝섬 한강공원',
            location: ['광진구', '자양동'],
            animals: [
                {
                    id: 'a7',
                    name: '자두',
                    isFirst: true,
                    avatar_url: '/cha/1_2.png',
                    animalId: 'a7',
                    birth_year: 2017,
                    type: 'dog',
                    variety: '',
                    color: '',
                    personality: 'introvert',
                    level: 7,
                    comment: '',
                    img: '/cha/1_2.png',
                    animal_uuid: 'a7',
                },
            ],
        },

        {
            uuid: 'p5',
            user: {
                uuid: 'love-8',
                name: '소호',
                avatar_url: '/cha/1_3.png',
                type: 'love',
                birth_year: '1998',
                user_comment: '',
            },
            buddy: {
                uuid: buddy.uuid,
                name: buddy.name,
                avatar_url: buddy.avatar_url,
                type: buddy.type,
                birth_year: buddy.birth_year,
                user_comment: buddy.user_comment,
            },
            date: Math.floor(new Date('2025-10-05').getTime() / 1000),
            place: '소공원',
            location: ['중구', '신당동'],
            animals: [
                {
                    id: 'a8',
                    name: '라일락',
                    isFirst: true,
                    avatar_url: '/cha/1_3.png',
                    animalId: 'a8',
                    birth_year: 2020,
                    type: 'dog',
                    variety: '',
                    color: '',
                    personality: 'introvert',
                    level: 2,
                    comment: '',
                    img: '/cha/1_3.png',
                    animal_uuid: 'a8',
                },
            ],
        },

        {
            uuid: 'p6',
            user: {
                uuid: 'love-9',
                name: '단풍',
                avatar_url: '/cha/1_4.png',
                type: 'love',
                birth_year: '1995',
                user_comment: '',
            },
            buddy: {
                uuid: buddy.uuid,
                name: buddy.name,
                avatar_url: buddy.avatar_url,
                type: buddy.type,
                birth_year: buddy.birth_year,
                user_comment: buddy.user_comment,
            },
            date: Math.floor(new Date('2025-09-29').getTime() / 1000),
            place: '동네 산책로',
            location: ['동대문구', '휘경동'],
            animals: [
                {
                    id: 'a9',
                    name: '단풍이',
                    isFirst: true,
                    avatar_url: '/cha/1_4.png',
                    animalId: 'a9',
                    birth_year: 2016,
                    type: 'dog',
                    variety: '',
                    color: '',
                    personality: 'extrovert',
                    level: 4,
                    comment: '',
                    img: '/cha/1_4.png',
                    animal_uuid: 'a9',
                },
            ],
        },

        {
            uuid: 'p7',
            user: {
                uuid: 'love-10',
                name: '하나',
                avatar_url: '/cha/1_1.png',
                type: 'love',
                birth_year: '1999',
                user_comment: '',
            },
            buddy: {
                uuid: buddy.uuid,
                name: buddy.name,
                avatar_url: buddy.avatar_url,
                type: buddy.type,
                birth_year: buddy.birth_year,
                user_comment: buddy.user_comment,
            },
            date: Math.floor(new Date('2025-09-25').getTime() / 1000),
            place: '카페 마당',
            location: ['서대문구', '연희동'],
            animals: [
                {
                    id: 'a10',
                    name: '콩콩',
                    isFirst: true,
                    avatar_url: '/cha/1_1.png',
                    animalId: 'a10',
                    birth_year: 2023,
                    type: 'dog',
                    variety: '',
                    color: '',
                    personality: 'introvert',
                    level: 3,
                    comment: '',
                    img: '/cha/1_1.png',
                    animal_uuid: 'a10',
                },
            ],
        },
    ];

    const dearLove: DearLove[] = [
        {
            id: 'd1',
            author_id: 'love-2', // p1
            author_type: 'love',
            buddy_user_id: buddy.uuid,
            date_at: '2025-10-21',
            start_time: null,
            end_time: null,
            title: '바람 부는 한강',
            weather: 'wind',
            representative_img: '/cha/1_3.png',
            photos: ['/cha/1_3.png'],
            comment: '바람이 강해 짧게 산책하고 포근하게 안아줬어요.',
            location: '마포구 합정동',
            place: '망원 한강공원',
            tags: [],
            visibility: 'public',
            likes: 0,
            bookmarks: 0,
            comments_count: 0,
            created_at: '2025-10-21',
            updated_at: '2025-10-21',
            with_animals: null,
        },
        {
            id: 'd2',
            author_id: 'love-3', // p2
            author_type: 'love',
            buddy_user_id: buddy.uuid,
            date_at: '2025-10-18',
            start_time: null,
            end_time: null,
            title: '조용한 실내 놀이',
            weather: 'rain',
            representative_img: null,
            photos: [],
            comment: '소리에 민감해 조용히 장난감 놀이 중심으로 케어했어요.',
            location: '성북구 성북동',
            place: '집 앞 정원',
            tags: ['/cha/8.jpg'],
            visibility: 'public',
            likes: 0,
            bookmarks: 0,
            comments_count: 0,
            created_at: '2025-10-18',
            updated_at: '2025-10-18',
            with_animals: null,
        },
        {
            id: 'd3',
            author_id: 'love-7', // p4
            author_type: 'love',
            buddy_user_id: buddy.uuid,
            date_at: '2025-10-10',
            start_time: null,
            end_time: null,
            title: '뚝섬의 가을',
            weather: 'sunny',
            representative_img: '/cha/1_2.png',
            photos: ['/cha/1_2.png'],
            comment: '노을이 예뻐서 사진을 많이 찍었어요.',
            location: '광진구 자양동',
            place: '뚝섬 한강공원',
            tags: [],
            visibility: 'public',
            likes: 0,
            bookmarks: 0,
            comments_count: 0,
            created_at: '2025-10-10',
            updated_at: '2025-10-10',
            with_animals: null,
        },
        {
            id: 'd4',
            author_id: 'love-8', // p5
            author_type: 'love',
            buddy_user_id: buddy.uuid,
            date_at: '2025-10-05',
            start_time: null,
            end_time: null,
            title: '소공원의 오후',
            weather: 'cloud',
            representative_img: '/cha/1_3.png',
            photos: ['/cha/IMG_8842.jpeg'],
            comment: '짧은 산책과 가벼운 트릭으로 에너지를 풀었어요.',
            location: '중구 신당동',
            place: '소공원',
            tags: [],
            visibility: 'public',
            likes: 0,
            bookmarks: 0,
            comments_count: 0,
            created_at: '2025-10-05',
            updated_at: '2025-10-05',
            with_animals: null,
        },
        {
            id: 'd5',
            author_id: 'love-10', // p7
            author_type: 'love',
            buddy_user_id: buddy.uuid,
            date_at: '2025-09-25',
            start_time: null,
            end_time: null,
            title: '카페 마당에서의 첫 만남',
            weather: 'sunny',
            representative_img: '/cha/1_1.png',
            photos: ['/cha/1_1.png'],
            comment: '처음이라 천천히 냄새 맡고 분위기에 적응했어요.',
            location: '서대문구 연희동',
            place: '카페 마당',
            tags: [],
            visibility: 'public',
            likes: 0,
            bookmarks: 0,
            comments_count: 0,
            created_at: '2025-09-25',
            updated_at: '2025-09-25',
            with_animals: null,
        },
    ];

    return <BuddyRoom buddy={buddy} upcoming={upcoming} past={past} dearLove={dearLove} />;
}
