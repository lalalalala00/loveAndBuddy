const CommunityList = ({ setSelectedClose }: { setSelectedClose: (value: string) => void }) => {
  return (
    <div className="w-[400px] h-full">
      <button
        onClick={() => setSelectedClose("comm")}
        className="h-[14px] w-[14px] rounded-full bg-red-500 flex justify-center items-center cursor-pointer"
      ></button>
      <div>
        asdf
        <button>asdf
        </button>
      </div>

      <h1>commu list</h1>
    </div>
  );
};

export default CommunityList;
