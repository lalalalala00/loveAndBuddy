import { Chip } from '@/common/animal.card.select';
import ModalIos from '@/common/modal.ios';
import NameTag from '@/common/name.tag';
import { getAgeFromYear } from '@/utils/date';
import { Animal, LoveGroupCard } from '@/utils/sign';
import { OwnerGroup } from './data/love.helpers';

const LoveList = ({ list }: { list: LoveGroupCard }) => {
    return (
        <div className="rounded-2xl w-full h-auto shadow">
            <div className="flex flex-col items-center bg-[rgb(246,246,246)] border-b border-[rgb(227,227,227)] rounded-t-2xl">
                <NameTag imgCss="w-[60px] h-[60px]" love info={list} />
            </div>
            <div className="p-2 flex flex-col gap-2 min-h-[120px] overflow-visible ">
                <div className="flex px-2 py-1 rounded-lg bg-gradient-to-b from-[#faf8ee] to-transparent">
                    <div className={`flex ${list.animals.length > 1 ? '-space-x-3' : ''} `}>
                        {list.animals.map((item) => (
                            <div key={item.animal_uuid} className="flex  items-center">
                                <div className="relative">
                                    <img
                                        src={item.img}
                                        alt={`${item.name} 사진`}
                                        className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white z-1  rounded-lg text-[11px] text-nowrap">
                                        <Chip>{item.name}</Chip>
                                    </span>
                                </div>

                                {list.animals.length === 1 && (
                                    <div className="flex flex-wrap gap-1.5 text-[11px] h-2 ml-3 mb-4">
                                        <Chip>{getAgeFromYear(item.birth_year)}살</Chip>
                                        <Chip>{item.color}</Chip>
                                        <Chip>{item.personality === 'extrovert' ? '🌼 외향적' : '🌙 내향적'}</Chip>{' '}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={`${list.animals.length >= 2 && 'flex-1 min-w-[160px] overflow-x-auto'}`}>
                        {list.animals.map((item) => (
                            <div key={item.animal_uuid} className="flex ml-2">
                                {list.animals.length >= 2 && (
                                    <div className="mt-[1px] flex flex-wrap gap-1 text-[11px]">
                                        <Chip>{getAgeFromYear(item.birth_year)}살</Chip>
                                        <Chip>{item.animal_type}</Chip>
                                        <Chip>{item.personality === 'extrovert' ? '🌼 외향적' : '🌙 내향적'}</Chip>{' '}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col text-[13px] items-start w-full px-1 mt-2">
                    <div className="flex justify-between w-full items-center">
                        <span>🕒 시간 </span>
                        <span className="font-medium">
                            {list.date}_{list?.start_time} ~ {list?.end_time}
                        </span>
                    </div>

                    <div className="flex justify-between w-full items-center">
                        <span>📍 동네</span>
                        <span className="font-medium">{list?.location}</span>
                    </div>
                    <div className="flex justify-between w-full items-center">
                        <span>🏠 장소</span>
                        <span className="font-medium">{list?.place}</span>
                    </div>

                    <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-1" />
                    <span className="text-gray-800">
                        🐾 {list?.animals.map((item) => item.name).join(', ')}의 한마디
                    </span>
                    <span className="ml-3 font-semibold">{list?.animals[0]?.comment} ❣</span>
                </div>

                <button className={`btn-card custom-card w-full rounded-lg py-2  text-[14px] cursor-pointer`}>
                    대화하기
                </button>
            </div>
        </div>
    );
};

export default LoveList;
