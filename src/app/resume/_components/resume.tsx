'use client';

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

/*************************************
 * Section (shared)
 *************************************/
// export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
//     return (
//         <section id={id} className="scroll-mt-24 max-w-4xl mx-auto px-4 py-10">
//             <h2 className="text-xl font-semibold text-[#5b7551] mb-3">{title}</h2>
//             {children}
//         </section>
//     );
// }

export function Section({
    id,
    title,
    children,
    maxW = '4xl', // 기본은 좁게
    bleed = false, // 이미지 풀-블리드(양옆 가득)
}: {
    id: string;
    title: string;
    children: React.ReactNode;
    maxW?: '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
    bleed?: boolean;
}) {
    return (
        <section id={id} className={`mx-auto ${maxW === 'full' ? '' : `max-w-${maxW}`} scroll-mt-24  px-4 py-10`}>
            <div className="flex justify-center">
                <div className="w-[864px] flex justify-start">
                    <h2 className="text-xl font-semibold text-[#5b7551] mb-3">{title}</h2>
                </div>
            </div>

            {children}

            {/* 풀-블리드 컨테이너 (선택): 이미지/뷰어 전용 */}
            {bleed && (
                <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-4">
                    {/* children 대신, 섹션 내부에서 별도의 full-bleed 블록을 넣을 때 사용 */}
                </div>
            )}
        </section>
    );
}

/*************************************
 * StickyToc (scrollspy)
 *************************************/
const TOC_ITEMS = [
    { id: 'intro', label: '자기소개' },
    { id: 'works', label: '대표 작업' },
    { id: 'uxui', label: 'UX/UI 리디자인' },
    { id: 'three', label: 'Three.js 뷰어' },
    { id: 'skills', label: '기술 스택' },
    { id: 'timeline', label: '경력' },
    { id: 'contact', label: '연락' },
];

