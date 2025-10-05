// components/JoinWalkWhy.tsx
export default function JoinWalkWhy() {
    return (
        <div className="space-y-6 text-sm">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <h4 className="text-base font-semibold mb-2">왜 Join Walk(조인 산책)인가</h4>
                <ul className="list-disc pl-5 space-y-1">
                    <li>
                        <b>로컬 네트워크 효과</b> — 같은 동네에서 자주 마주치는 반려견/보호자들이{' '}
                        <b> 그룹으로 함께 산책</b> → 자연스럽게 <b>soom 인지</b> 확산
                    </li>
                    <li>
                        <b>신뢰 기반 낮은 진입장벽</b> — 이미 얼굴/견종/성향을 아는 이웃끼리라 <b> 사전미팅→신청</b>이
                        쉬움
                    </li>
                    <li>
                        <b>무료→유료 전환</b> — <b>첫 조인 무료(수수료 면제)</b>로 경험 제공 → 만족 시{' '}
                        <b>soom 버디 유료 예약</b>으로 전환
                    </li>
                    <li>
                        <b>유지/재방문</b> — 익숙한 멤버/루트로 <b>정기화</b> 되며 재예약·후기·추천이 선순환
                    </li>
                    <li>
                        <b>수익 구조</b> — 러브는 수수료 0%, <b>버디는 커미션 차감</b>. 단, <b>동시간대 N마리</b> 산책
                        시 <b>총액이 커져</b> 실수익도 증가.
                    </li>
                </ul>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <h4 className="text-base font-semibold mb-2">성장 루프(플라이휠)</h4>
                <ol className="list-decimal pl-5 space-y-1">
                    <li>
                        <b>탐지</b> — 동네/시간대 기준 <b>반복 동행 가능 군집</b> 탐색(지오·히스토리)
                    </li>
                    <li>
                        <b>트리거</b> — <b>충성회원 + 난이도 ≤ 3</b> 그룹에 <b>첫 조인 무료</b> 푸시/배너
                    </li>
                    <li>
                        <b>경험</b> — 사전 미팅 후 <b>안전 가드</b>에 따라 조인 산책 수행(사진·dear.Love 기록)
                    </li>
                    <li>
                        <b>전환</b> — 산책 종료 직후 <b>같은 버디 재예약 CTA</b>, 그룹 정기 스케줄 제안
                    </li>
                    <li>
                        <b>확산</b> — 공유/후기로 <b>동네 내 신규 유입</b> → 1단계로 회귀(루프 가속)
                    </li>
                </ol>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 overflow-x-auto">
                <h4 className="text-base font-semibold mb-2">무료→유료 전환 흐름 (예시 지표)</h4>
                <table className="min-w-[680px] w-full text-left">
                    <thead className="text-neutral-600">
                        <tr>
                            <th className="py-1 pr-3">단계</th>
                            <th className="py-1 pr-3">정의</th>
                            <th className="py-1 pr-3">예시 수치</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-t">
                            <td className="py-1 pr-3">초대</td>
                            <td className="py-1 pr-3">동네 군집 대상 조인 초대</td>
                            <td className="py-1 pr-3">100명</td>
                        </tr>
                        <tr className="border-t">
                            <td className="py-1 pr-3">사전 미팅 완료</td>
                            <td className="py-1 pr-3">성향/하네스/접종 확인</td>
                            <td className="py-1 pr-3">30명 (30%)</td>
                        </tr>
                        <tr className="border-t">
                            <td className="py-1 pr-3">첫 조인(무료)</td>
                            <td className="py-1 pr-3">수수료 면제 이벤트로 체험</td>
                            <td className="py-1 pr-3">20명 (20%)</td>
                        </tr>
                        <tr className="border-t">
                            <td className="py-1 pr-3">첫 유료 예약</td>
                            <td className="py-1 pr-3">같은 버디/그룹 재예약</td>
                            <td className="py-1 pr-3">10명 (10%)</td>
                        </tr>
                        <tr className="border-t">
                            <td className="py-1 pr-3">정기화</td>
                            <td className="py-1 pr-3">주 1회 이상 반복</td>
                            <td className="py-1 pr-3">6명 (6%)</td>
                        </tr>
                    </tbody>
                </table>
                <p className="text-[12px] text-neutral-500 mt-2">
                    * 예시 수치이며 지역/시즌/공급에 따라 변동. 무료는 <b>러브 수수료 면제</b> 방식으로 제공.
                </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <h4 className="text-base font-semibold mb-2">운영 정책</h4>
                <ul className="list-disc pl-5 space-y-1">
                    <li>
                        <b>혜택 조건</b> — + 참여 반려동물 <b>난이도 ≤ 3</b> 조인 할인/면제 적용
                    </li>
                    <li>
                        <b>무료 범위</b> — 러브 측 <b>플랫폼 수수료 면제</b>(0%).
                        <b>버디 실수익은 (단가×마리수)×(1−커미션)</b>으로 산정되며, 커미션은 <b>버디 측에서 차감</b>.
                        동일 시간에 여러 마리를 조인하면 총 실수익은 늘어남.
                    </li>

                    <li>
                        <b>사전 미팅 필수</b> — 성향/사이즈/연령/예방접종·중성화·하네스 적합/비상 연락망 체크
                    </li>
                    <li>
                        <b>안전 가드</b> — 리드 1마리 1개 원칙, 공격성/분리불안/발바닥 체크리스트, 보험/보증 옵션
                    </li>
                    <li>
                        <b>한도</b> — 무료/면제는 계정·월 기준 횟수 제한(예: 월 1회) 및 지역별 운영 토글
                    </li>
                </ul>
            </div>
            <div className="rounded-2xl  p-4">
                <blockquote className="text-[14px] leading-relaxed">
                    <b>“첫 걸음은 가볍게, 다음은 믿음으로. 만족스럽다면 soom 버디로 이어가세요.”</b>
                    <br />
                    같은 동네, 익숙한 이웃, 알고 지낸 강아지 친구들과 시작하는 가장 안전한 첫걸음.
                </blockquote>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <h4 className="text-base font-semibold mb-2">조인 산책 기반 오프라인 확장</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                        <b>리드 생성</b> — 조인 산책으로 형성된 <b>동네 커뮤니티</b>를 제휴 상권(유치원·카페·호텔링)과
                        연결
                    </li>
                    <li>
                        <b>제휴 입점</b> — 검증된 사업장만 선별(사업자·안전체크·보험). soom에 <b>제휴 뱃지</b>로 노출
                    </li>
                    <li>
                        <b>슬롯 판매</b> — 제휴점의 <b>시간/좌석(슬롯)</b>을 실시간으로 예약·결제.{' '}
                        <b>첫 이용 러브 수수료 0%</b>
                    </li>
                    <li>
                        <b>콘텐츠 루프</b> — 등원/놀이/산책 스냅을 <b>dear.Love</b>로 자동 기록 → 후기/추천으로 재유입
                    </li>
                    <li>
                        <b>리텐션</b> — 그룹 정기권, 다마리 번들, 요일 패스 등 <b>정기상품</b>으로 재방문 고정
                    </li>
                </ul>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <h4 className="text-base font-semibold mb-2">soom 멤버 혜택(유치원·카페)</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                        <b>대상</b> — <b>조인 산책 참여 이력</b>이 있거나 <b>soom 인증 회원</b>(앱 회원등급/스탬프)에게
                        제휴 할인
                    </li>
                    <li>
                        <b>혜택 종류</b> — 첫 이용 <b>X%</b> 할인, 다회권/정기권 <b>번들 할인</b>, 카페{' '}
                        <b>동반/맡김 시간제</b> 할인
                    </li>
                    <li>
                        <b>정산</b> — 결제금액 × <b>(1 − 커미션)</b> 정산. <b>러브 수수료 0%</b>, 커미션은 사업장/버디
                        측에서 차감
                        <span className="text-[12px] text-neutral-500 ml-1">※ 동일 시간 다마리 이용 시 총 실수익↑</span>
                    </li>
                    <li>
                        <b>안전</b> — 성향/백신 확인, 1견1리드, 공간 분리·모니터링, 긴급 연락/병원 동행 프로토콜 필수
                    </li>
                    <li>
                        <b>자격 유지</b> — 노쇼/규정 위반 시 혜택 회수, 지역/월별 한도 및 프로모션 토글 운영
                    </li>
                </ul>
            </div>
        </div>
    );
}
