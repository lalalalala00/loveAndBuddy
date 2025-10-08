// import axios from "axios";
// import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
// import { ApiKey, BaseUrl } from "../auth/Auth.page";

// const MentionInput = ({
//   mentionIds,
//   setMentionIds,
// }: {
//   mentionIds: { name: string; id: number | null }[];
//   setMentionIds: Dispatch<SetStateAction<{ name: string; id: number | null }[]>>;
// }) => {
//   const mentionRefs = useRef<(HTMLButtonElement | null)[]>([]);

//   const [mentionInput, setMentionInput] = useState<string>("");
//   const [mentionTrigger, setMentionTrigger] = useState<boolean>(false);
//   const [mentionData, setMentionData] = useState<{ name: string; id: number | null }[]>([]);

//   const [focusedIndex, setFocusedIndex] = useState<number>(0);

//   const keyword = mentionInput.split("@").pop()?.toLowerCase() || "";

//   const filteredMention = mentionData.filter(
//     (user) => !mentionIds.some((m) => m.id === user.id) && user.name.toLowerCase().includes(keyword)
//   );

//   // const filteredMention = mentionData.filter(
//   //   (user) => !mentionIds.includes({ name: user.name, id: user.id! })
//   // );

//   useEffect(() => {
//     // const lastChar = mentionInput.slice(-1);
//     // setMentionTrigger(lastChar === "@");
//     setMentionTrigger(mentionInput.includes("@"));
//     setFocusedIndex(0);
//   }, [mentionInput]);

//   useEffect(() => {
//     const target = mentionRefs.current[focusedIndex];
//     if (target) {
//       target.scrollIntoView({
//         behavior: "smooth",
//         inline: "center",
//         block: "nearest",
//       });
//     }
//   }, [focusedIndex]);

//   useEffect(() => {
//     (async () => {
//       const res = await axios.get(`${BaseUrl}/users`, {
//         headers: {
//           "X-Api-Key": ApiKey,
//         },
//       });
//       setMentionData(
//         res.data.map((user: any) => ({
//           name: user.userName,
//           id: user.userId,
//         }))
//       );
//     })();
//   }, []);

//   const handleMentionClick = (user: { name: string; id: number | null }) => {
//     if (user.id == null) return;

//     const split = mentionInput.split("@");
//     split.pop();
//     const newInput = split.join("@") + `@${user.name} `;

//     setMentionInput(newInput);
//     setMentionTrigger(false);
//     setMentionIds((prev) => [...prev, { id: Number(user.id!), name: user.name }]);
//     setFocusedIndex(0);
//   };

//   useEffect(() => {
//     setMentionIds((prev) => [...prev.filter((m) => mentionInput.includes(m.name))]);
//   }, [mentionInput]);
//   console.log(focusedIndex);
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     // const keyword = mentionInput.split("@").pop()?.toLowerCase() || "";

//     // const filteredList = mentionData.filter(
//     //   (user) =>
//     //     !mentionIds.some((m) => m.id === user.id) &&
//     //     user.name.toLowerCase().includes(keyword)
//     // );

//     // if (!mentionTrigger || filteredMention.length === 0) return;

//     if (e.key === "ArrowDown" || e.key === "ArrowRight") {
//       e.preventDefault();
//       setFocusedIndex((prev) => (prev + 1) % filteredMention.length);
//     } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
//       e.preventDefault();
//       setFocusedIndex((prev) => (prev - 1 + filteredMention.length) % filteredMention.length);
//     } else if (e.key === "Enter") {
//       e.preventDefault();
//       handleMentionClick(filteredMention[focusedIndex]);
//     }
//   };

//   return (
//     <div className="relative border-b-2 borderBottom w-[400px]">
//       <input
//         type="text"
//         placeholder="@ 알림 대상 지정"
//         className="px-2 py-1 w-full"
//         value={mentionInput}
//         onChange={(e) => setMentionInput(e.target.value)}
//         onKeyDown={handleKeyDown}
//       />

//       {mentionTrigger && filteredMention.length > 0 && (
//         <div className="absolute top-10 left-0  h-[40px] w-[400px] overflow-x-scroll scrollbar-hide border bg-white flex justify-start items-center px-2">
//           {filteredMention
//             // .filter(
//             //   (user) =>
//             //     !mentionIds.some((item) => item.name === user.name)
//             // )
//             .map((item, i) => (
//               <button
//                 key={i}
//                 className={`w-full text-left px-3 py-2 hover:bg-gray-100 text-nowrap  ${
//                   i === focusedIndex ? "bg-gray-200" : ""
//                 }`}
//                 ref={(el) => {
//                   mentionRefs.current[i] = el;
//                 }}
//                 onClick={() => handleMentionClick(item)}
//               >
//                 @{item.name}
//               </button>
//             ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MentionInput;
