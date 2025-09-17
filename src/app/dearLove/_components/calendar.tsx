import { months } from './filepage';

export default function Calendar() {
    return (
        <div className="grid grid-cols-3 w-full gap-1">
            {months.map((item, i) => (
                <button
                    key={i}
                    className="w-full border border-gray-300  h-20 rounded-xl flex items-center justify-center"
                >
                    <span className="text-2xl font-bold">{i + 1}</span>
                </button>
            ))}
        </div>
    );
}
