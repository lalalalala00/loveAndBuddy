// import { useMemo, useState } from 'react';

// const filterPresets = {
//     none: '',
//     vintageSoft: 'brightness(1.1) blur(2px) contrast(0.85) sepia(0.15)',
//     dreamyWhite: 'brightness(1.3) blur(3px) contrast(0.9)',
//     deepRetro: 'brightness(0.9) contrast(1.2) sepia(0.3) hue-rotate(-10deg)',
//     etherealTomato: 'brightness(1.25) blur(0.2px) contrast(0.85) sepia(0.15) hue-rotate(-5deg) saturate(1.05)',
// };

// const noiseTypeImg = {
//     white: 'src/assets/noise.jpg',
//     black: 'src/assets/noise_1.jpg',
//     geullichi: 'src/assets/geullichi.jpg',
//     bw: 'src/assets/b_W.jpg',
//     blue: 'src/assets/blue.png',
//     green: 'src/assets/green.png',
// };

// const EditorBox = () => {
//     const [imageUrl, setImageUrl] = useState<string | null>(null);

//     const [brightness, setBrightness] = useState(100);
//     const [blur, setBlur] = useState(0);
//     const [contrast, setContrast] = useState(100);
//     const [exposure, setExposure] = useState(100);
//     const [overlayColor, setOverlayColor] = useState('#ffffff');
//     const [overlayOpacity, setOverlayOpacity] = useState(0);
//     const [noiseOpacity, setNoiseOpacity] = useState(0);
//     const [noiseType, setNoiseType] = useState('');
//     const [saturate, setSaturate] = useState(100);

//     const [filterMode, setFilterMode] = useState<'custom' | 'preset'>('custom');
//     const [filter, setFilter] = useState<string>('');

//     const [skinToneStrength, setSkinToneStrength] = useState(1);

//     const [frameLayout, setFrameLayout] = useState<'single' | 'two' | 'three' | 'four'>('single');
//     const [imageUrls, setImageUrls] = useState<string[]>([]);

//     //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     //     const file = e.target.files?.[0];
//     //     console.log(e.target.files?.length);
//     //     if (!file) return;
//     //     const reader = new FileReader();
//     //     reader.onloadend = () => setImageUrl(reader.result as string);
//     //     reader.readAsDataURL(file);
//     //   };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;

//         if (files.length === 1) {
//             const reader = new FileReader();
//             reader.onloadend = () => setImageUrl(reader.result as string);
//             reader.readAsDataURL(files[0]);
//         } else {
//             const result: string[] = [];
//             let loaded = 0;
//             const maxCount = 4;

//             for (let i = 0; i < Math.min(files.length, maxCount); i++) {
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                     result[i] = reader.result as string;
//                     loaded++;
//                     if (loaded === Math.min(files.length, maxCount)) {
//                         setImageUrls(result);
//                     }
//                 };
//                 reader.readAsDataURL(files[i]);
//             }
//         }
//     };

//     const computedFilter = useMemo(() => {
//         if (filterMode === 'preset') {
//             return { filter };
//         } else {
//             const exposureFilter = `brightness(${exposure}%) contrast(${200 - exposure}%)`;
//             return {
//                 filter: `
//           ${exposureFilter}
//           brightness(${brightness}%)
//           blur(${blur}px)
//           contrast(${contrast}%)
//           saturate(${saturate}%)
//         `,
//             };
//         }
//     }, [filterMode, filter, exposure, brightness, blur, contrast]);

//     //   const handleSave = () => {
//     //     if (!imageUrl) return;

//     //     const img = new Image();
//     //     img.src = imageUrl;
//     //     img.crossOrigin = "anonymous";

//     //     img.onload = () => {
//     //       const width = img.naturalWidth;
//     //       const height = img.naturalHeight;

//     //       const canvas = document.createElement("canvas");
//     //       canvas.width = width;
//     //       canvas.height = height;
//     //       const ctx = canvas.getContext("2d");
//     //       if (!ctx) return;

//     //       const fullFilter = `
//     //         brightness(${brightness}%)
//     //         blur(${blur}px)
//     //         contrast(${contrast}%)
//     //         brightness(${exposure}%)
//     //         contrast(${200 - exposure}%)
//     //         saturate(${saturate}%)
//     //       `;
//     //       ctx.filter = fullFilter;

