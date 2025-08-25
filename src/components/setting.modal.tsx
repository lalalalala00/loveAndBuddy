import AnimalSelectedForm, { animal } from '@/common/animal.select.form';
import ModalIos from '@/common/modal.ios';
import { useUserState } from '@/context/useUserContext';
import AnimalsForm, { AnimalForm, defaultAnimal } from './sign.animals.form';
import { useState } from 'react';
import AnimalCardVertical, { Animal } from '@/common/animal.card.vertical';

const SettingModal = ({ isOpen, handleModalState }: { isOpen: boolean; handleModalState: () => void }) => {
    const { userState } = useUserState();
    const [animalsForm, setAnimalsForm] = useState<AnimalForm[]>([defaultAnimal(true)]);

    const [draftAnimals, setDraftAnimals] = useState<Animal[]>(animal);

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
        <ModalIos
            isOpen={isOpen}
            handleModalState={handleModalState}
            title="정보 수정하기"
            width="590px"
            height="800px"
        >
            <div className="p-2 overflow-y-scroll no-scrollbar h-[685px]">
                <div className="p-2 rounded-xl shadow mb-3">
                    <div>
                        <input type="text" placeholder="nickname" />
                        <button>닉네임 변경하기</button>
                    </div>
                    <div>
                        <input type="file" placeholder="nickname" />
                        <button>닉네임 변경하기</button>
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
