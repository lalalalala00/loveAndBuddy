'use client';

import { useEffect, useState } from 'react';

const WriteIndex = ({ setSelectedClose }: { setSelectedClose: (value: string) => void }) => {
    const [empty, setEmpty] = useState(true);
    const [imgs, setImgs] = useState<File[]>([]);
    const [content, setContent] = useState<string>('');
    const [limitNumber, setLimitNumber] = useState<boolean>(false);

    const handleImgs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        setImgs(fileArray);
    };

    const handleImgDel = (i: number) => {
        const newImgs = [...imgs];
        newImgs.splice(i, 1);
        setImgs(newImgs);
    };

    const handlePost = () => {
        const payload = {
            imgs,
            content,
        };
    };

    useEffect(() => {
        return () => {
            imgs.forEach((img) => URL.revokeObjectURL(img as unknown as string));
        };
    }, [imgs]);
    console.log(content);
    return (
        <div className="w-[400px]">
            <button
                onClick={() => setSelectedClose('write')}
                className="h-[14px] w-[14px] rounded-full bg-red-500 flex justify-center items-center cursor-pointer"
            ></button>
            <div
                className={`border rounded-2xl w-full flex flex-col justify-between p-1 ${
                    imgs.length > 0 ? 'h-[180px]' : 'h-[120px]'
                }`}
            >
                <div className="relative">
                    <div className="flex">
                        {imgs.map((img, i) => (
                            <div key={i}>
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt="preview"
                                    className="w-20 h-20 object-cover mr-2"
                                />
                                <button onClick={() => handleImgDel(i)}>x</button>
                            </div>
                        ))}
                    </div>

                    <div
                        className="w-full h-[85px] p-3 outline-none overflow-scroll"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => {
                            const target = e.currentTarget as HTMLElement;
                            const text = target.innerText;

                            if (text.length > 10) {
                                target.innerText = content;

                                const selection = window.getSelection();
                                const range = document.createRange();
                                range.selectNodeContents(target);
                                range.collapse(false);
                                if (selection) {
                                    selection.removeAllRanges();
                                    selection.addRange(range);
                                }

                                setLimitNumber(true);
                            } else {
                                setLimitNumber(false);
                                setContent(text);
                            }

                            setEmpty(text.trim() === '');
                        }}
                    ></div>
                    {empty && (
                        <span className=" text-gray-400 pointer-events-none select-none">
                            샤네루와의 하루를 적어주세요!
                        </span>
                    )}
                    <div className="border w-full h-[20px] flex justify-between">
                        <input type="file" multiple accept="image/*" onChange={handleImgs} />
                        <div>
                            <span className={`${limitNumber ? 'text-red-600' : ''}`}>{content.length} / 10</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WriteIndex;
