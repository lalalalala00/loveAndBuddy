import { Card, User } from '@/utils/data';
import { Animal, Certificate } from '@/utils/sign';

// 러브 카드 생성: 내 동물 리스트에서 대표 한 마리의 level을 꺼내와 level에 복사
export function createLoveCard(user: User, animals: Animal[]): Card {
    const owner = animals.find((a) => a.first) ?? animals[0];
    return {
        ...user,
        cardKind: 'love',
        manner: 3,
        heart: 4,
        dearLove: 0,
        gender: '',
        bookmarks: [],
        bookings: [],
        reliability: undefined, // 러브 탭은 사용 안 함
        level: owner?.level ?? '0', //  대표 동물 레벨을 카드에 복사
        certificates: [], // 러브는 일반적으로 없음
        animals, //  러브는 동물 필수
    };
}

// 버디 카드 생성: 자격증/신뢰도 중심
export function createBuddyCard(user: User, certificates: Certificate[]): Card {
    return {
        ...user,
        cardKind: 'buddy',
        manner: 3,
        heart: 4,
        dearLove: 0,
        gender: '',
        bookmarks: [],
        bookings: [],
        reliability: 38, //  버디에서만 사용
        level: undefined,
        certificates, // 버디 배지
        animals: [], // 보통 없음 (lovuddy면 채워도 됨)
    };
}