//     //       ctx.drawImage(img, 0, 0, width, height);

//     //       correctSkinTone(ctx, width, height, skinToneStrength);

//     //       if (overlayOpacity > 0) {
//     //         ctx.filter = "none";
//     //         ctx.globalAlpha = overlayOpacity / 100;
//     //         ctx.fillStyle = overlayColor;
//     //         ctx.fillRect(0, 0, width, height);
//     //         ctx.globalAlpha = 1;
//     //       }

//     //       if (frameLayout === "two") {
//     //         ctx.fillStyle = "white";
//     //         ctx.fillRect(0, height / 2 - 1, width, 2);
//     //       }

//     //       if (frameLayout === "three") {
//     //         ctx.fillStyle = "white";
//     //         ctx.fillRect(0, height / 3 - 1, width, 2);
//     //         ctx.fillRect(0, (height * 2) / 3 - 1, width, 2);
//     //       }

//     //       const noise = new Image();
//     //       noise.src = "src/assets/noise.jpg";
//     //       noise.crossOrigin = "anonymous";

//     //       noise.onload = () => {
//     //         if (noiseOpacity > 0) {
//     //           ctx.globalAlpha = noiseOpacity / 100;
//     //           ctx.globalCompositeOperation = "overlay";
//     //           ctx.drawImage(noise, 0, 0, width, height);
//     //           ctx.globalAlpha = 1;
//     //           ctx.globalCompositeOperation = "source-over";
//     //         }

//     //         canvas.toBlob((blob) => {
//     //           if (!blob) return;
//     //           const link = document.createElement("a");
//     //           link.href = URL.createObjectURL(blob);
//     //           link.download = "filtered-image.png";
//     //           link.click();
//     //         }, "image/png");
//     //       };
//     //     };
//     //   };

//     //   const handleSave = () => {
//     //     if (frameLayout === "single" && !imageUrl) return;
//     //     if (frameLayout !== "single" && imageUrls.length === 0) return;

//     //     const imagesToLoad =
//     //       frameLayout === "single"
//     //         ? [imageUrl!]
//     //         : imageUrls.slice(
//     //             0,
//     //             frameLayout === "two" ? 2 : frameLayout === "three" ? 3 : 4
//     //           );

//     //     const imageElements: HTMLImageElement[] = [];
//     //     let loaded = 0;

//     //     imagesToLoad.forEach((src, i) => {
//     //       const img = new Image();
//     //       img.src = src;
//     //       img.crossOrigin = "anonymous";

//     //       img.onload = () => {
//     //         imageElements[i] = img;
//     //         loaded++;

//     //         if (loaded === imagesToLoad.length) {
//     //           // ✅ 모든 이미지 로딩 완료 후 처리

//     //           // 가장 작은 크기로 정규화
//     //           const width = Math.min(
//     //             ...imageElements.map((img) => img.naturalWidth)
//     //           );
//     //           const height = Math.min(
//     //             ...imageElements.map((img) => img.naturalHeight)
//     //           );

//     //           const canvas = document.createElement("canvas");
//     //           const ctx = canvas.getContext("2d");
//     //           if (!ctx) return;

//     //           if (frameLayout === "four") {
//     //             canvas.width = width * 2;
//     //             canvas.height = height * 2;
//     //           } else {
//     //             canvas.width = width;
//     //             canvas.height = height * imagesToLoad.length;
//     //           }

//     //           // 필터 적용
//     //           ctx.filter = `
//     //             brightness(${brightness}%)
//     //             blur(${blur}px)
//     //             contrast(${contrast}%)
//     //             brightness(${exposure}%)
//     //             contrast(${200 - exposure}%)
//     //             saturate(${saturate}%)
//     //           `;

//     //           // 이미지 그리기
//     //           if (frameLayout === "four") {
//     //             imageElements.forEach((img, idx) => {
//     //               const x = (idx % 2) * width;
//     //               const y = Math.floor(idx / 2) * height;
//     //               ctx.drawImage(img, x, y, width, height);
//     //             });
//     //           } else {
//     //             imageElements.forEach((img, idx) => {
//     //               ctx.drawImage(img, 0, height * idx, width, height);
//     //             });
//     //           }

