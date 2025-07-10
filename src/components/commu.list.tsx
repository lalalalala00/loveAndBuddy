const CommunityList = ({
  setSelectedClose,
}: {
  setSelectedClose: (value: string) => void;
}) => {
  return (
    <div className="w-[422px] border">
      <button
        onClick={() => setSelectedClose("comm")}
        className="h-[14px] w-[14px] rounded-full bg-red-500 flex justify-center items-center cursor-pointer"
      >
        <span className="text-[12px]">X</span>
      </button>

      <h1>commu list</h1>
    </div>
  );
};

export default CommunityList;
