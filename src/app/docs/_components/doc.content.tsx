import { BuddyConcept, BuddyStory } from './buddy';
import ScenarioCarousel from './persona';
import { Card, conceptImgs, Divider, DividerS, FlowList, PlaceholderImage, Section } from './ui.function';

export default function DocContent() {
    return (
        <div className="space-y-6">
            {/* Introduction */}
            <Card>
                <Section id="introduction__overview" title="프로젝트 개요">
                    <p>
                        <b>Love & Buddy</b>는 보호자(Love)와 검증된 펫시터(Buddy)를 연결하는 서비스입니다. 본 문서에서는
                        기획 배경과 컨셉, 문제 정의, 해결 전략을 요약하고 이후 UX 플로우, 기술 설계, 시연을 차례로
                        제공합니다.
                    </p>
                </Section>
                <Divider />
                <Section id="introduction__problem" title="기획 배경 & 문제 정의">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>돌봄 서비스의 신뢰 문제(자격·이력 검증의 어려움)</li>
                        <li>매칭 과정의 비효율(조건·지역·시간대 필터의 부재)</li>
                        <li>돌봄 이후 기록 및 피드백(일기/리뷰)의 축적 부족</li>
                        <li>매칭의 단방향성(대부분 보호자가 요청만 하고, 펫시터는 수동적으로 수락)</li>

                        <li>펫시터 기록의 불투명성(자신이 맡긴 경험 외 다른 이용자 기록 확인 불가)</li>
                        {/* <li>펫시터의 새로운 정의(단순 알바가 아닌, 동물과 교감하며 보람과 수익을 함께 얻는 동행자)</li> */}
                        <li>펫시터의 새로운 정의(단순 알바 개념에 머물러 교감·보람·수익의 통합 철학 부재)</li>
                    </ul>
                </Section>
                <Divider />
                <Section id="introduction__solution" title="솔루션 한눈에 보기">
                    <ol className="list-decimal pl-5 space-y-1">
                        <li>
                            자격·이력 기반 <b>Buddy 신뢰도</b> 체계
                            <span className="text-neutral-500 dark:text-neutral-400">
                                {' '}
                                (검증된 자격증·활동 이력으로 돌봄 서비스의 불안 요소 해소)
                            </span>
                        </li>
                        {/* <li>
                            지역/시간/조건/성별 필터링이 가능한 <b>매칭</b> UX
                            <span className="text-neutral-500 dark:text-neutral-400">
                                {' '}
                                (사용자 상황에 맞는 최적의 버디,러브를 손쉽게 탐색)
                            </span>
                        </li> */}
                        <li>
                            지역/시간/조건/성별 필터링이 가능한 <b>매칭</b> UX
                            <span className="text-neutral-500 dark:text-neutral-400">
                                (보호자는 원하는 날과 조건에 맞춰 버디를 찾고, 버디는 자신이 가능한 일정과 활동을 등록해
                                러브를 만날 수 있는 사용자 상황에 맞는 최적의 양방향 구조)
                            </span>
                        </li>

                        <li>
                            돌봄 기록을 남기는 <b>Dear Love</b> 감성 일기
                            <span className="text-neutral-500 dark:text-neutral-400">
                                {' '}
                                (돌봄 경험이 단순 서비스가 아닌 추억으로 축적)
                            </span>
                        </li>
                    </ol>

                    <p className="mt-4">
                        <strong>soom</strong>은 단순히 돌봄 공백을 채우는 것을 넘어,
                        <strong> “좋아하는 동물과 함께하며 서로가 안심하고, 그 시간이 하나의 가치로 남는 경험”</strong>
                        을 지향합니다. <br />
                        보호자(Love)에게는 믿음직한 동행을, 펫시터(Buddy)에게는 의미 있는 활동과 성취를 제공하며, 단순
                        알바가 아닌 <strong>‘보람과 수익이 공존하는 동행자 모델’</strong>을 제안합니다.
                    </p>
                </Section>
            </Card>
            {/* Concept */}
            <Card>
                <Section id="concept__about" title="숨이란?">
                    <p>
                        숨은 생명의 기본이자 반려동물과 사람이 함께 살아가는 리듬을 의미합니다.
                        <br /> 러브 앤드 버디는 “숨결처럼 자연스럽고 따뜻한 연결”을 지향하며, 보호자와 버디가 서로의
                        삶에 편안하게 녹아들 수 있는 공간을 만들고자 했습니다.
                    </p>
                </Section>
                <Divider />
                <Section id="concept__naming" title="서비스 언어">
                    <ul className="list-disc pl-5 mt-3 space-y-1">
                        <li>
                            <strong>Love</strong> : 펫시터를 찾는 보호자
                        </li>
                        <li>
                            <strong>Buddy</strong> : 신뢰할 수 있는 펫시터
                        </li>
                        {/* <li>
<strong>Love & Buddy</strong> : 보호자와 버디의 연결을 직관적으로 표현
</li> */}
                        <li>
                            <strong>Lovuddy (러버디)</strong> : Love와 Buddy의 합성어로, 보호자와 버디가 서로의 역할을
                            자유롭게 오가며 매칭할 수 있는 통합 사용자 모델.
                        </li>

                        <li>
                            <strong>find.myDearDay</strong> : 보호자가 원하는 날짜에 맞춰 버디를 예약할 수도 있고,
                            버디가 자신이 가능한 날을 올려 러브를 만날 수도 있는 <strong>양방향 매칭 메뉴</strong>.
                            단순한 예약 기능을 넘어, <strong>“함께 특별해지는 하루를 찾는다”</strong>는 의미를 담음
                        </li>

                        <li>
                            <strong>dear.Love</strong> : 러브와 버디가 함께 남기는 감성 일기장. 돌봄 기록과 반려동물의
                            순간들이 모인 교감의 아카이브
                        </li>
                        <li>
                            <strong>our.dailyMoments</strong> : 러브와 버디가 소소한 일상과 경험을 공유하는 커뮤니티
                            공간. 서로의 Dear Love 기록과 이야기가 연결되며 공감 확장
                        </li>
                        <li>
                            <strong>BuddyToki</strong> : 워키토키처럼 러브와 버디가 실시간 대화로 연결되는 채팅 메뉴
                        </li>
                    </ul>
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                        각각의 이름은 단순한 라벨이 아니라, <strong>서비스 철학과 정체성을 반영한 상징</strong>입니다.
                    </p>
                </Section>
                <Divider />
                <Section id="concept__birth-buddy" title="버디의 탄생">
                    <BuddyConcept />
                </Section>
                <Divider />
                <Section id="concept__character" title="버디 캐릭터 스토리">
                    <BuddyStory />
                </Section>
                <Divider />
                <Section id="concept__site-concept" title="사이트 컨셉">
                    <p>
                        숨은 단순 플랫폼이 아니라 커뮤니티 공간입니다. 감각적인 인터페이스(뉴모피즘, 몽환적인 톤)와
                        감성적인 기록(Dear Love 일기장)을 통해,
                        <br /> 사용자가 서비스와 교감하는 순간 자체가 하나의 경험이 되도록 기획했습니다.
                    </p>
                    <div className="px-2 py-2">
                        <h4 className="text-sm font-semibold mb-2 mt-2 text-neutral-700 dark:text-neutral-200">
                            래퍼런스 이미지
                        </h4>
                        <div className="columns-2 md:columns-3 gap-3 mb-6">
                            {conceptImgs.map((item, i) => (
                                <figure
                                    key={i}
                                    className="mb-3 break-inside-avoid overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700"
                                >
                                    <img
                                        src={`/concept_site/${item}.png`}
                                        alt={`Reference UI ${i + 1}`}
                                        className="w-full h-auto object-cover"
                                    />
                                </figure>
                            ))}
                        </div>

                        <DividerS />
                        <div className="">
                            <h4 className="text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-200">
                                컬러 팔레트
                            </h4>
                            <div className="flex gap-2">
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-12 h-12 rounded-lg border border-neutral-300"
                                        style={{ backgroundColor: '#f3f7ee' }}
                                    />
                                    <span className="text-[11px] mt-1 text-neutral-500">#f3f7ee</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-12 h-12 rounded-lg border border-neutral-300"
                                        style={{ backgroundColor: '#e3ecdc' }}
                                    />
                                    <span className="text-[11px] mt-1 text-neutral-500">#e3ecdc</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-12 h-12 rounded-lg border border-neutral-300"
                                        style={{ backgroundColor: '#c8d9b5' }}
                                    />
                                    <span className="text-[11px] mt-1 text-neutral-500">#c8d9b5</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-12 h-12 rounded-lg border border-neutral-300"
                                        style={{ backgroundColor: '#9dbb80' }}
                                    />
                                    <span className="text-[11px] mt-1 text-neutral-500">#9dbb80</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-12 h-12 rounded-lg border border-neutral-300"
                                        style={{ backgroundColor: '#303d23' }}
                                    />
                                    <span className="text-[11px] mt-1 text-neutral-500">#303d23</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                <Divider />
                <Section id="concept__design-keywords" title="디자인 키워드">
                    <ul className="list-disc pl-5 mt-3 space-y-1">
                        <li>따뜻함 & 감성 : 연한 녹색 톤 (#f3f7ee, #e3ecdc), 부드러운 그림자</li>
                        <li>투명성 : lowercase 텍스트, 담백한 타이포그래피</li>
                        <li>자연스러움 : 카드 기반 그리드, 여백 있는 레이아웃</li>
                    </ul>
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                        이러한 디자인 키워드를 통해 편안하고 친근한 서비스 경험을 제공합니다.
                    </p>
                </Section>
                <Divider />
                <Section id="concept__emotional-ux" title="감성 UX 경험">
                    <p>
                        단순한 매칭과 예약을 넘어, 사용자가 남긴 돌봄 기록(Dear Love)이 다시 추억으로 돌아오는 경험을
                        강조했습니다. 기록이 모여 하나의 감성 아카이브가 되며, 이는 단순 플랫폼을 넘어 사용자의 삶에
                        남는 이야기가 됩니다.
                    </p>
                </Section>
            </Card>

            {/* User Flow */}
            <Card>
                <Section id="user-flow__love-journey" title="Love 여정">
                    <FlowList
                        items={[
                            '회원가입 및 프로필 설정 (반려동물 등록)',
                            // '버디 탐색 · 조건 필터(지역/시간/활동) or 러브 카드 등록 (지역/날짜/장소)',
                            // '대화 시작 → 예약 요청',
                            '① 버디 탐색·필터(지역/시간/활동)  /  ② Love 카드(요청서) 게시(지역/시간/활동)',
                            '버디 제안 수신 또는 직접 선택 → 대화 시작 · 예약 요청',
                            '돌봄 이후 Dear Love 기록 확인',
                        ]}
                    />
                </Section>
                <Divider />
                <Section id="user-flow__buddy-journey" title="Buddy 여정">
                    <FlowList
                        items={[
                            // '자격증/이력 업로드 및 검증',
                            // '프로필 공개 범위 및 가능 지역/시간 설정',
                            // '매칭 알림 수신 → 예약 수락/조율',
                            // '돌봄 후기 및 평판 축적',
                            '자격증/이력 업로드 · 검증, 가능 지역/시간·활동 설정',
                            '① 프로필/가능 일정 게시  /  ② Love 카드(요청서) 탐색·필터 후 제안(지원)',
                            '매칭 알림 수신 → 예약 수락/조율',
                            '돌봄 수행 · Dear Love 기록 작성 · 평판 축적',
                        ]}
                    />
                </Section>
                <Divider />
                <Section id="user-flow__lovuddy" title="Lovuddy (통합)">
                    <p>
                        한 계정에서 Love/Buddy 역할 전환이 가능한 통합 사용자 모델. 초기엔 Love 중심 커뮤니티로 진입해
                        점진적으로 Buddy 생태계를 확장.
                    </p>
                </Section>
            </Card>

            {/* User Scenario */}
            <Card>
                <Section id="user-scenario__persona" title="유저 페르소나 & 시나리오">
                    <ScenarioCarousel />
                </Section>
            </Card>

            {/* Wireframes */}
            <Card>
                <Section id="wireframes__auth" title="회원가입 & 프로필">
                    <PlaceholderImage
                        img="/wireframe/signin.png"
                        label="로그인 / 회원가입"
                        desc={
                            <span>
                                ⦿ 역할을 선택하신 뒤 회원가입할 수 있습니다.
                                <br />⦿ 닉네임은 한글, 영어 최대 7자 입니다.
                                <br />⦿ 본인 인증은 러브 또는 버디 활동 시 최초 1회 진행되며, 초기 운영 기간 동안은 가입
                                단계에서 생략됩니다.
                            </span>
                        }
                    />
                    <PlaceholderImage
                        img="/wireframe/signup.png"
                        label="러브 버디 러버디 회원가입 정보 입력"
                        desc={
                            <span>
                                ⦿ 러브 선택 시, 반려동물은 종류와 관계없이 최대 5마리까지 등록할 수 있습니다.
                                <br />⦿ 5마리 초과 등록 시에는 마리당 추가 요금이 부과됩니다.
                                <br />⦿ 여러 마리를 등록한 경우 ‘대표 동물’ 1마리를 지정해야 하며, 이후 언제든 변경할 수
                                있습니다.
                                <br />⦿ 버디/러버디는 자격증 정보 없이도 가입 가능하지만, 버디 활동을 위해서는 자격증
                                등록 · 인성검사 · 본인 인증이 필수입니다.
                            </span>
                        }
                    />
                </Section>
                <Divider />

                <Section id="wireframes__index" title="인덱스">
                    <PlaceholderImage
                        img="/wireframe/home.png"
                        label="인덱스"
                        desc={
                            <span>
                                ⦿ 캘린더(calendar), 커뮤니티 리스트(community list), 메시지 알림(message card) 영역은
                                각각 마우스 오버 시 인터랙션이 드러납니다.
                                <br />⦿ 모든 박스는 드래그 앤 드롭으로 위치를 조정할 수 있으며,
                                <br />⦿ 닫기 버튼 클릭 시 상단 고정 영역으로 자동 이동됩니다.
                            </span>
                        }
                    />
                    <PlaceholderImage img="/wireframe/home_1.png" label="인덱스" />
                    <PlaceholderImage
                        img="/wireframe/calendar_all.png"
                        label="캘린더"
                        desc={
                            <span>
                                ⦿ 캘린더는 기본적으로 와이드 형태로 제공됩니다.
                                <br />⦿ 상단 하늘색 버튼 클릭 시, 캘린더 크기가 축소됩니다.
                                <br />⦿ 버디와의 예약 일정은 이미지와 함께 표시되며, 과거 예약의 경우, 산책일지에서
                                이미지를 가져와 표시합니다.
                            </span>
                        }
                    />
                    <PlaceholderImage
                        img="/wireframe/calendar_all_op.png"
                        label="캘린더 오픈"
                        desc={
                            <span>
                                <br /> ⦿ 주황색 버튼 클릭 시, 선택한 예약의 상세 정보가 오른쪽에 표시됩니다.
                                <br /> ⦿ 선택된 날짜와 시간, 러브/버디 정보가 함께 나타나며, 산책일지로 이동할 수 있는
                                링크도 포함됩니다.
                            </span>
                        }
                    />
                </Section>
                <Divider />
                <Section id="wireframes__find-buddy-love" title="find.myDearDay - love 시점">
                    <PlaceholderImage
                        img="/wireframe/find_buddy_page.png"
                        label="러브가 버디를 찾을 경우"
                        desc={
                            <span>
                                ⦿ 첫 입장 시: 러브 → 버디 찾기 / 버디 → 러브 찾기 카드 리스트가 표시됩니다. <br />⦿
                                설정된 동네가 자동 선택되며, 데이터가 없을 경우 전체 동네 리스트가 표시됩니다. (모달 -
                                동네 최대 3개 선택 가능) <br />⦿ 조건 선택 가능: 날짜, 반려동물 종류, 버디 성별, 하트
                                수, 매너 점수, 디얼러브 작성 수, 신뢰도 입니다. <br />⦿ [신뢰도가 높은 버디 추천] 영역:
                                일정·자격증 세부 내역은 제외, 기본 인증/성별/선호 반려동물 등 핵심 정보만 표시됩니다.{' '}
                                <br />⦿ 신뢰도 높은 버디 기준: 하트 20개 이상 · 디얼러브 20장 이상 · 매너 점수 8점 이상
                                · 수의 관련 자격증 / 펫시터 교육 수료 / 반려동물 경험 인증
                            </span>
                        }
                    />
                    <PlaceholderImage
                        img="/wireframe/find_buddy_place.png"
                        label="동네 설정 화면"
                        desc={
                            <span>
                                ⦿ 설정된 동네 데이터가 없을 경우 초기 화면에서 동네 설정 창이 자동으로 표시됩니다.{' '}
                                <br />⦿ 동네를 선택하지 않아도 버디를 확인할 수 있습니다. (초기 접근성 강화를 위해
                                한시적으로 허용)
                                <br />⦿ 원하는 지역을 직접 입력할 수 있으며, <strong>검색 기능</strong>도 제공합니다.
                            </span>
                        }
                    />
                    <PlaceholderImage
                        img="/wireframe/find_buddy_card.png"
                        label="버디 카드 상세 화면"
                        desc={
                            <span>
                                ⦿ 캘린더 기본은 이번 주만 표시, 펼쳐보기 선택 시 한 달 단위 표시. 이후 일정은 버디룸에서
                                예약 가능합니다.
                                <br />⦿ 기본 버튼은 대화하기이며 클릭 시 동네·장소·시간을 제외한 반려동물 정보로만 대화
                                시작합니다. (초기 접근성 강화를 위해 한시적으로 허용)
                                <br />⦿ 예약하기는 날짜·시간을 설정한 후 활성화되며, 선택된 예약 정보가 전송됩니다.
                                <br />⦿ 버디가 예약 요청을 수락하면, 버디토키를 통해 러브에게 알림이 전송되고 대화가
                                시작됩니다.
                            </span>
                        }
                    />
                    <PlaceholderImage
                        img="/wireframe/find_buddy-ok-love.png"
                        label="예약 확정 후 버디토키 대화 화면"
                        desc={
                            <span>
                                ⦿ 러브가 보낸 예약을 버디가 확정하면, 버디토키를 통해 대화가 시작됩니다.
                                <br /> ⦿ 첫 화면에서 서로의 예약 정보를 이미 확인한 상태이므로, 이후 대화는 해당 조건을
                                바탕으로 진행됩니다.
                            </span>
                        }
                    />
                    <PlaceholderImage
                        img="/wireframe/find_post_love.png"
                        label="러브 카드 작성"
                        desc={
                            <span>
                                ⦿ 러브가 버디를 찾기 위해 반려동물의 정보를 등록하는 페이지입니다.
                                <br />⦿ 이미 등록된 반려동물 정보는 자동으로 불러오며,
                                <br />⦿ 반려동물이 두 마리 이상 등록되어 있는 경우, 기본으로 대표가 먼저 보여지고 추가
                                선택 가능한 리스트가 노출됩니다.
                            </span>
                        }
                    />
                    <PlaceholderImage
                        img="/wireframe/find_love_selected.png"
                        label="반려동물 선택하기"
                        desc={<span></span>}
                    />
                </Section>
                <Divider />
                <Section id="wireframes__find-buddy-buddy" title="find.myDearDay - buddy 시점">
                    <PlaceholderImage
                        img="/wireframe/find_love_page.png"
                        label="러브 소개 페이지"
                        desc={
                            <span>
                                ⦿ 러브 소개 페이지 입니다.
                                <br /> ⦿ 필터 리스트는 버디와 동일하고 신뢰도부분이 <strong>난이도</strong>로
                                변경됩니다.
                                <br /> ⦿ 버디는 자신의 일정과 역량에 맞는 러브를 선택해 <strong>직접 예약 제안</strong>
                                을 보낼 수 있습니다.
                                <br /> ⦿ 이를 통해 러브가 일방적으로 버디를 찾는 구조를 넘어,{' '}
                                <strong>버디 또한 주체적으로 러브에게 접근</strong>할 수 있는 양방향 매칭 경험을
                                제공합니다.
                            </span>
                        }
                    />

                    <PlaceholderImage
                        img="/wireframe/find_love_booking_final.png"
                        label="러브 카드 상세 화면 - 예약 수락 후 예약 확정하기"
                        desc={
                            <span>
                                ⦿ 러브가 올린 예약 요청(날짜·시간·장소 등)에 대해 버디가 대화를 걸어{' '}
                                <strong>예약 제안</strong>하는 흐름을 보여줍니다.
                                <br /> ⦿ 버디는 러브가 등록한 조건을 확인한 뒤, <strong>추가 요청이나 확정</strong>
                                을 위해 대화를 이어갈 수 있습니다.
                                <br /> ⦿ 대화창에서는 예약 관련 세부사항을 조율하고,<strong>합의 후 예약이 확정</strong>
                                됩니다. <br /> ⦿ 버디 채팅창에서는 입력창 옆의 ‘+’ 버튼을 눌러 예약 확정 인터페이스를
                                열고, 선택한 일정 정보를 추가하여 확정할 수 있습니다.
                            </span>
                        }
                    />
                    <PlaceholderImage
                        img="/wireframe/find_buddy_booking.png"
                        label="러브가 버디에게 신청한 예약을 버디토키로 확인하는 화면"
                        desc={<span>⦿ 버디가 러브의 조건 확인 후 예약 확정하기 또는 거절할 수 있습니다.</span>}
                    />
                    <PlaceholderImage
                        img="/wireframe/find_post_buddy.png"
                        label="버디 카드 작성"
                        desc={
                            <span>
                                ⦿ 버디가 러브를 찾기 위해 자신의 정보를 등록하는 페이지입니다.
                                <br />⦿ 이미 등록된 버디 정보는 자동으로 불러오며, 위치가 여러 개일 경우 첫 번째 주소가
                                기본으로 표시됩니다.
                                <br />⦿ 버디의 동네 설정은 최소 <strong>구/시 단위</strong>까지 가능합니다.
                            </span>
                        }
                    />
                    <PlaceholderImage
                        img="/wireframe/find_buddy_selected.png"
                        label="저장된 데이터 선택하기"
                        desc={<span></span>}
                    />
                </Section>
                <Divider />
                <Section id="wireframes__dear-love" title="Dear Love 일기장">
                    <PlaceholderImage
                        img="/wireframe/dear_front.png"
                        label="dear.Love 페이지"
                        desc={
                            <span>
                                ⦿ 사이드 메뉴에서 원하는 연도와 월을 선택할 수 있습니다.
                                <br /> ⦿ 상단 요약 박스에는 날짜·시간·버디·제목 정보가 표시됩니다.
                                <br /> ⦿ 날짜·시간·버디·제목이 표시되는 요약 박스에는 별도의 대표 이미지를 설정할 수
                                있습니다.
                                <br /> ⦿ 사진 박스를 클릭하면 전체 보기 모달이 열리고, 큰 이미지로 확인할 수 있습니다.
                            </span>
                        }
                    />
                    <PlaceholderImage
                        img="/wireframe/dear_front_img.png"
                        label="이미지 뷰어 모달"
                        desc={<span></span>}
                    />
                    <PlaceholderImage
                        img="/wireframe/dear_buddy.png"
                        label="dear.Love 글쓰기"
                        desc={
                            <span>
                                ⦿ 버디와 러브가 함께 산책한 내용을 일지 형태로 등록할 수 있는 페이지입니다.
                                <br /> ⦿ 캘린더에 등록한 일정을 가져와서 보여줄 수 있고 러브는 별도 일정 없이도 자신의
                                반려동물 일지를 작성할 수 있습니다.
                                <br /> ⦿ 사진 등록 후 미리보기가 가능하며, 드래그 앤 드롭으로 순서를 조정할 수 있습니다.
                                <br /> ⦿ 사진 등록 후 첫 번째 보더 박스를 선택하면, 해당 박스에 배경 이미지가 적용되어
                                상단 요약 정보(날짜,시간, 제목 등..)와 함께 표시됩니다.
                            </span>
                        }
                    />
                </Section>
            </Card>

            {/* Architecture */}
            <Card>
                <Section id="architecture__stack" title="Tech Stack">
                    <StackBadges />
                    <ul className="list-disc pl-5 mt-3 space-y-1">
                        <li>Frontend: Next.js (TypeScript), Tailwind CSS</li>
                        <li>
                            Backend: Supabase (Auth, DB, Realtime) — <i>현재는 mock API로 시연</i>
                        </li>
                        <li>Deployment: Vercel</li>
                        <li>Design Assets: ChatGPT 이미지 생성 + Figma</li>
                    </ul>
                </Section>
                <Divider />
                <Section id="architecture__system" title="서비스 아키텍처">
                    <ArchitectureDiagram />
                </Section>
                <Divider />
                <Section id="architecture__db-erd" title="DB 설계 (ERD)">
                    <ERDCard />
                </Section>
            </Card>

            {/* Demo */}
            <Card>
                <Section id="demo__live" title="시연 (live/gif)">
                    <p className="mb-3">핵심 플로우: 회원가입 → 동물 등록 → 버디 리스트 확인</p>
                    <div className="aspect-video w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 grid place-items-center">
                        <span className="text-neutral-500">여기에 GIF/영상 또는 live iframe 삽입</span>
                    </div>
                </Section>
                <Divider />
                <Section id="demo__links" title="배포 & 자료 링크">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <a className="underline hover:no-underline" href="#" aria-disabled>
                                Vercel 배포 링크
                            </a>
                        </li>
                        <li>
                            <a className="underline hover:no-underline" href="#" aria-disabled>
                                GitHub 저장소
                            </a>
                        </li>
                        <li>
                            <a className="underline hover:no-underline" href="#" aria-disabled>
                                Notion / PDF 기획서
                            </a>
                        </li>
                    </ul>
                </Section>
            </Card>

            {/* Business */}
            <Card>
                <Section id="biz__revenue" title="수익 구조">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>민간 자격증 기반 교육·검증 수익</li>
                        <li>상단 노출·지역 타게팅 광고</li>
                        <li>보험/동물병원 제휴 수익</li>
                    </ul>
                </Section>
                <Divider />
                <Section id="biz__roadmap" title="확장 계획">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>커뮤니티 강화 (후기/리뷰, Q&A)</li>
                        <li>Buddy 전문화 (훈련/산책/병원동행 등 카테고리화)</li>
                        <li>예약·결제 모듈 고도화</li>
                    </ul>
                </Section>
            </Card>

            {/* Closing */}
            <Card>
                <Section id="closing__role" title="본인 역할 & 기여">
                    <p>기획 · UX/UI · 프론트엔드 · DB 설계. 실 구현은 핵심 플로우 중심으로 mock API를 사용하여 시연.</p>
                </Section>
                <Divider />
                <Section id="closing__next" title="향후 개선">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Supabase 실 DB 연결 및 RLS 정책 구성</li>
                        <li>예약/채팅 Realtime 연동</li>
                        <li>Dear Love 에디터/갤러리 고도화</li>
                    </ul>
                </Section>
                <Divider />
                <Section id="closing__refs" title="참고 링크">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Figma 파일, 시장 리서치 문서 등</li>
                    </ul>
                </Section>
            </Card>
        </div>
    );
}

function ArchitectureDiagram() {
    return (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Box title="Frontend (Next.js)">
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>App Router, Server/Client Components</li>
                        <li>Tailwind UI, 문서 레이아웃</li>
                        <li>fetch → API Layer</li>
                    </ul>
                </Box>
                <Box title="API Layer (Mock)">
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>RESTful 엔드포인트 설계</li>
                        <li>인증 헤더(추가 예정)</li>
                        <li>요청/응답 스키마 정의</li>
                    </ul>
                </Box>
                <Box title="DB (Supabase 예정)">
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Postgres 스키마: users, animals, certificates, dear_love</li>
                        <li>RLS 정책 (owner 기반)</li>
                        <li>초기엔 mock → 이후 실연결</li>
                    </ul>
                </Box>
            </div>
        </div>
    );
}

function ERDCard() {
    return (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-800">
            <div className="text-sm font-mono whitespace-pre overflow-x-auto">
                {`users (id PK, email, nickname, role)\nanimals (id PK, owner_id FK->users.id, name, breed, age)\ncertificates (id PK, user_id FK->users.id, title, issued_at)\ndear_love (id PK, author_id FK->users.id, date, title, photos[], comment)`}
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                실제 ERD 이미지는 dbdiagram.io 또는 Draw.io로 작성해 교체하세요.
            </p>
        </div>
    );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
            <div className="font-medium mb-2">{title}</div>
            {children}
        </div>
    );
}

function StackBadges() {
    const items = ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Vercel', 'Figma'];
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((t) => (
                <span
                    key={t}
                    className="inline-flex items-center px-3 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm"
                >
                    {t}
                </span>
            ))}
        </div>
    );
}