//     //           // 피부톤 보정
//     //           correctSkinTone(ctx, canvas.width, canvas.height, skinToneStrength);

//     //           // 오버레이
//     //           if (overlayOpacity > 0) {
//     //             ctx.filter = "none";
//     //             ctx.globalAlpha = overlayOpacity / 100;
//     //             ctx.fillStyle = overlayColor;
//     //             ctx.fillRect(0, 0, canvas.width, canvas.height);
//     //             ctx.globalAlpha = 1;
//     //           }

//     //           // 노이즈 적용
//     //           const noise = new Image();
//     //           noise.src = noiseType || "src/assets/noise.jpg";
//     //           noise.crossOrigin = "anonymous";

//     //           noise.onload = () => {
//     //             if (noiseOpacity > 0) {
//     //               ctx.globalAlpha = noiseOpacity / 100;
//     //               ctx.globalCompositeOperation = "overlay";
//     //               ctx.drawImage(noise, 0, 0, canvas.width, canvas.height);
//     //               ctx.globalAlpha = 1;
//     //               ctx.globalCompositeOperation = "source-over";
//     //             }

//     //             // 저장
//     //             canvas.toBlob((blob) => {
//     //               if (!blob) return;
//     //               const link = document.createElement("a");
//     //               link.href = URL.createObjectURL(blob);
//     //               link.download = "filtered-image.png";
//     //               link.click();
//     //             }, "image/png");
//     //           };
//     //         }
//     //       };
//     //     });
//     //   };

//     const drawImageCrop = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
//         const imgRatio = img.width / img.height;
//         const frameRatio = w / h;

//         let srcW = img.width;
//         let srcH = img.height;

//         if (imgRatio > frameRatio) {
//             srcW = img.height * frameRatio;
//         } else {
//             srcH = img.width / frameRatio;
//         }

//         const srcX = (img.width - srcW) / 2;
//         const srcY = (img.height - srcH) / 2;

//         ctx.drawImage(img, srcX, srcY, srcW, srcH, x, y, w, h);
//     };

//     const handleSave = () => {
//         if (frameLayout === 'single' && !imageUrl) return;
//         if (frameLayout !== 'single' && imageUrls.length === 0) return;

//         const imagesToLoad =
//             frameLayout === 'single'
//                 ? [imageUrl!]
//                 : imageUrls.slice(0, frameLayout === 'two' ? 2 : frameLayout === 'three' ? 3 : 4);

//         const imageElements: HTMLImageElement[] = [];
//         let loaded = 0;

//         imagesToLoad.forEach((src, i) => {
//             const img = new Image();
//             img.src = src;
//             img.crossOrigin = 'anonymous';
//             img.onload = () => {
//                 imageElements[i] = img;
//                 loaded++;
//                 if (loaded === imagesToLoad.length) {
//                     const canvasWidth = 800;
//                     const canvasHeight = 1200;
//                     const canvas = document.createElement('canvas');
//                     const ctx = canvas.getContext('2d');
//                     if (!ctx) return;

//                     canvas.width = canvasWidth;
//                     canvas.height = canvasHeight;

//                     ctx.filter = `
//             brightness(${brightness}%)
//             blur(${blur}px)
//             contrast(${contrast}%)
//             brightness(${exposure}%)
//             contrast(${200 - exposure}%)
//             saturate(${saturate}%)
//           `;
//                     const drawImageCrop = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
//                         const imgRatio = img.width / img.height;
//                         const frameRatio = w / h;

//                         let srcW = img.width;
//                         let srcH = img.height;

//                         if (imgRatio > frameRatio) {
//                             srcW = img.height * frameRatio;
//                         } else {
//                             srcH = img.width / frameRatio;
//                         }

//                         const srcX = (img.width - srcW) / 2;
//                         const srcY = (img.height - srcH) / 2;

//                         ctx.drawImage(img, srcX, srcY, srcW, srcH, x, y, w, h);
//                     };

