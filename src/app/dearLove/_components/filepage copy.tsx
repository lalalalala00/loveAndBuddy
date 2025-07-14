import Image from "next/image"
import File from "./file"

const FilePage = () => {

    return(
        <div className="flex w-full">
            <div className="w-1/5 flex flex-col mr-4 border-r-6 border-black">
                <div className="mb-2 flex justify-end w-full px-3">
                    <button className="px-2">2024</button>
                    <button className="px-2">2025</button>
                </div>
                <div className="overflow-scroll h-[600px] flex flex-col">
                   {months.map((month) => (
                        <File key={month} comment={month} />
                    ))}
                </div> 
            </div>
            <div className="w-4/5">
                <div className="grid grid-cols-3 gap-1">
                          {[
                            "/cha/1.png",
                            "/cha/2.jpg",
                            "/cha/3.jpg",
                            "/cha/1.png",
                            "/cha/2.jpg",
                            "/cha/3.jpg",
                            "/cha/1.png",
                            "/cha/2.jpg",
                            "/cha/3.jpg",
                          ].map((src, idx) => (
                            <div key={idx} className="w-full h-[300px] overflow-hidden">
                              <Image
                                src={src}
                                width={600}
                                height={600}
                                alt={`photo-${idx}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                    
                   
            </div>

        </div>
    )
}
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default FilePage