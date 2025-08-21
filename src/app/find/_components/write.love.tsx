'use client';

import AnimalCards, { RepresentativePreview } from '@/common/animal.card.select';
import AnimalCardVertical, { Animal } from '@/common/animal.card.vertical';
import ModalIos from '@/common/modal.ios';
import NameTag from '@/common/name.tag';
import SelectedPlace from '@/common/selected.place';

import { SetStateAction, useState } from 'react';
import AddressModal, { AddrState } from './address.modal';
import { PrivacyNote } from '@/utils/comment';
import Tooltip from '@/common/tooltip';

function cx(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(' ');
}

const WriteLove = () => {
    const [saveBase, setSaveBase] = useState<boolean>(false);
    const [loveComment, setLoveComment] = useState<string>('');

    const [location, setLocation] = useState<number>(0);

    const [addrModal, setAddrModal] = useState<boolean>(false);
    const [addAddress, setAddAddress] = useState<string>('');
    const [addrError, setAddrError] = useState<string>('');
    const [addr, setAddr] = useState<AddrState>({ postcode: '', address: '', detail: '' });

    const [addAnimal, setAddAnimal] = useState<boolean>(false);
    const [draftAnimals, setDraftAnimals] = useState<Animal[]>([]);

    const hasAddr = Boolean(addr.address && addr.detail);

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

    const confirmAdd = () => {
        setAddAnimal(false);
    };

    const saveAddress = () => {
        if (!addr.address) return setAddrError('주소를 검색해 주세요.');
        if (!addr.detail.trim()) return setAddrError('상세 주소를 입력해 주세요.');
        setAddrModal(false);
    };

    const openAddr = () => {
        setAddrModal(true);
    };

    return (
        <div className="flex h-full justify-between items-center flex-col mt-5 mb-8 pb-10 rounded-2xl bg-[#fefefe] border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]">
            <div className="flex items-center w-full rounded-t-2xl">
                <NameTag love asap small />
            </div>
            <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-1" />
            <div className="flex flex-col items-center w-full justify-between mt-6">
                <div className="flex flex-col w-1/2">
                    <div className="flex h-16 justify-between mb-2">
                        <RepresentativePreview items={displayList} selected={draftAnimals.length} />
                        <button
                            onClick={() => setAddAnimal(!addAnimal)}
                            className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-3 mb-3 p-1 h-full text-[14px] w-1/3 ml-3"
                        >
                            <span>+ 반려동물 추가하기</span>
                        </button>
                    </div>

                    <AnimalCardVertical initial={displayList} onDelete={handleDelete} />

                    <div className="h-[60px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] flex items-center">
                        <SelectedPlace />
                    </div>
                    <div className="h-full shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] flex flex-col">
                        <span>❀ 장소</span>
                        <div className="flex mt-3 px-2 items-center justify-between">
                            <div className="flex">
                                {locationList.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setLocation(item.value)}
                                        className={`${item.value === location ? 'custom-card shadow' : 'border border-gray-200'} px-4 py-2 bg-white mr-3 last:mr-0 rounded-xl flex justify-center items-center  text-[14px]`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setAddrModal(!addrModal)}
                                className={`${addr.address ? 'custom-card' : 'border-2 border-dashed border-gray-300 bg-white'} text-[14px]  rounded-xl px-3 py-2 h-full `}
                            >
                                {hasAddr ? `ꤶ 주소 수정하기` : `+ 주소 추가하기`}
                            </button>
                        </div>

                        {addr.address ? (
                            <div className="px-2 mt-3 text-[12px] text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Tooltip comment="🔒" tooltip="매칭 확정 후 시터에게만 공유됩니다." />
                                    <span className="inline-flex px-2 py-0.5 rounded-lg bg-white/70 border border-[#e3ecdc]">
                                        {addr.postcode}
                                    </span>
                                    <span className="truncate">{addr.address}</span>
                                    <span className="truncate">• {addr.detail}</span>
                                </div>
                            </div>
                        ) : (
                            <PrivacyNote variant="short" />
                        )}
                    </div>
                    <div className="h-[130px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] flex flex-col">
                        <span>❀ 00의 한마디 -`♡´-</span>
                        <textarea
                            className="w-full h-[100px] bg-white rounded-xl shadow mt-2 border-0 resize-none p-2 focus:outline-0 px-3"
                            onChange={(e) => setLoveComment(e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-1/2 mt-8">
                    <button
                        onClick={() => setSaveBase(!saveBase)}
                        className="mb-2 flex justify-end items-center w-full cursor-pointer"
                    >
                        <div className={`w-3 h-3 border rounded-sm mr-1 mb-0.5 ${saveBase ? 'bg-gray-400' : ''}`}></div>
                        <span className="text-[14px]">기본 정보로 저장하기</span>
                    </button>
                    <button className="custom-card w-full h-12 rounded-2xl custom-card-hover cursor-pointer">
                        등록하기
                    </button>
                </div>
            </div>
            <ModalIos
                isOpen={addAnimal}
                handleModalState={() => setAddAnimal(!addAnimal)}
                title="반려동물 추가하기"
                width="400px"
                height="50%"
                leftComment="추가하기"
                leftAction={confirmAdd}
            >
                <div className="p-2">
                    <AnimalCards initial={animal} onChange={setDraftAnimals} />
                </div>
            </ModalIos>

            <ModalIos
                isOpen={addrModal}
                handleModalState={() => setAddrModal(false)}
                title="주소 추가하기"
                width="420px"
                height="60%"
                leftComment="저장하기"
                leftAction={saveAddress}
            >
                <AddressModal setAddrModal={setAddrModal} addr={addr} setAddr={setAddr} addrError={addrError} />
            </ModalIos>
        </div>
    );
};

export default WriteLove;

const locationList = [
    { label: '집', value: 0 },
    { label: '애견카페', value: 1 },
    { label: '공원', value: 2 },
    { label: '위탁', value: 3 },
    { label: '직접 입력', value: 4 },
];

const animal: Animal[] = [
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

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" {...props}>
        <path strokeWidth="2" strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" {...props}>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
    </svg>
);
