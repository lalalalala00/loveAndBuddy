import AnimalSelectedForm, { animal } from '@/common/animal.select.form';
import ModalIos from '@/common/modal.ios';
import { useUserState } from '@/context/useUserContext';
import AnimalsForm, { AnimalForm, defaultAnimal } from './sign.animals.form';
import { useState } from 'react';
import AnimalCardVertical, { Animal } from '@/common/animal.card.vertical';
import Tooltip from '@/common/tooltip';
import { getMannerEmoji } from '@/common/buddy.name.tag';

const SettingModal = ({ isOpen, handleModalState }: { isOpen: boolean; handleModalState: () => void }) => {
    const { userState } = useUserState();
    const [animalsForm, setAnimalsForm] = useState<AnimalForm[]>([defaultAnimal(true)]);

    const [draftAnimals, setDraftAnimals] = useState<Animal[]>(animal);

    const [profilePreview, setProfilePreview] = useState<string>(''); // 미리보기
    const [profileFile, setProfileFile] = useState<File | null>(null);

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

    const onSelectProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProfileFile(file);
        const reader = new FileReader();
        reader.onload = () => setProfilePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const clearProfile = () => {
        setProfileFile(null);
        setProfilePreview('');
        // setV((prev) => ({ ...prev, profileImg: '' }));
    };

    return (
        <ModalIos
            isOpen={isOpen}
            handleModalState={handleModalState}
            title="정보 수정하기"
            width="590px"
            height="800px"
        >
            <div className="p-2 overflow-y-scroll no-scrollbar h-[685px]">
                <div className="p-2 rounded-xl shadow mb-3 flex">
                    <div className="flex flex-col items-center justify-end  w-1/3 bg-[#f3f7ee] border border-[#e3ecdc] rounded-xl p-2">
                        <div className="flex items-center justify-center gap-3 flex-col ">
                            {profilePreview || animalsForm?.avatar_url ? (
                                <Tooltip
                                    comment={
                                        <div className="w-24 h-24 rounded-full overflow-hidden border border-[#e3ecdc] bg-white shadow-inner">
                                            <img
                                                src={profilePreview || animalsForm?.avatar_url}
                                                alt="profile"
                                                className="w-full h-full object-cover cursor-pointer hover:opacity-40 hover:border hover:border-red-400"
                                                onClick={clearProfile}
                                            />
                                        </div>
                                    }
                                    tooltip="삭제"
                                />
                            ) : (
                                <></>
                            )}

                            <div className="flex gap-1 justify-end">
                                <label
                                    className="px-3 py-2 rounded-xl border-2 border-dashed border-gray-200 h-full bg-white shadow 
                          cursor-pointer text-[13px]"
                                >
                                    + 프로필 이미지 선택
                                    <input type="file" accept="image/*" className="hidden" onChange={onSelectProfile} />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between w-2/3 bg-[#f3f7ee] border border-[#e3ecdc] rounded-xl p-2 ml-2">
                        <div className="px-2 flex">
                            <p className="text-[12px] text-gray-600">
                                ꯁꯧ 마음: <span className="font-medium">3</span>
                            </p>
                            <p className="text-[12px] text-gray-600 mx-3">
                                {getMannerEmoji(4)} 매너 점수: <span className="font-medium">8 점</span>
                            </p>
                            <p className="text-[12px] text-gray-600">
                                ✎ꪑ 디얼 러브: <span className="font-medium">34 장</span>
                            </p>
                        </div>
                        <div className="flex items-end w-full">
                            <input
                                type="text"
                                placeholder="닉네임 7자리"
                                className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner text-[14px] w-2/3"
                            />
                            <button className="text-[12px] ml-2 custom-card p-2 rounded-xl w-1/3">
                                닉네임 변경하기
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-2 rounded-xl shadow">
                    {userState.includes('lo') && (
                        <div>
                            <AnimalCardVertical initial={draftAnimals} onDelete={handleDelete} />
                            <AnimalsForm value={animalsForm} onChange={setAnimalsForm} maxCount={5} className="mt-4" />
                        </div>
                    )}
                </div>
            </div>
        </ModalIos>
    );
};

export default SettingModal;
