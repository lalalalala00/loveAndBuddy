'use client'

const Diary = () =>{
    return(
        <div className="w-[500px]">
            <div className="border-t-2 border-b-2 border-black flex justify-between items-center">
                    <div className="flex items-end">
                        <span className="text-[12px] mr-2">date_</span>
                        <span className="text-[14px]">Monday, July 14, 2025</span>
                    </div>
                    <div className="flex items-end">
                        <span className="text-[12px]">weather_</span>
                        <span className="text-[14px]">Sunny</span>
                    </div>
            </div>
              <div className="flex items-center">
                    <span className="text-[12px]">time_</span>
                    <span>00:00 ~ 00:00</span>
                </div>
                <div className="h-[400px] border">
                   img
                </div>
                <div className="flex flex-col">
                    <span>title:</span>
                    <div>
                        <span>comment</span>
                    </div>
                    
                </div>
         
        </div>

    )
}

export default Diary