export function StickyToc() {
    const [active, setActive] = useState('intro');
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
            },
            { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 },
        );
        TOC_ITEMS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, []);

    return (
        <nav className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-gray-100 mx-26 pb-3">
            <div className="max-w-4xl mx-auto px-4 py-2 flex gap-3 overflow-x-auto">
                {TOC_ITEMS.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() =>
                            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                        className={`px-3 py-1.5 rounded-full text-sm ${
                            active === id ? 'bg-[#f3f7ee] text-[#5b7551] font-semibold' : 'text-gray-600'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </nav>
    );
}

export function BeforeAfter({
    before,
    after,
    caption,
    comment,
}: {
    before: string;
    after: string;
    caption?: string;
    comment?: ReactNode;
}) {
    return (
        <div>
            {caption && <div className="text-sm text-gray-600 mb-2">{caption}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <figure className="rounded-xl overflow-hidden border bg-white">
                    <img src={before} alt="before" className="w-full h-full object-cover" />
                    <figcaption className="px-2 py-1 text-xs bg-white/80">Before</figcaption>
                </figure>
                {/* <span>	&#8594; &#10141;</span> */}
                <figure className="rounded-xl overflow-hidden border bg-white">
                    <img src={after} alt="after" className="w-full h-full object-cover" />
                    <figcaption className="px-2 py-1 text-xs bg-white/80">After</figcaption>
                </figure>
            </div>
            {comment && <div className="mt-4 px-2 text-[15px] list-disc">&#8226; {comment}</div>}
        </div>
    );
}

function useInView() {
    const ref = useRef<HTMLDivElement | null>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const io = new IntersectionObserver(([e]) => setInView(!!e.isIntersecting), { threshold: 0.1 });
        io.observe(ref.current);
        return () => io.disconnect();
    }, []);
    return { ref, inView } as const;
}

export function ThreeViewer({ children }: { children?: React.ReactNode }) {
    const { ref, inView } = useInView();
    return (
        <div ref={ref} className="w-full h-[360px] rounded-xl overflow-hidden border bg-white">
            {inView && <div>three</div>}
        </div>
    );
}

export default function Resume() {
    return (
        <div className="min-h-screen bg-white text-[15px] text-gray-800">
            {/* Hero */}
            <header className="max-w-4xl mx-auto px-4 py-8 flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold">탁은지 · Frontend / UX/UI</h1>
                    <p className="text-gray-600 mt-1">Next.js · TypeScript · Tailwind · Supabase · Three.js</p>
                </div>

                <a href="https://github.com/" className="px-5 py-1.5 rounded-full border border-gray-300">
                    GitHub
                </a>
            </header>

            <StickyToc />

            {/* 자기소개 (사용자 제공 본문 삽입) */}
            <Section id="intro" title="자기소개">
                <div className="leading-relaxed space-y-4">
                    <p>
                        저는 디자인 소품을 제작·판매하는 쇼핑몰을 운영하면서 자연스럽게 웹사이트와 커뮤니티에 대한
                        관심을 가지게 되었습니다. 단순히 시각적인 디자인에 머무르지 않고 더 넓은 영역에서 사용자 경험을
                        설계하고 싶다는 생각으로 프론트엔드 개발에 도전하게 되었습니다. 첫 직장에서는 VAN사 가맹점 관리
                        플랫폼: 가맹점 계약서, 업무 요청, 캘린더 등을 한 곳에서 처리하는 서비스를 PHP에서 React로
                        리팩토링하며, 프론트엔드 개발·UX/UI 개선·업무 흐름 재설계·기획을 함께 수행했습니다.
                    </p>
                    <p>
                        이후 개인 프로젝트를 통해 제가 구상한 서비스를 직접 설계하고 구현하는 과정을 거치며 기획과
                        개발을 동시에 진행하는 역량을 쌓았습니다. 그러나 실제 협업 과정에서는 의견 충돌과 프로젝트
                        난항을 겪으며 좌절하기도 했습니다. 이 경험을 통해 개발은 단순한 기술 구현을 넘어 협업과 신뢰를
                        기반으로 완성된다는 점을 절실히 깨달았습니다. 그 후 저는 기획 의도를 명확히 문서화하고, 다양한
                        이해관계자의 의견을 조율하는 방법을 배우며 한층 성숙한 태도로 프로젝트에 임할 수 있게
                        되었습니다.
                    </p>
                    <p>
                        최근 2년간은 블록체인 기업에서 근무하며 탈중앙화 거래소(DEX) 사이트 개발, UX/UI 개선, Three.js를
                        활용한 3D NFT 제작, Solidity 기반 DAO 구축 등 다양한 프로젝트를 경험했습니다. 특히 블록체인
                        특유의 복잡한 로직을 이해하고 백엔드 개발자, 디자이너, 기획자와의 협업 속에서 효율적인 사용자
                        경험을 고민하며 서비스를 만들어 왔습니다.
                    </p>
                    <p>
                        저는 디자인적 감각을 바탕으로 한 UX/UI 기획 역량, 서비스 구조를 정리하는 기획 능력, 그리고
                        프론트엔드 개발 역량을 고루 갖춘 사람이라고 생각합니다. TypeScript 기반의 테이블·타입 설계와
                        Supabase 연동 등 실무 전반을 다루며, 앞으로는 기획과 개발을 긴밀히 잇는 풀스택 지향 프론트엔드로
                        성장하고자 합니다.
                    </p>

                    <p className="mt-4">
                        일할 때 저는 사용자 관점과 팀 협업을 우선시합니다. 문제가 보이면 “왜 불편한가”를 정의하고 흐름을
                        설계한 뒤, 문서와 와이어프레임으로 의도를 명확히 공유합니다. 또한 낙천적이고 긍정적인 성격
                        덕분에 새로운 환경에서도 빠르게 적응하며, 동료들과 신뢰 중심의 커뮤니케이션으로 합을 맞춰
                        왔습니다.
                    </p>

                    <p>
                        UI는 접근성·가독성·상태 흐름을 기준으로 설계하며, 결과적으로 ‘예쁜 UI’가 아니라 정보가 잘
                        전달되는 이유 있는 UI를 목표로 합니다. 개발에서는 복잡하게 꼬아놓은 코드보다, 협업자가 바로
                        이해할 수 있는 명확하고 정돈된 ‘읽히는 코드’를 지향합니다. 서비스는 혼자가 아닌 팀이 함께 만드는
                        것이라 믿기에, 저는 협업 중심의 태도로 팀 전체의 효율과 결과물을 높이고자 합니다.
                    </p>

                    <p className="mt-4">
                        입사 후에는 기획·디자인·개발을 아우른 경험을 바탕으로 핵심 플로우를 단순화하고 전환율과 사용성을
                        개선하는 데 기여하겠습니다. 배움에 열린 태도로 팀의 방식을 빠르게 흡수하고, 사용자에게 가치 있는
                        경험을 만들며 함께 성장하는 팀의 일원으로 보탬이 되겠습니다.
                    </p>

                    <p className="mt-4">
                        앞으로도 저는 배움과 도전을 두려워하지 않고, 기획과 개발을 아우르는 하이브리드 역량을 더욱
                        발전시켜 나가겠습니다. 귀사에서의 경험을 통해 사용자에게 가치 있는 경험을 만들고, 함께 성장하는
                        팀의 일원으로 기여하고 싶습니다. 감사합니다.
                    </p>
                </div>
            </Section>

            {/* 대표 작업 */}
            <Section id="works" title="대표 작업">
                <ul className="list-disc pl-5 space-y-1">
                    <li>Love & Buddy — Supabase Auth/DB/Storage/Realtime · Dear Love · 실시간 채팅</li>
                    <li>전 직장 UX/UI 리디자인 — IA 재정의, 내비 개선, 가독성 향상</li>
                    <li>Three.js — NFT/3D 인터랙티브 뷰어</li>
                </ul>
            </Section>

            <Section id="uxui" title="UX/UI 리디자인" maxW="6xl">
                <div className="flex justify-center">
                    <div className="w-[864px] flex justify-start flex-col">
                        <span>해외 nft 프로젝트 외주로 프론트엔드와 ux/ui 수정</span>
                        <p className="mb-3">문제정의 → 접근/의사결정 → 결과. 핵심 포인트 3개:</p>
                        <ol className="list-decimal pl-5 space-y-1 mb-4">
                            <li>정보구조 재배치로 탐색 단계 3→2단계 단축</li>
                            <li>타이포 스케일/여백 정리로 가독성 개선</li>
                            <li>행동 버튼 일관화로 전환 유도</li>
                        </ol>
                    </div>
                </div>

                <BeforeAfter
                    before="/resume/IMG_3846.JPG"
                    after="/resume/main.png"
                    caption="주요 화면 전/후 비교"
                    comment={
                        <>
                            <span>기존 카드 디자인에서 가독성 추가, ui디자인 추가 </span>
                        </>
                    }
                />
                <BeforeAfter
                    before="/resume/IMG_3851.PNG"
                    after="/resume/selected_1.png"
                    caption="nft 선택"
                    comment={
                        <>
                            <span>
                                기존 카드 디자인에서 가독성 추가, ui디자인 추가, 클래스별 이해하기 힘들다. 각자 앞에
                                상징색을 넣어 가독성 올림{' '}
                            </span>
                        </>
                    }
                />
                <BeforeAfter
                    before="/resume/IMG_3852.PNG"
                    after="/resume/selected_nft.png"
                    caption="nft 선택"
                    comment={
                        <>
                            <span>
                                기존 같은 클래스가 아닌 경우 토스트 - 사용자 이해못함 스탭으로 직관적으로 보여줌.{' '}
                            </span>
                            <span>같으 ㄴ클래스만 강화가 된다는 안내가 따로 없으므로 ~ 두단계로 보옂줌</span>
                        </>
                    }
                />
                <BeforeAfter before="/resume/IMG_3849.JPG" after="/resume/select_com.png" caption="nft 선택 완료" />
                <BeforeAfter
                    before="/resume/IMG_3847.JPG"
                    after="/resume/empty_box.png"
                    comment={
                        <>
                            <span>기존 뒷배경과 연한 카드 색으로 가독성 떨어짐</span>
                        </>
                    }
                />
                <BeforeAfter
                    before="/resume/IMG_3851.PNG"
                    after="/resume/select_2.png"
                    caption="nft 선택된 배열"
                    comment={
                        <>
                            <span>
                                기존 선택 가능한 nft와 선택 불가능한 nft가 연하게 블러처리된 상황으로 가독성이 떨어져
                                선택할 수 없는 nft는 배열에서 제외, 선택된 nft는 0번쨰 배열로 변경
                            </span>
                        </>
                    }
                />
                <BeforeAfter
                    before="/resume/IMG_3855.JPG"
                    after="/resume/modal.png"
                    caption="클래스 랭크 모달"
                    comment={
                        <>
                            <span>
                                과한 컬러감과 모든 포인트로 인해 가독성 떨어짐. nft 리스트와 마찬가지로 상징 색 컬러를
                                넣어 통일감, 가독성 올림, 마우스 호버시 보더 새엉
                            </span>
                        </>
                    }
                />
            </Section>

            <Section id="three" title="Three.js" maxW="6xl">
                <div className="flex justify-center">
                    <div className="w-[864px] flex justify-start">
                        <div>
                            <h2 className="text-lg md:text-xl font-semibold leading-snug">
                                3D 캐릭터 뷰어 개발: UX/UI 개선, 인터랙션·오디오·파티클 이펙트, 캡처·강화·NFT 생성
                                연동(메타마스크 인증)까지 엔드투엔드 구현
                            </h2>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[12px] text-emerald-700">
                                    Three.js
                                </span>
                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[12px] text-emerald-700">
                                    WebGL
                                </span>
                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[12px] text-emerald-700">
                                    MetaMask
                                </span>
                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[12px] text-emerald-700">
                                    NFT Pipeline
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8">
                    <div className="rounded-2xl border border-emerald-100 bg-white/80 shadow-sm p-3">
                        <div className="rounded-xl overflow-hidden ring-1 ring-emerald-100">
                            <iframe
                                src="https://dev-dao-api.unchainx.io/x-guardians/viewer/365"
                                className="w-full h-[min(72vh,720px)]"
                                title="X-Guardians Viewer"
                            />
                        </div>
                        <p className="mt-2 text-[12px] text-gray-500">
                            * 포트폴리오 페이지에서는 권한 정책상 캡처가 비활성화되어 있습니다.
                        </p>
                    </div>

                    <ol className="list-disc space-y-2 text-[14px] leading-relaxed text-gray-800">
                        <li>
                            <strong className="font-semibold text-gray-900">UX/UI & 컨셉</strong>: 컬러
                            시스템·레이아웃·상태 전환을 정비해 사용 흐름을 단순화하고 브랜드 톤을 일관되게 적용.
                        </li>
                        <li>
                            <strong className="font-semibold text-gray-900">액션 시스템</strong>: 총 선택 후
                            슈팅/레이저건/도넛건/부스터/비행 등 액션 추가, 액션 간 전환 플로우 설계.
                        </li>
                        <li>
                            <strong className="font-semibold text-gray-900">모션 디테일</strong>: 숨쉬기(Idle), 자동
                            회전, 마우스 드래그 회전 → 스프링 복귀 등 자연스러운 상호작용 구현.
                        </li>
                        <li>
                            <strong className="font-semibold text-gray-900">오디오 연동</strong>: BGM·사운드 이펙트(총성
                            등) 추가 및 재생/음소거/볼륨 제어.
                        </li>
                        <li>
                            <strong className="font-semibold text-gray-900">파티클 이펙트</strong>: 크기·개수 랜덤 분포
                            기반 파티클 생성으로 장면 몰입감 강화(퍼포먼스 고려한 스폰/소거 처리).
                        </li>
                        <li>
                            <strong className="font-semibold text-gray-900">캡처·강화·NFT 파이프라인</strong>: 캡처 후
                            백엔드 전송 및 강화→NFT 생성까지 연동. 메타마스크 지갑 인증으로 본인 계정에 한해 캡처/NFT
                            생성 가능 (해당 사이트는 정책상 캡처 비활성).
                        </li>
                        <li>
                            <strong className="font-semibold text-gray-900">안정성/사용성</strong>: 로딩·에러 상태
                            처리와 세부 인터랙션 튜닝으로 조작감과 체감 성능 개선.
                        </li>
                    </ol>
                </div>

                <div className="flex justify-center">
                    {' '}
                    <iframe
                        src="https://dev-dao-api.unchainx.io/x-guardians/viewer/365"
                        className="w-[560px] h-[700px] rounded-xl"
                    />
                    <ol className="list-disc pl-5 space-y-1 mb-4 text-[14px] w-1/3">
                        <li>
                            <strong>UX/UI & 컨셉</strong>: 컬러 시스템·레이아웃·상태 전환을 정비해 사용 흐름을
                            단순화하고 브랜드 톤을 일관되게 적용.
                        </li>
                        <li>
                            <strong>액션 시스템</strong>: 총 선택 후 슈팅/레이저건/도넛건/부스터/비행 등 액션 추가, 액션
                            간 전환 플로우 설계.
                        </li>
                        <li>
                            <strong>모션 디테일</strong>: 숨쉬기(Idle), 자동 회전, 마우스 드래그 회전 → 스프링 복귀 등
                            자연스러운 상호작용 구현.
                        </li>
                        <li>
                            <strong>오디오 연동</strong>: BGM·사운드 이펙트(총성 등) 추가 및 재생/음소거/볼륨 제어.
                        </li>
                        <li>
                            <strong>파티클 이펙트</strong>: 크기·개수 랜덤 분포 기반 파티클 생성으로 장면 몰입감
                            강화(퍼포먼스 고려한 스폰/소거 처리).
                        </li>
                        <li>
                            <strong>캡처·강화·NFT 파이프라인</strong>: 캡처 후 백엔드 전송 및 강화→NFT 생성까지 연동.
                            메타마스크 지갑 인증으로 본인 계정에 한해 캡처/NFT 생성 가능(해당 사이트는 정책상 캡처
                            비활성).
                        </li>
                        <li>
                            <strong>안정성/사용성</strong>: 로딩·에러 상태 처리와 세부 인터랙션 튜닝으로 조작감과 체감
                            성능 개선.
                        </li>
                    </ol>
                </div>
            </Section>

            {/* 기술 스택 */}
            <Section id="skills" title="기술 스택">
                <div className="space-y-2">
                    <p>
                        <b>Frontend</b>: Next.js, React, Next.js TypeScript, Tailwind
                    </p>
                    <p>
                        <b>Data/BE</b>: Supabase(Auth/DB/Storage/Realtime)
                    </p>
                    <p>
                        <b>3D</b>: Three.js
                    </p>
                    <p>
                        <b>Ops</b>: Vercel, GitHub
                    </p>
                </div>
            </Section>

            {/* 경력 */}
            <Section id="timeline" title="경력">
                <ul className="space-y-3">
                    <li>
                        <b>블록체인 솔루션</b> — 프론트엔드 (2023.09 ~ ) · DEX, 3D NFT, DAO
                    </li>
                    <li>
                        <b>비즈메이트</b> — 프론트엔드 (2021.10 ~ 2022.06) · PHP→React 리팩터링, UX/UI
                    </li>
                </ul>
            </Section>

            {/* 연락 */}
            <Section id="contact" title="연락">
                <p>이메일: commevvz@naver.com · 대전</p>
            </Section>
        </div>
    );
}