//                     if (frameLayout === 'single') {
//                         drawImageCrop(imageElements[0], 0, 0, 800, 1200);
//                     } else if (frameLayout === 'two') {
//                         drawImageCrop(imageElements[0], 0, 0, 800, 600);
//                         drawImageCrop(imageElements[1], 0, 600, 800, 600);
//                     } else if (frameLayout === 'three') {
//                         drawImageCrop(imageElements[0], 0, 0, 800, 400);
//                         drawImageCrop(imageElements[1], 0, 400, 800, 400);
//                         drawImageCrop(imageElements[2], 0, 800, 800, 400);
//                     } else if (frameLayout === 'four') {
//                         drawImageCrop(imageElements[0], 0, 0, 400, 600);
//                         drawImageCrop(imageElements[1], 400, 0, 400, 600);
//                         drawImageCrop(imageElements[2], 0, 600, 400, 600);
//                         drawImageCrop(imageElements[3], 400, 600, 400, 600);
//                     }

//                     correctSkinTone(ctx, canvas.width, canvas.height, skinToneStrength);

//                     if (overlayOpacity > 0) {
//                         ctx.filter = 'none';
//                         ctx.globalAlpha = overlayOpacity / 100;
//                         ctx.fillStyle = overlayColor;
//                         ctx.fillRect(0, 0, canvas.width, canvas.height);
//                         ctx.globalAlpha = 1;
//                     }

//                     const noise = new Image();
//                     noise.src = noiseType || 'src/assets/noise.jpg';
//                     noise.crossOrigin = 'anonymous';
//                     noise.onload = () => {
//                         if (noiseOpacity > 0) {
//                             ctx.globalAlpha = noiseOpacity / 100;
//                             ctx.globalCompositeOperation = 'overlay';
//                             ctx.drawImage(noise, 0, 0, canvas.width, canvas.height);
//                             ctx.globalAlpha = 1;
//                             ctx.globalCompositeOperation = 'source-over';
//                         }

//                         canvas.toBlob((blob) => {
//                             if (!blob) return;
//                             const link = document.createElement('a');
//                             link.href = URL.createObjectURL(blob);
//                             link.download = 'filtered-image.png';
//                             link.click();
//                         }, 'image/png');
//                     };
//                 }
//             };
//         });
//     };

//     const correctSkinTone = (ctx: CanvasRenderingContext2D, width: number, height: number, strength: number = 1) => {
//         const imageData = ctx.getImageData(0, 0, width, height);
//         const data = imageData.data;

//         for (let i = 0; i < data.length; i += 4) {
//             const r = data[i];
//             const g = data[i + 1];
//             const b = data[i + 2];

//             const isSkin = r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15;

//             if (isSkin) {
//                 // strength 값으로 조절
//                 data[i] = Math.min(255, r + 10 * strength); // R 강화
//                 data[i + 1] = g * (1 - 0.02 * strength); // G 약화
//                 data[i + 2] = b * (1 - 0.05 * strength); // B 약화
//             }
//         }

//         ctx.putImageData(imageData, 0, 0);
//     };
//     console.log(imageUrls);
//     return (
//         <div className="flex flex-col gap-4 text-sm text-black">
//             <input type="file" accept="image/*" multiple onChange={handleFileChange} />

//             <div className="flex gap-2 flex-wrap">
//                 {Object.entries(filterPresets).map(([name, value]) => (
//                     <button
//                         key={name}
//                         onClick={() => {
//                             setFilter(value);
//                             setFilterMode('preset');
//                         }}
//                         className="px-3 py-1 rounded bg-gray-700 text-white text-xs hover:bg-gray-600"
//                     >
//                         {name}
//                     </button>
//                 ))}
//             </div>

//             <div className="flex justify-between">
//                 <div className="relative  max-h-[1200px] flex items-center justify-center">
//                     {imageUrl || imageUrls.length > 0 ? (
//                         <>
//                             {frameLayout === 'single' && imageUrl && (
//                                 <img
//                                     src={imageUrl}
//                                     alt="preview"
//                                     className="object-contain w-full h-full"
//                                     style={computedFilter}
//                                 />
//                             )}

