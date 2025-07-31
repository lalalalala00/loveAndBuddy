import { useState } from "react";

const PhotoModal = ({
  handleModalState,
  images,
  selectedIndex,
}: {
  handleModalState: () => void;
  images: { url: string }[];
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
        <img
          src={images[currentIndex].url}
          alt={`photo-${currentIndex}`}
          className="max-w-full max-h-full object-contain"
        />

        <button
          onClick={prevImage}
          className="absolute left-3 text-white text-3xl font-bold hover:scale-110 transition"
        >
          ‹
        </button>
        <button
          onClick={nextImage}
          className="absolute right-3 text-white text-3xl font-bold hover:scale-110 transition"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default PhotoModal;
