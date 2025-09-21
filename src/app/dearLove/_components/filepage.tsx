'use client';

import { Fragment, useState } from 'react';
import FileNameBox from './file.name.box';

import PhotoModal from './modal.photo';

import ModalIos from '@/common/modal.ios';
import DiaryMessage from './diary.message';
import NameTag from '@/common/name.tag';
import Calendar from './calendar';
import File from './file';

const FilePage = () => {
    const [selectedMonth, setSelectedMonth] = useState<string>('August');
    const [randomNameBox, setRandomNameBox] = useState<number>(0);
    const [selectedDay, setSelectedDay] = useState<number>(31);
    const [selectedYear, setSelectedYear] = useState<number>(2025);
    const [open, setOpen] = useState<boolean>(false);

    const [selectedPhoto, setSelectedPhoto] = useState<boolean>(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    const years = [2025, 2024, 2023, 2022];

    const randomIndex = Math.floor(Math.random() * randomNameBox);
    // const randomIndex = Math.floor(Math.random() * (imgs.length + 1));

    const handlePhotoClick = (i: number) => {
        setSelectedPhoto(!selectedPhoto);
        setSelectedPhotoIndex(i);
    };

    return (
        <div className="flex w-full flex-col">
            <div className="text-center px-6 py-4 border-b border-gray-200 text-[15px] mb-16 font-semibold text-gray-700">
                -`♥´- dear.Love_〘 chanelu 〙 -`♥´-
            </div>

            <div className="flex px-5">
                <div className="min-w-[220px] rounded-2xl shadow-md bg-[#f3f7ee] h-[550px] px-4 py-5 flex flex-col items-center">
                    <div className="relative w-full mb-6">
                        <button
                            onClick={() => setOpen(!open)}
                            className="font-bold text-[16px] h-[40px] cursor-pointer w-full flex justify-center items-center custom-card-hover-bg-white"
                            // className="font-bold h-[40px] w-full rounded-xl bg-white hover:bg-[#e3ecdc] text-[14px] flex justify-center items-center shadow-sm"
                        >
                            {selectedYear}
                        </button>
                        {open && (
                            <div className="absolute top-[44px] p-2 left-0 w-full custom-card-bg-white rounded-2xl  z-10 overflow-hidden">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => {
                                            setSelectedYear(year);
                                            setOpen(false);
                                        }}
                                        className={`w-full text-center py-2 mb-1 rounded-xl custom-card-hover ${year === selectedYear ? 'font-bold custom-card rounded-2xl' : ''}`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar w-full">
                        {months.map((month, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedMonth(month)}
                                className={`text-sm lowercase tracking-tight rounded-md px-2 py-1 w-full text-left hover:bg-[#e3ecdc] hover:border hover:border-white/20  hover:shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff] ${selectedMonth === month ? 'bg-white font-semibold text-[#5b7551]' : ''}`}
                            >
                                {month}_[3].zip
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col pl-8 ">
                    <div className="flex w-full justify-between mb-2 itmes-center">
                        <button
                            className="px-3 py-1 rounded-lg hover:bg-[#f8fbf4] border border-[#e3ecdc]"
                            aria-label="이전 달"
                        >
                            ‹
                        </button>
                        <div className="mt-2 mb-4">
                            <h4 className="text-[28px] font-bold lowercase text-[#5b7551]">
                                ˚₊· {selectedMonth} —̳͟͞͞♡ ˚₊·
                            </h4>
                        </div>
                        <button
                            className="px-3 py-1 rounded-lg hover:bg-[#f8fbf4] border border-[#e3ecdc]"
                            aria-label="다음 달"
                        >
                            ›
                        </button>
                    </div>

                    <div className="flex flex-col w-full ">
                        <div className="flex gap-4 mb-4">
                            {[1, 4, 9, 12, 24, 29, 31].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setSelectedDay(item)}
                                    className={`relative text-[16px] px-2 py-1 rounded-full h-[60px]  w-[60px] btn-card ${
                                        item === selectedDay ? 'font-bold  bg-[#e3ecdc] ]' : ' bg-[#e7e7e7]'
                                    } transition-all shadow-sm`}
                                >
                                    <img
                                        src="/cha/1_3.png"
                                        className={`${item === selectedDay ? '' : ''} rounded-full w-[50px] h-[50px]  absolute top-1/2 left-1/2 object-cover -translate-x-1/2 -translate-y-1/2`}
                                    />
                                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[12px] text-gray-700 flex text-nowrap">
                                        {item}일
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-4 gap-1 py-6 mb-8">
                            {imgs.slice(0, 3).map((item, i) => {
                                const actualIndex = i;
                                return (
                                    <Fragment key={i}>
                                        {i === randomIndex && <FileNameBox bgImg="/cha/bg.png" textColor="" />}
                                        <img
                                            src={item.url}
                                            className="w-full h-[260px] object-cover cursor-pointer shadow-xl"
                                            onClick={() => handlePhotoClick(actualIndex)}
                                        />
                                    </Fragment>
                                );
                            })}

                            <div className="col-span-4 flex w-full flex-col items-center px-4 my-4 rounded-xl min-h-[200px] bg-[#f3f6f0]">
                                <span className="text-[12px] text-[#8f8f8f] text-shadow-2xs">
                                    8월 1일 (금) 오전 9:35
                                </span>
                                <div className="flex items-start w-full">
                                    <div className="w-[14%] mt-2 flex flex-col items-center mr-3 bg-[rgb(246,246,246)] rounded-2xl shadow">
                                        {/* <BuddyProfileCard /> */}
                                        <NameTag
                                            imgCss="w-[90px] h-[90px] border border-[#e6e6e6] shadow-sm"
                                            small
                                            find
                                        />
                                    </div>

                                    <div className="w-[88%]">
                                        <DiaryMessage
                                            text={
                                                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium. Excepturi consequuntur omnis doloremque quis nam sint enim. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium. Excepturi consequuntur omnis doloremque quis nam sint enim.` ??
                                                ''
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {imgs.slice(3).map((item, i) => {
                                const actualIndex = i + 8;
                                return (
                                    <img
                                        key={actualIndex}
                                        src={item.url}
                                        className="w-full h-[260px] object-cover cursor-pointer shadow-xl"
                                        onClick={() => handlePhotoClick(actualIndex)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <ModalIos
                isOpen={selectedPhoto}
                handleModalState={() => setSelectedPhoto(!selectedPhoto)}
                width="50%"
                height="800px"
                title={'title'}
                leftComment="*⁀➷♥ Heart ⌁❤︎⌁﻿"
                leftAction={() => console.log('heart')}
            >
                <PhotoModal
                    handleModalState={() => setSelectedPhoto(!selectedPhoto)}
                    images={imgs}
                    selectedIndex={selectedPhotoIndex}
                />
            </ModalIos>
        </div>
    );
};

export const imgs = [
    { url: '/cha/1_1.png', comment: '' },
    {
        url: '/cha/1_3.png',
        comment:
            'commentcommentcommentv comment comment commentcommentcommentv comment comment commentcommentcommentv comment comment',
    },
    {
        url: '/cha/1_4.png',
        comment: 'commentcomment comment commentcommentcommentv comment comment commentcommentcommentv comment comment',
    },
    { url: '/cha/1_5.png', comment: 'comment' },
    { url: '/cha/1_6.png', comment: '' },
    { url: '/cha/1_7.png', comment: '' },
    {
        url: '/cha/1_8.png',
        comment:
            'comment comment comment commentcommentcommentcomment commentcommentcommentv comment comment commentcommentcommentv comment comment commentcommentcommentv comment comment',
    },
    { url: '/cha/1_9.png', comment: '' },
    { url: '/cha/1_10.png', comment: 'commentcommentcomment' },
    { url: '/cha/1_11.png', comment: '' },
    { url: '/cha/1_12.png', comment: '' },
    { url: '/cha/1_13.png', comment: '' },
];

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

export const cover = [
    { url: '/cha/bg.png' },
    { url: '/concept_site/7.png' },
    { url: '/concept_site/10.png' },
    { url: '/cover/1.png' },
    { url: '/cover/2.png' },
    { url: '/cover/3.png' },
    { url: '/cover/4.png' },
    { url: '/cover/5.png' },
    { url: '/cover/6.png' },
];

export default FilePage;
