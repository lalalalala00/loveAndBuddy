const File = ({ comment }: { comment: string }) => {
  return (
    <div className="flex flex-col items-center space-y-2 m-3">
      <div
        className="w-24 h-16 bg-sky-300 shadow-md relative rounded-lg"
        style={{
          clipPath: "polygon(0 0, 55% 0, 60% 10%, 100% 10%, 100% 100%, 0 100%)",
        }}
      />
      <span className="text-[12px] font-semibold text-gray-700 ">{comment} [2]</span>
    </div>
  );
};

export default File;
