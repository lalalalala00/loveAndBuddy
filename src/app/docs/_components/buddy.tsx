import { DividerS, Section } from './ui.function';

export function BuddyConcept() {
    return (
        <section className="">
            <header className="mb-5">
                <h3 className="text-xl font-semibold tracking-tight">기억을 남기고, 마음을 이어주는 동행자</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">버디 컨셉 요약과 시각 자료</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <figure className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50 dark:bg-neutral-800 shadow">
                    <img src="/project/buddy.png" alt="버디 컨셉 이미지 1" className="w-full h-auto" />
                    <figcaption className="px-3 py-2 text-xs text-right text-neutral-600 dark:text-neutral-300">
                        Buddy v1 — 2D 동화 삽화 느낌
                    </figcaption>
                </figure>
                <figure className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50 dark:bg-neutral-800 shadow">
                    <img src="/project/buddy3.png" alt="버디 컨셉 이미지 2" className="w-full h-auto" />
                    <figcaption className="px-3 py-2 text-xs text-right text-neutral-600 dark:text-neutral-300">
                        Buddy v2 — 3D 색채/텍스처 변주
                    </figcaption>
                </figure>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                    버디는 단순한 펫시터가 아니라{' '}
                    <strong>반려동물의 한 순간을 함께 호흡하며 기록해주는 케어 파트너</strong>입니다. 화려하거나 앞서서
                    말을 하는 캐릭터가 아니라,
                    <br /> <strong>말보다 행동으로 마음을 전하는 존재</strong>로 표현되었습니다.
                </p>

                <p>
                    눈을 덮을 만큼 부드러운 털, 둥글고 포근한 실루엣, 그리고 하늘빛과 풀빛이 어우러진 파스텔톤은 신뢰와
                    안정, 따뜻한 동행을 상징합니다.
                    <br /> 버디는 언제나 아이 곁에 머무르며, 그 작은 숨결과 리듬에 맞추어 함께 호흡합니다.
                </p>

                <p>
                    그는 마치 <strong>그늘을 내어주는 나무</strong>처럼, 늘 그 자리에 있는 숲처럼, 동물들이 편히 기대고
                    숨 쉴 수 있는 안식처가 됩니다. <br />그 곁에서 아이들은 긴장을 풀고, 보호자는 마음의 무게를
                    내려놓습니다.
                </p>
                <DividerS />
                <Section id="design" title="디자인 원칙">
                    <ul className="list-disc pl-5 mt-3 space-y-1">
                        <li>부드러운 실루엣과 파스텔 톤(하늘·풀빛)을 통해 편안함과 포근함을 전달</li>
                        <li>
                            과장된 표정보다 <strong>행동</strong>과 <strong>분위기</strong>로 교감을 전하는 캐릭터 연출
                        </li>
                        <li>아이(반려동물)의 리듬에 맞춰 함께 호흡하는 동행자 메타포</li>
                    </ul>
                </Section>
                <DividerS />
                <Section id="ux-concept" title="경험 콘셉트">
                    <ul className="list-disc pl-5 mt-3 space-y-1">
                        <li>
                            예민한 아이, 낯가림이 심한 아이, 활발한 아이… <strong>각기 다른 성격과 패턴을 존중</strong>
                        </li>
                        <li>
                            돌봄 이후 <strong>Dear Love</strong>에 남는 기록 → 시간이 쌓이며 감성 아카이브가 되는 경험
                        </li>
                        <li>
                            보호자에게는 <strong>늘 곁에 있는 숲</strong> 같은 심리적 안정감 제공
                        </li>
                    </ul>
                </Section>
                <DividerS />
                <p>
                    버디는 단순히 ‘맡기는 사람’이 아니라,
                    <strong>그 시간 자체를 존중하고 기억해주는 존재</strong>입니다. <br /> 우리는 이 교감의 순간들이 더
                    오래, 더 따뜻하게 남길 바라는 마음으로 버디의 형상을 만들었습니다.
                </p>
            </div>
        </section>
    );
}

export function BuddyStory() {
    return (
        <section
            className="relative neumorph-box px-10 py-8 rounded-2xl h-[1200px] overflow-hidden"
            style={{ backgroundImage: 'url(/project/buddy_sit_1.png)' }}
        >
            <div className="absolute inset-0 backdrop-blur-[3px] rounded-2xl overflow-hidden" />

            <div className="relative z-10 px-8 py-20 max-w-3xl mx-auto ">
                <h3 className="text-3xl font-semibold mb-18 text-center drop-shadow-md text-soft-green">
                    버디는 어떻게 태어났을까요?
                </h3>

                <div className="text-[17px] leading-relaxed space-y-6">
                    <p className="text-[#4f4f4f]">
                        버디는 사실 처음부터 이 모습이 아니었습니다. 그는 한때 사람이었고, 누구보다 반려동물을 아꼈던
                        사람이었습니다.
                    </p>
                    <p>
                        그러나 건강 문제로 인해 먼저 아이 곁을 떠나야 했고, 가장 소중했던 존재에게 마지막까지 함께해주지
                        못했다는 미안함과 그리움을 안고 삶을 마감했습니다. 그리고 그는 간절히 소망했습니다.
                    </p>
                    <p className="italic text-[#c29200] font-semibold text-center text-lg drop-shadow-lg">
                        "다시 태어난다면… 나는 숲 속의 나무 같은 존재가 되고 싶어. 많은 동물들이 내 곁에서 쉬어가고,
                        따뜻한 숨을 고를 수 있도록. 말은 통하지 않아도, 그 마음을 더 깊이 느끼고 보듬을 수 있도록..."
                    </p>
                    <p>
                        그렇게 그는 다시 태어났습니다. 사람도, 동물도 아닌 존재로. 초록빛의 큰 몸, 눈을 덮을 만큼 포근한
                        털, 작은 검은 코와 따뜻한 눈동자를 가진 <strong>‘버디’</strong>로.
                    </p>
                    <p>
                        버디는 아이가 불안할 땐 놀라지 않게 다가와 옆에 앉고,함께 뛰어놀 땐 누구보다 밝게 웃으며, <br />
                        이별할 땐 멀찍이서 조용히 그 뒷모습을 지켜봅니다.
                    </p>
                    <p>
                        이제 그는
                        <strong>숨</strong>이라는 공간에서
                        <strong>사람과 반려동물을 이어주는 동행자로 당신의 곁에 머무르고자 합니다.</strong>
                        <br />
                        <strong>기억을 남기고, 마음을 이어주는 동행자.</strong>
                        {/* <strong>누구보다 깊은 공감으로 존재하는 든든한 동행자.</strong> */}
                        <br /> 버디는 이곳에서 아이들과 보호자의 곁을 지키며, 따뜻한 교감을 전합니다.
                    </p>
                </div>
            </div>
        </section>
    );
}
