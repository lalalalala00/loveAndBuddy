import { BuddyLite, DearLove } from '@/utils/data';

const FileNameBox = ({
    bgImg,
    textColor,
    dearLove,
    currentBuddy,
}: {
    bgImg: string;
    textColor: string;
    dearLove: DearLove;
    currentBuddy: BuddyLite;
}) => {
    return (
        <div
            className="relative flex flex-col justify-between p-4 rounded-xl shadow-inner h-[260px] border-2 border-gray-300 "
            style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover' }}
        >
            <div className="absolute top-0 left-0 w-full h-full bg-white/40 z-1" />
            <div className="flex flex-col items-start gap-1 z-2">
                <span
                    className="text-2xl font-semibold tracking-wide uppercase"
                    style={{ color: textColor ? textColor : '#111' }}
                >
                    {dearLove?.weather}
                </span>
                <div className="flex items-end">
                    <h4 className="text-2xl font-bold" style={{ color: textColor ? textColor : '#101828' }}>
                        Monday
                    </h4>
                    <span className="ml-2 text-sm" style={{ color: textColor ? textColor : '#111' }}>
                        ⪩July 14, 2025⪨
                    </span>
                </div>

                <h6 className="text-sm font-medium" style={{ color: textColor ? textColor : '#101828' }}>
                    ⏱ ̗̀ 16:00 =͟͟͞ ♡̩͙꙳ 19:00 ˎˊ
                </h6>
                <span className="text-sm font-medium" style={{ color: textColor ? textColor : '#111' }}>
                    Buddy_ᬏ᭄꙳⸌ <span className="font-semibold">{currentBuddy?.name}</span> ⛧*̩̩͙⸝⋆
                </span>
            </div>
            <div className="mt-2 flex flex-col z-2">
                <span
                    className="text-[14px] font-semibold line-clamp-3 text-center"
                    style={{ color: textColor ? textColor : '#111' }}
                >
                    {dearLove?.title}
                </span>
                <span className="text-[10px] text-nowrap flex justify-center">
                    *･☪·̩͙ ⋰˚☆⋰˚★⋰˚☆⋰˚★⋰˚☆⋰˚★⋰˚☆⋰˚★ ·̩͙☪･*
                </span>
            </div>
        </div>
    );
};
const weather = [
    { label: '☀◝✩', value: 'sunny' },
    { label: '☃︎❄☃', value: 'snow' },
    { label: '☁︎᭝☁︎', value: 'cloud' },
    { label: '*☂︎*̣̩⋆', value: 'rain' },
    { label: '˗ˋˏϟˎˊ˗', value: 'thunder' },
];

export default FileNameBox;
