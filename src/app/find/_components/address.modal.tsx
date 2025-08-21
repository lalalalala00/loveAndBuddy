import { Dispatch, SetStateAction, useState } from 'react';
import dynamic from 'next/dynamic';
import { PrivacyNote } from '@/utils/comment';
const DaumPostcode = dynamic(() => import('react-daum-postcode'), { ssr: false });

export type AddrState = { postcode: string; address: string; detail: string };

const AddressModal = ({
    setAddrModal,
    setAddr,
    addr,
    addrError,
}: {
    setAddrModal: Dispatch<SetStateAction<boolean>>;
    addr: AddrState;
    setAddr: Dispatch<SetStateAction<AddrState>>;
    addrError: string;
}) => {
    const handleComplete = (data: any) => {
        const base = data.address as string;
        const zonecode = data.zonecode as string;
        const extra = [data.bname, data.buildingName].filter(Boolean).join(' ');
        const full = extra ? `${base} (${extra})` : base;

        setAddr((prev) => ({ ...prev, address: full, postcode: zonecode }));
    };

    return (
        <div className="p-2 space-y-3">
            <div className="rounded-xl overflow-hidden border border-[#e3ecdc] bg-white">
                <DaumPostcode
                    onComplete={handleComplete}
                    autoClose={false}
                    style={{ width: '100%', height: '360px' }}
                />
            </div>

            <div className="grid grid-cols-[90px_1fr] gap-2">
                <input
                    value={addr.postcode}
                    readOnly
                    className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white/70 text-[14px]"
                    placeholder="우편번호"
                />
                <input
                    value={addr.address}
                    readOnly
                    className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white/70 text-[14px]"
                    placeholder="기본주소"
                />
            </div>

            <input
                value={addr.detail}
                onChange={(e) => setAddr((prev) => ({ ...prev, detail: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="상세 주소(동/호수 등)"
            />

            <PrivacyNote variant="full" />

            {!!addrError && <p className="px-3 text-[12px] text-red-500">{addrError}</p>}
        </div>
    );
};

export default AddressModal;
