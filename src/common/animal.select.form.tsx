'use client';

import { useState } from 'react';
import AnimalSelect, { RepresentativePreview } from './animal.card.select';
import AnimalCardVertical, { Animal } from './animal.card.vertical';
import ModalIos from './modal.ios';

const AnimalSelectedForm = ({ dear }: { dear?: boolean }) => {
    const [addAnimal, setAddAnimal] = useState<boolean>(false);
    const [draftAnimals, setDraftAnimals] = useState<Animal[]>([]);

    const getRepresentative = (list: Animal[]) => list.find((v) => v.owner) ?? list[0];

    const rep = getRepresentative(animal);
    const displayList = draftAnimals.length > 0 ? draftAnimals : rep ? [rep] : [];

    const handleDelete = (id: string) => {
        if (draftAnimals.length === 0) return;

        setDraftAnimals((prev) => {
            if (prev.length <= 1) return prev;

            const wasOwner = prev.find((a) => a.animalId === id)?.owner;
            const next = prev.filter((a) => a.animalId !== id);

            if (next.length === 1) {
                if (!next[0].owner) next[0] = { ...next[0], owner: true };
                return next;
            }

            if (wasOwner || !next.some((a) => a.owner)) {
                next[0] = { ...next[0], owner: true };

                for (let i = 1; i < next.length; i++) {
                    if (next[i].owner) next[i] = { ...next[i], owner: false };
                }
            }

            return next;
        });
    };
    return (
        <div>
            <div className="flex h-16 justify-between mb-2">
                {/* <RepresentativePreview items={displayList} selected={draftAnimals.length} /> */}
                {dear ? (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-[#e3ecdc] w-full">
                        {displayList.map((item, i) => (
                            <span key={i} className="text-[14px]">
                                {item.name}
                            </span>
                        ))}
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
                height="50%"
                leftComment="추가하기"
                leftAction={() => setAddAnimal(false)}
            >
                <div className="p-2">
                    <AnimalSelect initial={animal} onChange={setDraftAnimals} />
                </div>
            </ModalIos>
        </div>
    );
};

export const animal: Animal[] = [
    {
        ownerNickname: '',
        ownerId: '',
        animalId: '1',
        name: '샤넬',
        age: 12,
        level: 9,
        type: 'dog',
        variety: 'spitz',
        color: 'white',
        comment: '흙냄새 풀냄새 좋아해요! 나가면 신나게 뛰어놀아요!',
        owner: true,
        img: '/cha/1_10.png',
        personality: 'introvert',
    },
    {
        ownerNickname: '',
        ownerId: '',
        animalId: '2',
        name: '돌멩',
        age: 6,
        level: 3,
        type: 'cat',
        variety: 'koreanShortHair',
        color: 'cow',
        comment: '마따따비를 가져오거라.',
        owner: false,
        img: '/love/meng.png',
        personality: 'extrovert',
    },
    {
        ownerNickname: '',
        ownerId: '',
        animalId: '3',
        name: '룽지',
        age: 1,
        level: 1,
        type: 'cat',
        variety: 'BritishShorthair',
        color: 'cheeze',
        comment: '츄르를 내노라냥 ~',
        owner: false,
        img: '/love/rungji.jpeg',
        personality: 'extrovert',
    },
    {
        ownerNickname: '',
        ownerId: '',
        animalId: '4',
        name: '도도',
        age: 1,
        level: 2,
        type: 'cat',
        variety: 'AmericanShorthair',
        color: 'black&sliver',
        comment: '안녕 나는 도도냥! 완전 개냥이다냥',
        owner: false,
        img: '/love/IMG_1659.JPG',
        personality: 'extrovert',
    },
];

export default AnimalSelectedForm;