//                             {frameLayout === 'two' && imageUrls.length >= 2 && (
//                                 <div className="flex flex-col min-w-[800px] min-h-[1200px]">
//                                     {imageUrls.slice(0, 2).map((src, idx) => (
//                                         <img
//                                             key={idx}
//                                             src={src}
//                                             alt={`image-${idx}`}
//                                             className="object-cover w-full h-[600px]"
//                                             style={computedFilter}
//                                         />
//                                     ))}
//                                 </div>
//                             )}

//                             {frameLayout === 'three' && imageUrls.length >= 3 && (
//                                 <div className="flex flex-col min-w-[800px] min-h-[1200px]">
//                                     {imageUrls.slice(0, 3).map((src, idx) => (
//                                         <img
//                                             key={idx}
//                                             src={src}
//                                             alt={`image-${idx}`}
//                                             className="object-cover w-full h-[422px]"
//                                             style={computedFilter}
//                                         />
//                                     ))}
//                                 </div>
//                             )}

//                             {frameLayout === 'four' && (
//                                 <div className="flex flex-col min-w-[800px] min-h-[1200px]">
//                                     <div className="flex">
//                                         {imageUrls.slice(0, 2).map((src, idx) => (
//                                             <img
//                                                 key={idx}
//                                                 src={src}
//                                                 alt={`image-${idx}`}
//                                                 className="object-cover w-1/2 h-[600px]"
//                                                 style={computedFilter}
//                                             />
//                                         ))}
//                                     </div>
//                                     <div className="flex">
//                                         {imageUrls.slice(2, 4).map((src, idx) => (
//                                             <img
//                                                 key={idx}
//                                                 src={src}
//                                                 alt={`image-${idx}`}
//                                                 className="object-cover w-1/2 h-[600px]"
//                                                 style={computedFilter}
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                             <div
//                                 className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
//                                 style={{
//                                     backgroundColor: overlayColor,
//                                     opacity: overlayOpacity / 100,
//                                     mixBlendMode: 'overlay',
//                                 }}
//                             />
//                             <img
//                                 src={noiseType}
//                                 alt="noise"
//                                 className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
//                                 style={{
//                                     opacity: noiseOpacity / 100,
//                                     mixBlendMode: 'overlay',
//                                 }}
//                             />
//                         </>
//                     ) : (
//                         <span className="text-gray-400 min-w-[800px]">이미지를 업로드하세요</span>
//                     )}
//                 </div>

//                 {/* <div className="relative max-h-[700px] flex items-center justify-center w-full">
//           {imageUrls.length > 0 ? (
//             <div className="w-full h-full flex flex-col">
//               {imageUrls.map((url, idx) => (
//                 <div
//                   key={idx}
//                   className="relative flex-1 w-full overflow-hidden"
//                 >
//                   <img
//                     src={url}
//                     alt={`image-${idx}`}
//                     className="object-cover w-full h-full"
//                     style={computedFilter}
//                   />
//                   <div
//                     className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
//                     style={{
//                       backgroundColor: overlayColor,
//                       opacity: overlayOpacity / 100,
//                       mixBlendMode: "overlay",
//                     }}
//                   />
//                   <img
//                     src={noiseType}
//                     alt="noise"
//                     className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
//                     style={{
//                       opacity: noiseOpacity / 100,
//                       mixBlendMode: "overlay",
//                     }}
//                   />
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <span className="text-gray-400">이미지를 업로드하세요</span>
//           )}
//         </div> */}

//                 <div className="space-y-3">
//                     <Slider
//                         label="노출 (Exposure)"
//                         value={exposure}
//                         min={50}
//                         max={150}
//                         onChange={(v) => {
//                             setExposure(v);
//                             setFilterMode('custom');
//                         }}
//                     />
//                     <Slider
//                         label="밝기 (Brightness)"
//                         value={brightness}
//                         min={0}
//                         max={200}
//                         onChange={(v) => {
//                             setBrightness(v);
//                             setFilterMode('custom');
//                         }}
//                     />
//                     <Slider
//                         label="블러 (Blur)"
//                         value={blur}
//                         min={0}
//                         max={10}
//                         step={0.1}
//                         onChange={(v) => {
//                             setBlur(v);
//                             setFilterMode('custom');
//                         }}
//                     />
//                     <Slider
//                         label="대비 (Contrast)"
//                         value={contrast}
//                         min={0}
//                         max={200}
//                         onChange={(v) => {
//                             setContrast(v);
//                             setFilterMode('custom');
//                         }}
//                     />

