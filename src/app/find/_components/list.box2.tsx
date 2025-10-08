'use client';

import WeeklyCalendarCard from './weekly.calendar.card';
import NameTag, { NameTagInfoMinimal } from '@/common/name.tag';
import BookingModal from './booking.modal';
import { CardOverviewRow } from './data/cards';
import { Certificate } from '@/utils/sign';
import { SelectedAnimals } from '@/utils/data';

import { Option } from '@/common/selected.box';
import { useState } from 'react';

type Props = { list: CardOverviewRow; selectedAnimals: SelectedAnimals[]; location: Option[] };

export default function ListBox2({ list, selectedAnimals, location }: Props) {
    const [open, setOpen] = useState(false);
    const [infoData, setInfoData] = useState(false);
    const [selectedDT, setSelectedDT] = useState<{ date: string; time: string }>({ date: '', time: '' });

    const certs = (list?.certificates_preview ?? []) as unknown as Certificate[];
    const bullets = certs.flatMap((cp) => [
        ...(Array.isArray(cp.cert) ? cp.cert.map((t) => `✰ ${t} 보유`) : []),
        ...(cp.issuer ? [`✰ ${cp.issuer} 수료`] : []),
        ...(cp.name ? [`✰ ${cp.name} 인증`] : []),
    ]);

    const canRequest = Boolean(selectedDT.date && selectedDT.time.length > 1);

    const onClickReserve = () => {
        // if (!getUser) { /* 로그인 유도 */ return; }
        setOpen(true);
    };

    return (
        <div className="rounded-2xl w-full h-auto shadow">
            <div className="mb-3 rounded-2xl w-full h-auto shadow">
                <div className="flex flex-col items-center bg-[rgb(246,246,246)] border-b border-[rgb(227,227,227)] rounded-t-2xl">
                    <NameTag imgCss="w-[60px] h-[60px]" find info={list as NameTagInfoMinimal} />
                </div>

                <div className="p-2 flex flex-col justify-between gap-2 min-h-[245px] overflow-visible">
                    <div>
                        <div className="text-[12px] text-gray-500 ml-1 mt-2 px-2">
                            📸 사진촬영동의 · 🪪 신원인증 · ✔️ 인성검사완료
                        </div>

                        <WeeklyCalendarCard
                            availability={{ startHour: 9, endHour: 22 }}
                            setSelectedDT={setSelectedDT}
                            infoData={infoData}
                        />

                        <div className="flex flex-col text-[13px] items-start w-full px-2 my-2">
                            {bullets.length ? (
                                bullets.map((text, i) => <span key={i}>{text}</span>)
                            ) : (
                                <span className="text-gray-500">자격증 정보 없음</span>
                            )}

                            <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-0.5" />
                            <span className="text-gray-800">❀ {list.name} 버디의 한마디 -`♡´-</span>
                            <span className="ml-3 font-semibold">{list.user_comment}</span>
                        </div>
                    </div>

                    <button
                        onClick={onClickReserve}
                        disabled={!canRequest}
                        className={`btn-card custom-card w-full rounded-lg py-2 text-[14px] cursor-pointer ${!canRequest ? 'opacity-60 cursor-not-allowed bg-[#e6e6e6]' : ''}`}
                        title={!canRequest ? '날짜/시간을 먼저 선택해주세요' : '예약하기'}
                    >
                        예약하기
                    </button>
                </div>
            </div>

            <BookingModal
                open={open}
                onClose={() => {
                    setInfoData(false);
                    setOpen(false);
                }}
                infoData={infoData}
                setInfoData={setInfoData}
                list={list as NameTagInfoMinimal}
                selectedDT={selectedDT}
                selectedAnimals={selectedAnimals}
                location={location}
                modal={false}
            />
        </div>
    );
}
