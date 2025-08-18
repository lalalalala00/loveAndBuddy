'use client';

import { Dispatch, SetStateAction } from 'react';

const ModalIos = ({
    children,
    width,
    height,
    isOpen,
    handleModalState,
    title,
    leftComment,
    leftAction,
}: {
    children: React.ReactNode;
    width: string;
    height: string;
    isOpen: boolean;
    handleModalState: () => void;
    title: string;
    leftComment?: string;
    leftAction?: () => void;
}) => {
    console.log(leftAction);
    return (
        isOpen && (
            <div className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-[2px] flex justify-center items-center">
                <div
                    className={`bg-white rounded-3xl shadow-2xl flex flex-col justify-between`}
                    style={{ width, height }}
                >
                    <div>
                        {title && (
                            <div className="text-center px-6 py-4 border-b border-gray-200 text-[15px] font-semibold text-gray-700">
                                ᧔o᧓ {title} ᧔o᧓
                            </div>
                        )}

                        <div className="h-full">{children}</div>
                    </div>
                    <div className="flex border-t border-gray-200">
                        {!leftAction ? (
                            <button
                                onClick={handleModalState}
                                className="w-full py-4 text-[15px] font-medium hover:bg-gray-100 hover:rounded-b-3xl"
                            >
                                Close ♥ ັ
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleModalState}
                                    className="w-1/2 py-4 text-[15px] font-medium hover:bg-gray-100 hover:rounded-bl-3xl"
                                >
                                    Close ♥ ັ
                                </button>
                                <button
                                    onClick={leftAction}
                                    className="w-1/2 py-4 text-[15px] font-semibold text-[#5b7551] border-l border-gray-200 hover:bg-gray-100 hover:rounded-br-3xl"
                                >
                                    {leftComment}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default ModalIos;
