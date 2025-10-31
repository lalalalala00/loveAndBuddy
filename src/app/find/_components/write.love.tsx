'use client';

import ModalIos from '@/common/modal.ios';
import NameTag, { NameTagInfoMinimal } from '@/common/name.tag';
import SelectedPlace from '@/common/selected.place';
import { Animal } from '@/utils/sign';

import { useEffect, useState } from 'react';
import AddressModal, { AddrState } from './address.modal';
import { PrivacyNote } from '@/utils/comment';
import Tooltip from '@/common/tooltip';
import AnimalSelectedForm from '@/common/animal.select.form';
import { useUserState } from '@/context/useUserContext';
import { Option } from '@/common/selected.box';
import { useRouter } from 'next/navigation';
import { CenterToast } from '@/app/dearLove/_components/write.love';

const WriteLove = () => {
    const router = useRouter();
    const { getUser } = useUserState();
    const [saveBase, setSaveBase] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loveComment, setLoveComment] = useState<string>('');

    const [locationType, setLocationType] = useState<number>(0);

    const [addrModal, setAddrModal] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [addAddress, setAddAddress] = useState<string>('');
    const [addrError, setAddrError] = useState<string>('');
    const [addr, setAddr] = useState<AddrState>({ postcode: '', address: '', detail: '' });
    const [selectedAnimals, setSelectedAnimals] = useState<Animal[] | undefined>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [location, setLocation] = useState<Option[]>([]);
    const [toastOpen, setToastOpen] = useState(false);

    useEffect(() => {
        if (!toastOpen) return;
        const t = setTimeout(() => router.push('/find?type=love'), 1000);
        return () => clearTimeout(t);
    }, [toastOpen, router]);

    const hasAddr = Boolean(addr.address && addr.detail);

    const saveAddress = () => {
        if (!addr.address) return setAddrError('주소를 검색해 주세요.');
        if (!addr.detail.trim()) return setAddrError('상세 주소를 입력해 주세요.');
        setAddrModal(false);
    };

    return (
        <div className="flex h-full justify-between items-center flex-col mt-5 mb-8 pb-10 rounded-2xl bg-[#fefefe] border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]">
            <div className="flex items-center w-full rounded-t-2xl">
                <NameTag love asap small user info={getUser as unknown as NameTagInfoMinimal} />
            </div>
            <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-1" />
            <div className="flex flex-col items-center w-full justify-between mt-6">
                <div className="flex flex-col w-1/2">
                    <AnimalSelectedForm setSelectedAnimals={setSelectedAnimals} />
                    <div className="h-[60px] rounded-xl p-3 mb-3  border-[#e3ecdc] border  hover:bg-[#f5f7ee81] bg-white transition flex items-center">
                        <SelectedPlace setLocation={setLocation} />
                    </div>
                    <div className="h-full shadow rounded-xl p-3 mb-3  flex flex-col bg-[#f5f7ee81]">
                        <span>❀ 장소</span>
                        <div className="bg-white rounded-xl">
                            <div className="flex mt-3 px-2 items-center justify-between ">
                                <div className="flex">
                                    {locationList.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setLocationType(item.value)}
                                            className={`${item.value === locationType ? 'custom-card shadow' : 'border border-gray-200'} px-4 py-2 bg-white mr-3 last:mr-0 rounded-xl flex justify-center items-center  text-[14px]`}
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
                    </div>
                    <div className="h-[130px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] flex flex-col">
                        <span>
                            ❀ {/* {selectedAnimals?.map((item) => item.name).join(', ')} */}
                            러브의 한마디 -`♡´-
                        </span>
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
                    <button
                        onClick={() => setToastOpen(true)}
                        className="custom-card w-full h-12 rounded-2xl custom-card-hover cursor-pointer"
                    >
                        등록하기
                    </button>
                </div>
            </div>

            <CenterToast open={toastOpen} comment="" />

            <ModalIos
                isOpen={addrModal}
                handleModalState={() => setAddrModal(false)}
                title="주소 추가하기"
                width="420px"
                height="650px"
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
    { label: '그 외', value: 4 },
];
