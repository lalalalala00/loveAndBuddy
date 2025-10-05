'use client';

import { useEffect, useState } from 'react';
import AnimalSelect, { RepresentativePreview } from './animal.card.select';
import AnimalCardVertical from './animal.card.vertical';
import ModalIos from './modal.ios';
import { Animal } from '@/utils/sign';
import { useUserState } from '@/context/useUserContext';

const AnimalSelectedForm = ({
    dear,
    setSelectedAnimals,
}: {
    dear?: boolean;
    setSelectedAnimals?: Animal | undefined;
}) => {
    const { animals } = useUserState();
    const [addAnimal, setAddAnimal] = useState<boolean>(false);
    const [draftAnimals, setDraftAnimals] = useState<Animal[]>([]);

    const getRepresentative = (list: Animal[]) => list.find((v) => v.first) ?? list[0];

    const rep = getRepresentative(animals);
    const displayList = draftAnimals.length > 0 ? draftAnimals : rep ? [rep] : [];

    const handleDelete = (id: string) => {
        if (draftAnimals.length === 0) return;

        setDraftAnimals((prev) => {
            if (prev.length <= 1) return prev;

            const wasOwner = prev.find((a) => a.animal_uuid === id)?.first;
            const next = prev.filter((a) => a.animal_uuid !== id);

            if (next.length === 1) {
                if (!next[0].first) next[0] = { ...next[0], first: true };
                return next;
            }

            if (wasOwner || !next.some((a) => a.first)) {
                next[0] = { ...next[0], first: true };

                for (let i = 1; i < next.length; i++) {
                    if (next[i].first) next[i] = { ...next[i], first: false };
                }
            }

            return next;
        });
    };

    // useEffect(() => {
    //     if (!displayList) return;
    //     setSelectedAnimals(displayList);
    // }, [addAnimal]);

    return (
        <div>
            <div className="flex h-16 justify-between mb-3">
                {/* <RepresentativePreview items={displayList} selected={draftAnimals.length} /> */}
                {dear ? (
                    <div className="flex items-center gap-2 p-2 justify-center border-b border-[#e3ecdc] w-full">
                        -`♥´- dear.love_〘
                        {displayList.map((item, i) => (
                            <span key={i} className="text-[14px]">
                                {item.name}
                            </span>
                        ))}
                        〙 -`♥´-
                    </div>
                ) : (
                    <RepresentativePreview items={displayList} selected={draftAnimals.length} />
                )}
                <button
                    onClick={() => setAddAnimal(!addAnimal)}
                    className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-3 mb-3 p-1 h-full text-[14px] w-1/3 ml-3"
                >
                    <span>+ 반려동물 추가하기</span>
                </button>
            </div>

            <AnimalCardVertical initial={displayList} onDelete={handleDelete} />

            <ModalIos
                isOpen={addAnimal}
                handleModalState={() => setAddAnimal(!addAnimal)}
                title="반려동물 추가하기"
                width="400px"
                height="665px"
                leftComment="추가하기"
                leftAction={() => setAddAnimal(false)}
            >
                <div className="p-2">
                    <AnimalSelect initial={animals} onChange={setDraftAnimals} />
                </div>
            </ModalIos>
        </div>
    );
};

export const animal: Animal[] = [
    {
        owner_nickname: '116fdb30-7b2a-4314-b214-68f6e2bc7e46',
        owner_uuid: '바나나별',
        animal_uuid: '43ba3a63-bd9a-45e3-ba93-aa3e88ab6122',
        name: '샤넬',
        birth_year: 2012,
        level: '9',
        type: 'dog',
        variety: 'spitz',
        color: 'white',
        comment: '흙냄새 풀냄새 좋아해요! 나가면 신나게 뛰어놀아요!',
        first: true,
        img: '/cha/1_10.png',
        personality: 'introvert',
    },
    {
        owner_nickname: '116fdb30-7b2a-4314-b214-68f6e2bc7e46',
        owner_uuid: '바나나별',
        animal_uuid: '5eedb3d1-81bb-4e21-b463-6198fc7fc8e5',
        name: '돌멩',
        birth_year: 2018,
        level: '3',
        type: 'cat',
        variety: 'koreanShortHair',
        color: 'cow',
        comment: '마따따비를 가져오거라.',
        first: false,
        img: '/love/meng.png',
        personality: 'extrovert',
    },
    {
        owner_nickname: '116fdb30-7b2a-4314-b214-68f6e2bc7e46',
        owner_uuid: '바나나별',
        animal_uuid: '343bc9b3-fdb8-49ed-bce8-797fa53db319',
        name: '룽지',
        birth_year: 2025,
        level: '1',
        type: 'cat',
        variety: 'BritishShorthair',
        color: 'cheeze',
        comment: '츄르를 내노라냥 ~',
        first: false,
        img: '/love/rungji.jpeg',
        personality: 'extrovert',
    },
    {
        owner_nickname: '116fdb30-7b2a-4314-b214-68f6e2bc7e46',
        owner_uuid: '바나나별',
        animal_uuid: '710ef146-8cf9-4799-b290-aac257be80c5',
        name: '도도',
        birth_year: 2025,
        level: '2',
        type: 'cat',
        variety: 'AmericanShorthair',
        color: 'black&sliver',
        comment: '안녕 나는 도도냥! 완전 개냥이다냥',
        first: false,
        img: '/love/IMG_1659.JPG',
        personality: 'extrovert',
    },
];

export default AnimalSelectedForm;
