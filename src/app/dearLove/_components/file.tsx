const File = ({ comment, selectedMonth }: { comment: string; selectedMonth: string }) => {
    return (
        <div className="flex flex-col items-center space-y-2 m-3 ">
            <div
                className="w-20 h-14 bg-sky-300 shadow-2xl relative rounded-lg "
                style={{
                    clipPath: 'polygon(0 0, 55% 0, 60% 10%, 100% 10%, 100% 100%, 0 100%)',
                }}
            />
            <span
                className={`text-[12px] px-2 rounded-md py-0.5 font-semibold text-gray-700 text-nowrap ${selectedMonth === comment ? 'bg-sky-600 text-white' : ' '} `}
            >
                {comment} [2]
            </span>
        </div>
    );
};

export default File;
