'use client';

import { useState } from 'react';
import ModalIos from '@/common/modal.ios';

export default function CaseStudy() {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-600">
                    <b>soom</b>은 반려인과 신뢰 가능한 버디를 연결하고, 함께한 순간을 기록·공유하는 펫케어 플랫폼입니다.
                </p>
                {/* <button
                    onClick={() => setOpen(true)}
                    className="px-3 py-1.5 rounded-lg custom-card hover:custom-card-hover"
                >
                    PRD 전체 보기
                </button> */}
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
                <SummaryCard
                    title="문제"
                    points={[
                        '시터 신뢰/경력 정보가 파편화',
                        '반려동물 특성 맞춤 매칭 부재',
                        '케어 기록 공유가 번거롭거나 소실',
                    ]}
                />
                <SummaryCard
                    title="해결"
                    points={[
                        '자격증·후기·매너지수 기반 검증',
                        '지역/시간/동물 타입 필터 매칭',
                        'dear.Love로 사진/코멘트 기록',
                    ]}
                />
                <SummaryCard
                    title="MVP"
                    points={['가입/설정(아바타·동물·자격증)', '검색/카드·예약요청', 'dear.Love 게시']}
                />
            </div>

            <ModalIos
                isOpen={open}
                handleModalState={() => setOpen(false)}
                title="soom · 기획서"
                width="980px"
                height="88vh"
            >
                <div className="p-4 h-[calc(85vh-100px)] overflow-y-auto no-scrollbar space-y-8">
                    <Section title="TL;DR">
                        <ul className="list-disc pl-5  space-y-1">
                            <li>
                                <b>문제</b>: 신뢰 가능한 펫케어를 빠르게 찾기 어렵다.
                            </li>
                            <li>
                                <b>해결</b>: 검증(자격/후기/매너지수) + 간편 매칭 + 기록 공유.
                            </li>
                            <li>
                                <b>핵심</b>: Trust · Match · Record
                            </li>
                        </ul>
                    </Section>

                    <Section title="배경 & 문제 정의">
                        <Bullet
                            items={[
                                '보호자: 자격/경험 비교 어려움, 특성 맞춤 매칭 부재, 기록 공유 불편',
                                '시터: 자격 증빙 UX 부족, 일정·평판·콘텐츠 분산',
                            ]}
                        />
                    </Section>

                    <Section title="핵심 기능(MVP)">
                        <Bullet
                            items={[
                                '가입/설정: 이메일, 아바타, 닉네임, 동물(대표 보장), 자격증 업로드',
                                '검색/카드: 역할 필터, 3열 카드, 상세/즐겨찾기',
                                '예약(라이트): 날짜·장소 제안 → 수락/거절',
                                'dear.Love: 사진·텍스트·날씨·태그 기록',
                            ]}
                        />
                    </Section>

                    <Section title="아키텍처 & 스택">
                        <Bullet
                            items={[
                                'FE: Next.js(App Router), Tailwind, shadcn/ui',
                                'BE/DB: Supabase(Auth/Postgres/Storage), RLS',
                                'Storage: 업로드→publicUrl 저장 / 이미지 미리보기',
                            ]}
                        />
                    </Section>

                    <Section title="데이터 모델 요약">
                        {`users(id, email, name, user_nickname, type, avatar_url, user_birth_year, user_comment)
animals(id, owner_id→users.id, name, birth_year, type, personality, first)
certificates(id, user_id→users.id, name, issuer, acquired_at, url)
dear_love(id, author_id→users.id, author_type, date_at, title, photos[], comment, visibility)`}
                    </Section>

                    <Section title="보안/RLS">
                        <Bullet
                            items={[
                                'users/animals/certificates: 소유자만 CRUD',
                                'dear_love: 공개글 읽기, 작성자 쓰기',
                                '서버: service role은 서버 라우트에서만 사용',
                            ]}
                        />
                    </Section>

                    <Section title="데모 시나리오">
                        <Bullet
                            items={[
                                '가입/로그인 → 아바타/닉네임/소개 저장',
                                '동물 등록 + 자격증 업로드(PDF/이미지)',
                                '검색·카드 상세 → 예약요청',
                                'dear.Love 작성/목록',
                            ]}
                        />
                    </Section>
                </div>
            </ModalIos>
        </div>
    );
}

function SummaryCard({ title, points }: { title: string; points: string[] }) {
    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-3">
            <div className="text-[13px] font-semibold mb-2">{title}</div>
            <ul className="text-[12px] text-neutral-600 space-y-1 list-disc pl-4">
                {points.map((p, i) => (
                    <li key={i}>{p}</li>
                ))}
            </ul>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    const isCode = typeof children === 'string';
    return (
        <section>
            <h3 className="text-sm font-semibold mb-2">{title}</h3>
            {isCode ? (
                <pre className="text-xs md:text-sm font-mono whitespace-pre-wrap bg-neutral-50 rounded-xl p-3 border">
                    {children as string}
                </pre>
            ) : (
                <div className="text-sm text-neutral-700">{children}</div>
            )}
        </section>
    );
}

function Bullet({ items }: { items: string[] }) {
    return (
        <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
            {items.map((x, i) => (
                <li key={i}>{x}</li>
            ))}
        </ul>
    );
}