//                     <Slider
//                         label="피부톤 보정 강도"
//                         value={skinToneStrength}
//                         min={0}
//                         max={2}
//                         step={0.1}
//                         onChange={(v) => {
//                             setSkinToneStrength(v);
//                             setFilterMode('custom');
//                         }}
//                     />

//                     <Slider
//                         label={`채도 (${saturate - 100})`}
//                         value={saturate}
//                         min={0}
//                         max={200}
//                         step={1}
//                         onChange={(v) => {
//                             setSaturate(v);
//                             setFilterMode('custom');
//                         }}
//                     />

//                     <div className="space-y-1">
//                         <label>
//                             오버레이 컬러:
//                             <input
//                                 type="color"
//                                 value={overlayColor}
//                                 onChange={(e) => {
//                                     setOverlayColor(e.target.value);
//                                     setFilterMode('custom');
//                                 }}
//                                 className="ml-2"
//                             />
//                         </label>
//                         <label>
//                             투명도: {overlayOpacity}%
//                             <input
//                                 type="range"
//                                 min="0"
//                                 max="100"
//                                 value={overlayOpacity}
//                                 onChange={(e) => {
//                                     setOverlayOpacity(Number(e.target.value));
//                                     setFilterMode('custom');
//                                 }}
//                                 className="w-full"
//                             />
//                         </label>
//                     </div>

//                     <div className="space-y-1">
//                         <label>
//                             노이즈 타입:
//                             {Object.entries(noiseTypeImg).map(([name, value]) => (
//                                 <button
//                                     key={name}
//                                     onClick={() => {
//                                         setNoiseType(value);
//                                         setFilterMode('custom');
//                                     }}
//                                     className="px-3 py-1 rounded bg-gray-700 text-white text-xs hover:bg-gray-600"
//                                 >
//                                     {name}
//                                 </button>
//                             ))}
//                         </label>
//                         <label>
//                             노이즈: {noiseOpacity}%
//                             <input
//                                 type="range"
//                                 min="0"
//                                 max="100"
//                                 value={noiseOpacity}
//                                 onChange={(e) => {
//                                     setNoiseOpacity(Number(e.target.value));
//                                     setFilterMode('custom');
//                                 }}
//                                 className="w-full"
//                             />
//                         </label>
//                     </div>
//                 </div>
//             </div>

//             <div className="flex gap-2 mb-2">
//                 {['single', 'two', 'three', 'four'].map((layout) => (
//                     <button
//                         key={layout}
//                         onClick={() => {
//                             setFrameLayout(layout as 'single' | 'two' | 'three' | 'four');
//                             setImageUrls([]);
//                             setImageUrl(null);
//                         }}
//                         className={`px-2 py-1 rounded ${
//                             frameLayout === layout ? 'bg-green-600 text-white' : 'bg-gray-200'
//                         }`}
//                     >
//                         {
//                             {
//                                 single: '1장',
//                                 two: '2분할',
//                                 three: '3분할',
//                                 four: '4분할',
//                             }[layout]
//                         }
//                     </button>
//                 ))}
//             </div>

//             <button className="mt-4 px-3 py-1 bg-green-600 text-white rounded" onClick={handleSave}>
//                 이미지 저장
//             </button>
//         </div>
//     );
// };

// type SliderProps = {
//     label: string;
//     value: number;
//     min: number;
//     max: number;
//     step?: number;
//     onChange: (value: number) => void;
// };

// const Slider = ({ label, value, min, max, step = 1, onChange }: SliderProps) => (
//     <label>
//         {label}: {value}
//         <input
//             type="range"
//             min={min}
//             max={max}
//             step={step}
//             value={value}
//             onChange={(e) => onChange(Number(e.target.value))}
//             className="w-full"
//         />
//     </label>
// );

// export default EditorBox;
