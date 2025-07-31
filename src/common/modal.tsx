import { Dispatch, SetStateAction } from "react";

const Modal = ({
  children,
  width,
  height,
  isOpen,
  handleModalState,
  title,
}: {
  children: React.ReactNode;
  width: string;
  height: string;
  isOpen: boolean;
  handleModalState: () => void;
  title: string;
}) => {
  return (
    isOpen && (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center z-99">
        <div className={`p-5 rounded-2xl bg-white`} style={{ width: width, height: height }}>
          <div className="flex items-center justify-between">
            <span>{title}</span>
            <button onClick={handleModalState}>X</button>
          </div>

          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
