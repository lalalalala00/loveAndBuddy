import NewLayout from './new.layout';
import NewLayout2 from './new.layout2';

const Index = () => {
    return (
        <div className="mt-5 mb-8 rounded-2xl bg-[#fefefe] border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]">
            {/* <div className="pt-20 mt-5 mb-8 rounded-2xl bg-[#fefefe] px-4 border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]"> */}
            <div className="flex justify-center">
                {/* <FilePage /> */}
                {/* <NewType /> */}
                <NewLayout />
                {/* <NewLayout2 /> */}
            </div>
        </div>
    );
};
export default Index;
