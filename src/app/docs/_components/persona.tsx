'use client';

import { JSX, useState } from 'react';

type Scenario = {
    role: string;
    story: JSX.Element;
    summary: { situation: string; action: string; result: string };
    comment: string;
    img: string;
};

const scenarios: Scenario[] = [
    {
        role: 'Love',
        story: (
            <>
                <p>
                    김민주(32, 직장인)님은 반려견 몽이와 단둘이 살고 있습니다.
                    <br /> 하지만 야근이 잦아 저녁 산책을 챙기기 어려웠습니다.
                    <strong>find.MyDearDay</strong>에서 날짜와 시간을 선택하고, 매너 점수와 디얼러브 기록 수로 필터링해
                    신뢰도 높은 버디를 예약했습니다.
                </p>
                <p>
                    버디는 산책을 마친 후 <strong>dear.Love</strong>에 사진과 짧은 메모를 남겼고, 민주님은 이를 회사에서
                    확인하며 안심했습니다. <br /> <br />이 경험은 단순한 돌봄을 넘어 “돌봄이 추억으로 남는다”는 가치를
                    체감하게 했습니다.
                </p>
            </>
        ),
        summary: {
            situation: '야근이 잦아 반려견 산책이 어려움',
            action: 'find.MyDearDay로 신뢰도 높은 버디 예약',
            result: 'Dear Love 기록 확인 → 안심, 돌봄이 추억으로 남음',
        },
        comment: '야근이 많은 1인 가구 직장인',
        img: '/persona/love2.png',
    },
    {
        role: 'Buddy',
        story: (
            <>
                <p>
                    이현우(28, 대학원생)님은 반려동물을 좋아하지만, 자취방 사정으로 직접 키울 수는 없었습니다. <br />{' '}
                    대신 버디 활동을 통해 동물과 교감하며 삶의 빈자리를 채웠습니다.
                </p>
                <p>
                    그는 <strong>buddyToki</strong>에서 예약 요청을 확인하고 돌봄을 수락했습니다. <br />
                    이후 <strong>dear.Love</strong>에 사진과 에피소드를 기록해 보호자에게 전달했습니다.
                </p>
                <br />
                <p>
                    버디 활동은 단순한 아르바이트가 아니라, “우리를 위한 교감의 순간”이 되었고 기록이 쌓이며 수익과 매너
                    점수, 신뢰도가 올라갔습니다.
                </p>
            </>
        ),
        summary: {
            situation: '반려동물을 좋아하지만 직접 키울 수 없음',
            action: 'find.MyDearDay 예약 수락, Dear Love에 기록 남김',
            result: '교감으로 자기 충족, 신뢰도·매너 점수 상승',
        },
        comment: '동물을 좋아하지만 직접 키울 수 없는 대학원생',
        img: '/persona/buddy.png',
    },
    {
        role: 'Lovuddy',
        story: (
            <>
                <p>
                    박소영(29, 회사원)님은 고양이를 키우는 보호자이자 동시에 펫시터 자격증을 가진 버디입니다. <br />{' '}
                    평일에는 <strong>find.myDearDay</strong>로 검증된 버디를 예약해 고양이 케어를 맡깁니다.
                </p>
                <p>
                    주말에는 가족이 고양이를 봐주기에, 소영은 가끔 <strong>강아지</strong> 산책·돌봄 요청에 버디로
                    참여해 교감과 수익을 함께 얻습니다. 활동 후에는 <strong>dear.Love</strong>에 사진과 메모를 남겨
                    보호자에게 전달합니다.
                </p>
                <p>
                    이렇게 소영은 보호자와 버디 역할을 상황에 맞게 오가며 <strong>양방향 매칭</strong>을 이어갑니다.
                    <br />
                    <br />
                    자신의 돌봄 철학과 기록이 신뢰로 축적되고, 그 신뢰가 다시 자신이 버디를 선택할 때의 확신으로
                    이어집니다.
                </p>
            </>
        ),
        summary: {
            situation: '고양이 보호자이자 버디로도 활동',
            action: 'find.MyDearDay를 통해 평일엔 버디 예약, 주말엔 강아지 돌봄 참여',
            result: '교차 신뢰 형성, 서비스 신뢰도 강화',
        },
        comment: '평일은 고양이 케어를 맡기고, 주말에는 강아지 펫시팅으로 교감과 수익을 얻는 직장인',
        img: '/persona/lov.png',
    },
];

export default function ScenarioCarousel() {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((i) => (i + 1) % scenarios.length);
    const prev = () => setIndex((i) => (i - 1 + scenarios.length) % scenarios.length);

    return (
        <section className="my-10 relative">
            <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 px-3 py-2 border border-gray-200 rounded-full bg-white/90 dark:bg-neutral-800 shadow-2xl hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
                ←
            </button>
            <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 px-3 py-2 border border-gray-200 rounded-full bg-white/90 dark:bg-neutral-800 shadow-2xl hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
                →
            </button>

            <div className="overflow-x-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${index * 94}%)` }}
                >
                    {scenarios.map((scenario, i) => (
                        <div
                            key={i}
                            className="flex flex-col min-w-[94%] max-w-[94%] mr-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 shadow-sm "
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full h-full mb-5">
                                <div className="md:col-span-1 flex justify-center">
                                    <img
                                        src={scenario.img}
                                        alt={`${scenario.role} Persona Illustration`}
                                        className="w-32 h-32 md:w-full md:h-auto rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white shadow-sm object-cover"
                                    />
                                </div>

                                <div className="md:col-span-3 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-lg font-semibold">{scenario.role} Persona</h4>
                                        <p className="text-sm text-neutral-500 mb-3">{scenario.comment}</p>
                                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                                            {scenario.story}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <table className="w-full text-sm border-t border-neutral-200 dark:border-neutral-700">
                                <thead>
                                    <tr className="text-left text-neutral-500 dark:text-neutral-400">
                                        <th className="py-2 pr-2">상황</th>
                                        <th className="py-2 pr-2">행동</th>
                                        <th className="py-2">결과</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="align-top py-2 pr-2">{scenario.summary.situation}</td>
                                        <td className="align-top py-2 pr-2">{scenario.summary.action}</td>
                                        <td className="align-top py-2">{scenario.summary.result}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
