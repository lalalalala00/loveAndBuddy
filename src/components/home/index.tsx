import BuddyConnect from "../buddy.connect";
import CommunityList from "../commu.list";
import WriteIndex from "../commu.write.index";
import Calendar from "./calendar";

const Index = () => {
  return (
    <div className="border">
      <div className="flex justify-between">
        <div className="">
          <Calendar />
          <BuddyConnect />
        </div>

        <div className="w-1/3">
          <CommunityList />
          <WriteIndex />
        </div>
      </div>
    </div>
  );
};

export default Index;
