import { BuddyConcept, BuddyStory } from './buddy';
import CaseStudy from './doc.case';
import JoinWalkWhy from './doc.join.why';
import JoinWalkRevenue from './doc.joinwalk';
import { Type, DomainTypes } from './doc.type';
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
                <Section id="architecture__type" title="Types">
                    {Type()}
                    {DomainTypes()}
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
                <Section id="demo__case-study" title="기획서 요약 (Case Study)">
                    <CaseStudy />
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
                    </ul>
                </Section>
            </Card>

            {/* Business */}
            <Card>
                <Section id="biz__revenue" title="수익 구조">
                    <div className="space-y-4 text-sm">
                        <div>
                            <h4 className="font-semibold mb-2">1) 핵심 수익원</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <b>자격증 기반 교육 수익</b> — 민간 훈련소 제휴 & 자체 아카데미 운영.
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li>수강료·시험료·재응시료·교재/키트 판매</li>
                                        <li>
                                            제휴 훈련소와 <i>수강료 분배(Rev-Share)</i>, soom 인증 커리큘럼 제공
                                        </li>
                                        <li>
                                            플랫폼 공급부족 지역/시간대에는 <i>장학·할인</i>으로 빠른 공급 확보
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <b>매칭 수수료(테이크 레이트)</b> — 기본 커미션 + 결제/플랫폼 수수료.
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li>
                                            예) 기본 12–18% 커미션 / 상위 티어 버디는 <i>커미션 감면·환급</i>
                                        </li>
                                        <li>서비스 수수료를 Love 측에 일부 전가(예: 3–5%)하여 양면시장 부담 균형</li>
                                    </ul>
                                </li>
                                <li>
                                    <b>광고</b> — 상단 노출(스폰서 카드), 지역 타게팅.
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li>CPC/CPA 혼합(시즌·지역별 패키지)</li>
                                        <li>카테고리 스폰서십(대형견/고양이/초보자용 가이드 등)</li>
                                    </ul>
                                </li>
                                <li>
                                    <b>제휴 수익</b> — 보험·동물병원·용품.
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li>
                                            보험: 폴리시 당 <i>CPA</i> 또는 유지율 기반 리베이트
                                        </li>
                                        <li>
                                            동물병원: 건강검진/예방접종 번들 쿠폰 <i>Rev-Share</i>
                                        </li>
                                        <li>
                                            용품/사료/간식: 제휴몰·링크 아웃 <i>어필리에이트</i>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <b>버디 Pro 구독(선택)</b> — 배지 강화, 즉시 정산, 일정·분석, 노출 부스터 등 부가
                                    기능 월 구독
                                </li>
                            </ul>
                        </div>
                        <Divider />

                        <div>
                            <h4 className="font-semibold mb-2">2) 인센티브 설계 (버디 유입·품질 동시 달성)</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <b>버디 티어링</b> — S/A/B/C. 자격증·후기·완료율·재예약율로 산정.
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li>
                                            S/A 티어: <i>커미션 감면 또는 면제</i>, 상단 노출 가중치↑, 더 높은 시급
                                            가이드
                                        </li>
                                        <li>
                                            자격증·수의테크니션·관련 경력 가중치 → <i>페이 상승</i> & <i>수수료 감면</i>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <b>공급 전략</b> — 초기엔 Love 커뮤니티(디얼러브) 집중으로 수요 집적 - 트위터(엑스)
                                    바이럴 → “좋아하는 일로 쉽게 번다” 메시지로 버디 유입
                                </li>
                                <li>
                                    <b>교육-매칭 연계</b> — 교육 이수/합격 → 즉시 티어 반영, 특정 지역·시간대는{' '}
                                    <i>수강료 보조</i>로 공급 탄력 확보
                                </li>
                            </ul>
                        </div>

                        <Divider />
                        <div>
                            <h4 className="font-semibold mb-2">3) 단계별 운영</h4>
                            <ol className="list-decimal pl-5 space-y-1">
                                <li>
                                    <b>Phase 1: 커뮤니티/콘텐츠 성장</b> — dear.Love로 UGC 유입, Love 활성화 → 초기
                                    매출은 광고·제휴 소폭
                                </li>
                                <li>
                                    <b>Phase 2: 버디 풀 구축</b> — 교육/자격증 트랙 론칭, 티어링/감면 인센티브 → 매칭
                                    매출 본격화
                                </li>
                                <li>
                                    <b>Phase 3: 수익 다각화</b> — Pro 구독, 지역 스폰서십, 보험/병원 본격 제휴
                                </li>
                            </ol>
                            <div className="mt-2">
                                <b>핵심 KPI</b> — 첫 매칭 완료율, 재이용률(30일), 버디 S/A 비중, 교육 이수→매칭 전환율,
                                CAC : LTV, 지역별 커버리지.
                            </div>
                        </div>

                        <Divider />
                        <div>
                            <h4 className="font-semibold mb-2">4) 단가/모형 예시 (튜닝 용)</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>매칭 커미션: 기본 15% / S티어 5–8% / A티어 8–12%</li>
                                <li>Love 서비스 수수료: 3–5% (환불/보호 프로그램 포함)</li>
                                <li>교육: 기본 과정 ₩3xx,xxx / 심화·전문 ₩5xx,xxx / 시험·재응시·키트 별도</li>
                                <li>광고: 지역 패키지 월 ₩x00,000~ / CPC ₩x00~ / 스폰서 카드 고정가</li>
                                <li>보험/병원 제휴: CPA ₩x,xxx~ / Rev-Share 5–15%</li>
                            </ul>
                            <p className="text-[12px] text-neutral-500 mt-1">
                                ※ 숫자는 초기 가이드. 지역·시즌·공급 상황에 맞춰 A/B 테스트로 최적화.
                            </p>
                        </div>

                        <Divider />
                        <div>
                            <h4 className="font-semibold mb-2">5) 리스크 & 가드</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    자격증 남발/신뢰 하락 리스크 → <b>커리큘럼 표준화</b>, 실습·평가·갱신 제도, 무작위
                                    샘플 리뷰
                                </li>
                                <li>
                                    양면시장 불균형 → 특정 지역/시간대 <b>장학/보조·보너스</b>로 공급 탄력 확보
                                </li>
                                <li>품질·안전 → 보험 번들/사고 리포팅/재발 방지 교육, RLS·평판 시스템</li>
                            </ul>
                        </div>
                    </div>
                </Section>

                <Divider />
                <Section id="biz__audience" title="타깃 고객">
                    <div className="space-y-3 text-sm">
                        <div>
                            <h4 className="font-semibold mb-1">버디(Buddy)</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    대학생/취준생/알바생: <b>20–30대</b> 초중반, 유연한 스케줄 선호
                                </li>
                                <li>
                                    가정주부/경력단절 재도전: <b>파트타임</b> + 돌봄 경험 활용
                                </li>
                                <li>
                                    관련 전공/경력: 수의테크니션·훈련 보조 등 <b>전문 트랙</b> 선호
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-1">러브(Love)</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <b>30대+</b> 1인가구 여성: 혼자 사는/직장인, <b>안전·신뢰</b> 최우선
                                </li>
                                <li>
                                    장시간 근무/외근이 잦은 직장인: <b>빠른 매칭·정시 케어</b> 니즈
                                </li>
                                <li>
                                    초보 집사/대형견 보호자: <b>경험/자격 기반 안심</b> 니즈
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-1">핵심 니즈 요약</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    버디: <b>좋아하는 일로 쉬운 수익</b> · 유연한 스케줄 · <b>자격-수익 연동</b>
                                </li>
                                <li>
                                    러브: <b>검증/안전</b> · 신속 매칭 · <b>케어 기록 공유</b>(dear.Love)
                                </li>
                            </ul>
                        </div>
                    </div>
                </Section>
                <Divider />
                <Section id="biz__growth" title="유입/성장 전략">
                    <div className="space-y-4 text-sm">
                        <div>
                            <h4 className="font-semibold mb-2">1) 채널</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <b>트위터(X) 바이럴</b>: 스레드/밈 + 짧은 팁(산책 노하우, 안전체크리스트)로{' '}
                                    <b>버디 유입</b>
                                </li>
                                <li>
                                    <b>인스타그램</b>: <b>dear.Love UGC</b> 리그램(허가), 릴스 하이라이트 →{' '}
                                    <b>러브 신뢰</b> 형성
                                </li>
                                <li>
                                    <b>캠퍼스/지역 커뮤니티</b>: 동아리·학과 제휴, 맘카페·아파트 커뮤니티
                                </li>
                                <li>
                                    <b>제휴</b>: 훈련소/병원/용품사와 콘텐츠 공동 제작(쿠폰·체험단)
                                </li>
                                <li>
                                    <b>추천(리퍼럴)</b>: 버디↔러브 초대 코드 · 양면 보상
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">2) 메시지 & 오퍼</h4>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="rounded-xl border p-3">
                                    <div className="font-semibold mb-1">버디 대상</div>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>
                                            <b>“좋아하는 반려동물과 함께, 쉽게 버는 부수입”</b>
                                        </li>
                                        <li>
                                            자격/경력 있을수록 <b>커미션 감면·페이 상승</b>
                                        </li>
                                        <li>
                                            교육 수료 시 <b>즉시 티어 반영</b> · 상단 노출 가중치
                                        </li>
                                    </ul>
                                </div>
                                <div className="rounded-xl border p-3">
                                    <div className="font-semibold mb-1">러브 대상</div>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>
                                            <b>자격증/후기/매너지수</b>로 안심 매칭
                                        </li>
                                        <li>
                                            <b>dear.Love</b>로 케어 기록(사진·노트·날씨) 투명 공유
                                        </li>
                                        <li>
                                            긴급/정기 케어 <b>빠른 예약</b> 가이드
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">3) 초기 실행 플랜</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <b>트위터(X), 스레드 주 3회</b>: 알바/부업·펫케어 팁(버디 톤)
                                </li>
                                <li>
                                    <b>인스타 릴스 주 4개</b>: dear.Love 사진 슬라이드/전후 비교/산책 하이라이트
                                </li>
                                <li>
                                    <b>캠퍼스 앰버서더</b>: 동물 관련 학과·동아리 대상 온보딩 데이
                                </li>
                                <li>
                                    <b>UGC 가이드</b>: dear.Love 업로드 체크리스트 + 리그램 동의 플로우
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">4) 측정 지표</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>채널별 CTR / 가입 전환(CVR) / CAC</li>
                                <li>버디: 교육 수료→S/A 티어 전환율, 활성 버디 수, 매칭률</li>
                                <li>러브: 첫 매칭 완료율, dear.Love 작성률, 재이용률(30일)</li>
                            </ul>
                        </div>
                    </div>
                </Section>
                <Divider />
                <Section id="biz__roadmap" title="확장 계획">
                    <div className="space-y-6 text-sm">
                        {/* 커뮤니티 강화 */}
                        <div>
                            <h4 className="font-semibold mb-2">커뮤니티 강화</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>dear.Love 상호 공유 피드(팔로우/북마크/리그램 허가 플로우)</li>
                                <li>퀵 포스트(이미지·짧은 글) — 트위터(X)처럼 반려동물 외 일상 토픽도 허용</li>
                                <li>가벼운 모더레이션(신고/숨기기) & 공개범위(전체/팔로워/비공개)</li>
                            </ul>
                        </div>

                        {/* Buddy 전문화 */}
                        <div>
                            <h4 className="font-semibold mb-2">Buddy 전문화 (카테고리화)</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    카테고리: <b>훈련 보조</b> / <b>산책</b> / <b>병원 동행</b> / <b>투약 보조</b> /{' '}
                                    <b>노령견 케어</b>
                                </li>
                                <li>
                                    전문 배지 & 최소 요건: 관련 자격/경력·후기·완료율 기준 → <b>S/A/B/C 티어</b> 산정
                                </li>
                                <li>카테고리별 요금 가이드·체크리스트·사고대응 매뉴얼 제공</li>
                            </ul>
                        </div>

                        {/* Love Pro: 다묘·다견 */}
                        <div>
                            <h4 className="font-semibold mb-2">Love Pro (다묘·다견 업그레이드)</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    기본 동물 슬롯: <b>초기 가입자 5</b> / 이후 신규 가입자 <b>3</b>
                                </li>
                                <li>
                                    Pro 구독: 슬롯 <b>6개 제공</b> (최대 <b>12개</b>까지 확장)
                                </li>
                                <li>
                                    추가 슬롯: <b>₩1,900/월 · 1슬롯</b> (6개 초과분부터 적용)
                                </li>
                                <li>
                                    멀티펫 번들 예약 시 플랫폼 수수료 할인(동시간·동버디 조건)
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li>
                                            2마리: 수수료 <b>-5%</b>
                                        </li>
                                        <li>
                                            3마리: 수수료 <b>-10%</b>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        {/* Buddy Pro */}
                        <div>
                            <h4 className="font-semibold mb-2">Buddy Pro (전문 버디를 위한 수익/노출 부스트)</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    <b>Pro Lite — ₩9,900/월</b>: 커미션 <b>-3%p</b>, 상단 노출 <b>주 1회</b>,
                                    일정/빠른응답/간단 리포트
                                </li>
                                <li>
                                    <b>Pro Plus — ₩19,900/월</b>: 커미션 <b>-7%p</b>, 상단 노출 <b>주 3회</b>, 즉시
                                    정산(1%), 후기요청 자동화
                                </li>
                                <li>
                                    티어 연동: S/A/B/C에 따라 <b>추가 -0~2%p</b> 감면(최저 커미션 하한 유지)
                                </li>
                            </ul>
                        </div>

                        {/* 예약·결제 고도화 */}
                        <div>
                            <h4 className="font-semibold mb-2">예약·결제 모듈 고도화</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>멀티펫/다회차 번들, 추가요금, 전자영수증</li>
                                <li>취소/지연 정책 레벨링(버디/러브 균형)</li>
                                <li>보증/보험 번들(제휴) — 예약 시 선택</li>
                            </ul>
                        </div>

                        {/* 측정/가드 */}
                        <div>
                            <h4 className="font-semibold mb-2">지표 & 가드</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Love Pro: Pro 가입률, 평균 슬롯 수, 멀티펫 ARPU, 번들 할인 이용률</li>
                                <li>Buddy Pro: Pro 전환률, 유효 노출→예약 전환, 커미션 실효율</li>
                                <li>조인 산책: 사전 미팅 완료율, 매칭 성공률, 사건/사고율, 재조인율</li>
                            </ul>
                        </div>

                        {/* Join Walk: 조인 산책 */}
                        <div>
                            <h4 className="font-semibold mb-2">Join Walk (조인 산책)</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    개념: 같은 시간/동네에 <b>서로 다른 가정의 반려동물</b>을 <b>한 번에 산책</b> (최대
                                    3마리 권장)
                                </li>
                                <li>
                                    <b>사전 미팅(필수)</b>: 성향/사이즈/연령/예방접종·중성화·하네스 적합 등{' '}
                                    <b>호환성 체크</b>
                                </li>
                                <li>매칭: 공개(조인 신청) / 초대(기존 이력 기반) 두 모드 지원</li>
                                <li>
                                    안전 가드: 리드 1마리 1개 원칙, 공격성/분리불안/발바닥 상태 체크리스트, 비상
                                    연락망·보험 옵션
                                </li>
                            </ul>
                        </div>
                        <JoinWalkWhy />
                        <JoinWalkRevenue />
                    </div>
                </Section>
            </Card>

            {/* Closing */}
            <Card>
                <Section id="closing__role" title="본인 역할 & 기여">
                    <p>기획 · UI/UX · 프론트엔드 · DB 설계. 실 구현은 핵심 플로우 중심으로 mock API를 사용하여 시연.</p>
                </Section>
                <Divider />
                <Section id="closing__next" title="향후 개선">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <b>Supabase 실 DB 연결 & RLS 정책 정비</b>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>
                                    스키마 확정: <i>users / animals / certificates / bookings / messages / dear_love</i>
                                </li>
                                <li>RLS: 본인 레코드 쓰기, 공개 범위별 읽기(공개/팔로워/비공개), 서비스롤 예외</li>
                                <li>
                                    스토리지 버킷: <i>avatars / dearlove / certificates</i> + 퍼블릭/사인드 URL 정책
                                </li>
                                <li>SQL 마이그레이션 & 초기 시드 데이터(개발/스테이징 분리)</li>
                            </ul>
                        </li>

                        <li>
                            <b>예약/채팅 Realtime 연동</b>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>
                                    채널 설계:{' '}
                                    <i>
                                        booking:{'{id}'} / dm:{'{pairId}'}
                                    </i>
                                    , Presence & typing 표시
                                </li>
                                <li>메시지 모델: 읽음표시, 첨부(사진/위치), 소프트 삭제, 신고 플래그</li>
                                <li>
                                    예약 상태머신: <i>requested → accepted → in_progress → done → disputed</i>
                                </li>
                                <li>알림 훅: 수락/변경/취소/조인확정 시 푸시·이메일(옵션)</li>
                            </ul>
                        </li>

                        <li>
                            <b>dear.Love 에디터/갤러리 고도화</b>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>블록/마크다운 혼합 에디팅, 드래그·드롭 업로드, 진행률 표시</li>
                                <li>이미지 리사이즈/웹 최적화, EXIF 타임라인 자동 정렬</li>
                                <li>갤러리: Masonry 레이아웃, 태그/날씨 필터, 공개 범위(공개/팔로워/비공개)</li>
                                <li>좋아요 반응 버튼 추가, 이미지 릴스로 제작 </li>
                            </ul>
                        </li>

                        <li>
                            <b>커뮤니티 오픈</b>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>
                                    보드: 동네/주제 분류 + <i>조인 산책 매칭</i> 탭 (find.myDearDay와 버디룸에도 추가)
                                </li>
                                <li>모더레이션: 신고/차단, 키워드 필터, 레이트 리밋, 관리자 툴</li>
                                <li>참여 리워드: 배지/레벨, 주간 인기 포스트</li>
                            </ul>
                        </li>

                        <li>
                            <b>인덱스 커뮤니티 리스트 & 바로 글쓰기</b>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>피드: 최신/인기/내 근처 정렬, 무한 스크롤, 스켈레톤</li>
                                <li>퀵 컴포저: 텍스트/사진/해시태그/위치, 미리보기 후 즉시 발행</li>
                                <li>접근성/성능: SSR/ISR, 이미지 최적화, 키보드 내비게이션</li>
                            </ul>
                        </li>
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
                <Box title="DB (Supabase)">
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
                {`users (
  id uuid PK, email text, name text, nickname text,
  type role_enum, avatar_url text, birth_year int4,
  user_comment text, created_at timestamptz
)

animals (
  animal_uuid uuid PK,
  owner_uuid uuid FK->users.id,
  owner_nickname text,
  name text, birth_year int4,
  type animal_type, variety text, color text,
  personality personality, level text,
  comment text, img text, first bool,
  created_at timestamptz
)

certificates (
  id uuid PK,
  user_id uuid FK->users.id,
  name text, issuer text,
  acquired_at date, url text,
  created_at timestamptz
)

dear_love (
  id uuid PK,
  author_id uuid FK->users.id,
  author_type card_kind_enum,
  buddy_user_id uuid FK->users.id,
  date_at timestamptz,
  title text, weather weather_enum,
  representative_img text,
  photos text[], comment text,
  location text, place text, tags text[],
  visibility dearlove_visibility_enum,
  likes int4, bookmarks int4, comments_count int4,
  created_at timestamptz, updated_at timestamptz
)`}
            </div>

            <a href="/wireframe/supa.png" target="_blank" rel="noopener noreferrer">
                <img
                    src="/wireframe/supa.png"
                    alt="schema"
                    className="w-full h-[500px] rounded-xl mt-2 cursor-zoom-in border border-gray-200"
                />
            </a>
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
