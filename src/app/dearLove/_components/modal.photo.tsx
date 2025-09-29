import { useState } from 'react';

const PhotoModal = ({
    handleModalState,
    images,
    selectedIndex,
}: {
    handleModalState: () => void;
    images: string[];
    selectedIndex: number | null;
}) => {
    if (!selectedIndex) return;
    const [currentIndex, setCurrentIndex] = useState<number>(selectedIndex);

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="">
            <div className="relative overflow-hidden">
                <div className="flex justify-center">
                    <img
                        src={images[currentIndex]}
                        alt={`photo-${currentIndex}`}
                        className="max-w-full max-h-full h-[690px] object-contain"
                    />
                </div>

                <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 text-4xl font-bold hover:scale-110 transition cursor-pointer"
                >
                    ‹
                </button>
                <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2  text-4xl font-bold hover:scale-110 transition cursor-pointer"
                >
                    ›
                </button>
            </div>
        </div>
    );
};

export default PhotoModal;
