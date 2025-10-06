import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import ModalIos from '@/common/modal.ios';

export default function DateSelected({
    signupAt,
    setSelectedDate,
}: {
    signupAt?: string | Date | number;
    setSelectedDate: Dispatch<SetStateAction<string>>;
}) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const todayMonth = now.getMonth();

    const signupYear = useMemo(() => {
        if (!signupAt) return currentYear;
        const d = new Date(signupAt);
        return Number.isNaN(d.getTime()) ? currentYear : d.getFullYear();
    }, [signupAt, currentYear]);

    const [year, setYear] = useState<number>(currentYear);
    const [activeMonth, setActiveMonth] = useState<number>(todayMonth);

    const [openMonthPicker, setOpenMonthPicker] = useState(false);
    const [openYearPicker, setOpenYearPicker] = useState(false);

    const selectedMonth = months[activeMonth] ?? 'month';

    const years = useMemo(() => {
        const start = Math.min(signupYear, currentYear);
        const list: number[] = [];
        for (let y = currentYear; y >= start; y--) list.push(y);
        return list;
    }, [signupYear, currentYear]);

    const onKeyActive = (fn: () => void) => (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fn();
        }
    };

    const prevMonth = () => {
        setActiveMonth((i) => {
            if (i === 0) {
                setYear((y) => (y > signupYear ? y - 1 : y));
                return 11;
            }
            return i - 1;
        });
    };

    const nextMonth = () => {
        setActiveMonth((i) => {
            if (i === 11) {
                setYear((y) => (y < currentYear ? y + 1 : y));
                return 0;
            }
            return i + 1;
        });
    };

    useEffect(() => {
        const _Date = `${year}-${String(activeMonth + 1).padStart(2, '0')}`;
        setSelectedDate(_Date);
    }, [activeMonth, year, setSelectedDate]);

    return (
        <section className="mx-auto max-w-full px-3 sticky -top-1 mb-8 flex justify-center z-10 bg-gradient-to-b from-[#f6f9f3] to-transparent">
            <div className="flex pt-5 w-[700px] items-center justify-between p-2">
                <button
                    onClick={prevMonth}
                    className="px-3 py-1.5 rounded-lg hover:bg-[#f8fbf4] border border-[#e3ecdc] text-[15px]"
                    aria-label="이전 달"
                >
                    ‹
                </button>

                <div className="py-1">
                    <span className="text-[22px] md:text-[24px] max-md:text-[16px] font-bold lowercase text-[#5b7551]">
                        ˚₊·{' '}
                        <button
                            onClick={() => setOpenMonthPicker(true)}
                            onKeyDown={onKeyActive(() => setOpenMonthPicker(true))}
                            className="ml-4"
                            aria-haspopup="dialog"
                            aria-expanded={openMonthPicker}
                            aria-controls="month-picker"
                        >
                            {selectedMonth}
                        </button>{' '}
                        ·{' '}
                        <button
                            onClick={() => setOpenYearPicker(true)}
                            onKeyDown={onKeyActive(() => setOpenYearPicker(true))}
                            className="border border-gray-200 px-6 rounded-xl mr-4 bg-[#f1f6ed] custom-card-hover"
                            aria-haspopup="dialog"
                            aria-expanded={openYearPicker}
                            aria-controls="year-picker"
                        >
                            {year}
                        </button>{' '}
                        —̳͟͞͞♡ ˚₊·
                    </span>
                </div>

                <button
                    onClick={nextMonth}
                    className="px-3 py-1.5 rounded-lg hover:bg-[#f8fbf4] border border-[#e3ecdc] text-[15px]"
                    aria-label="다음 달"
                >
                    ›
                </button>
            </div>

            <ModalIos
                isOpen={openMonthPicker}
                handleModalState={() => setOpenMonthPicker(false)}
                title="월 선택하기"
                width="520px"
                height="310px"
            >
                <div className="p-3">
                    <div className="grid grid-cols-3 gap-2">
                        {months.map((m, i) => {
                            const active = i === activeMonth;
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setActiveMonth(i);
                                        setOpenMonthPicker(false);
                                    }}
                                    className={[
                                        'px-3 py-2 rounded-xl border text-sm transition shadow-sm flex justify-center',
                                        active
                                            ? 'bg-[#f3f7ee] text-[#5b7551] border-[#afcb94] font-semibold'
                                            : 'bg-white text-gray-800 border-[#e3ecdc] hover:bg-[#f8fbf4]',
                                    ].join(' ')}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </ModalIos>

            <ModalIos
                isOpen={openYearPicker}
                handleModalState={() => setOpenYearPicker(false)}
                title="연도 선택하기"
                width="520px"
                height="210px"
            >
                <div className="p-3">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => setYear(currentYear)}
                            className="px-2 py-1 rounded-lg border border-[#e3ecdc] bg-white hover:bg-[#f8fbf4] text-[12px]"
                        >
                            올해
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {years.map((y) => {
                            const active = y === year;
                            return (
                                <button
                                    key={y}
                                    onClick={() => {
                                        setYear(y);
                                        setOpenYearPicker(false);
                                    }}
                                    className={[
                                        'px-3 py-2 rounded-xl border text-sm transition shadow-sm',
                                        active
                                            ? 'bg-[#f3f7ee] text-[#5b7551] border-[#afcb94] font-semibold'
                                            : 'bg-white text-gray-800 border-[#e3ecdc] hover:bg-[#f8fbf4]',
                                    ].join(' ')}
                                >
                                    {y}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </ModalIos>
        </section>
    );
}

export const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
