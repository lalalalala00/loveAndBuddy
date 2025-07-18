// // "use client";

// // const Intro = () => {
// //   return (
// //     <div className="min-h-screen bg-white px-8 py-16 text-gray-800">
// //       <div className="max-w-4xl mx-auto">
// //         <h1 className="text-4xl font-bold mb-4">Love & Buddy</h1>
// //         <h2 className="text-xl font-medium text-amber-600 mb-10">우리를 이어주는 공감의 공간</h2>

// //         <p className="mb-1">
// //           <strong>“반려생활은 혼자가 아니라, 함께입니다.”</strong>
// //           <br />
// //         </p>

// //         <p>
// //           바쁜 일상 속에서도 반려동물에게 더 나은 시간을 선물하고 싶은 보호자, 반려동물과의 교감에
// //           가치를 느끼는 펫시터, 그리고 모두를 이해하고 존중할 수 있는 연결이 필요했습니다. 우리는 그
// //           따뜻한 연결의 시작점을 만들고 싶었습니다.
// //         </p>

// //         <section className="mb-12">
// //           <h3 className="text-2xl font-semibold mb-3">기획 의도</h3>
// //           <p className="leading-relaxed text-[17px]">
// //             <em>러브 앤드 버디</em>는 단순한 펫시터 매칭 서비스를 넘어,
// //             <br />
// //             반려동물을 사랑하는 사람들과 신뢰할 수 있는 버디(펫시터), 그리고 그들을 서로를 이해하고
// //             존중하며 따뜻한 교감을 나누고 이어질 수 있는 공간을 만들고자 했습니다.
// //             <br />이 플랫폼은 <strong>공감, 공유, 그리고 신뢰</strong>를 핵심 가치로 삼습니다.
// //             단순히 '맡기고 끝'나는 서비스가 아닌, 서로의 이야기를 나누고 기억을 남기는 공간이 되기를
// //             바랍니다.
// //           </p>

// //           <p>
// //             그래서 우리는 일기처럼 감정을 기록할 수 있는 <strong>"디얼 러브 (Dear Love)"</strong>
// //             메뉴를 만들고, 각자의 성향에 맞게 버디와 러브를 찾을 수 있도록 설계했습니다. 서비스는
// //             기능보다 마음에 닿고, 연결보다 교감에 집중합니다.
// //           </p>
// //         </section>

// //         <section className="mb-12">
// //           <h3 className="text-2xl font-semibold mb-3">컨셉</h3>
// //           <ul className="list-disc ml-6 text-[17px] leading-relaxed">
// //             <li>버디와 러브의 관계를 '친구'처럼 자연스럽고 따뜻하게 표현</li>
// //             <li>감성적인 UI와 다이어리 기반의 경험 공유 중심 구조</li>
// //             <li>실시간 소통 기능을 통한 신뢰 기반의 연결</li>
// //             <li>반려동물을 진심으로 아끼는 사람들의 커뮤니티 구축</li>
// //           </ul>
// //         </section>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Intro;

"use client";

const Intro = () => {
  return (
    <div className="min-h-screen px-8 py-16 text-gray-800 rounded-xl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Love & Buddy</h1>
        <h2 className="text-xl font-medium text-[#3a650f] mb-10">우리를 이어주는 공감의 공간</h2>

        <p className="mb-4 text-[17px]">
          <strong>“반려생활은 혼자가 아니라, 함께입니다.”</strong>
        </p>

        <p className="mb-10 text-[17px] leading-relaxed">
          <p>
            바쁜 일상 속에서도 반려동물에게 더 나은 시간을 선물하고 싶은 보호자, 반려동물과의 교감에
            가치를 느끼는 펫시터, 그리고 모두를 이해하고 존중할 수 있는 연결이 필요했습니다. 우리는
            그 따뜻한 연결의 시작점을 만들고 싶었습니다.
          </p>
          <em>러브 앤드 버디</em>는 단순한 펫시터 매칭을 넘어, 반려동물을 사랑하는 보호자(Love)와
          신뢰할 수 있는 펫시터(Buddy)를 연결하는 플랫폼입니다. 우리는 이 연결이 단순한 ‘의뢰와
          수행’이 아니라,
          <strong className="font-medium"> 교감과 이해, 그리고 따뜻한 시간의 나눔</strong>이 되길
          바랍니다.
          <br />이 플랫폼은 <strong>공감, 공유, 그리고 신뢰</strong>를 핵심 가치로 삼습니다.
          <br />
          보호자에게는 소중한 반려동물을 안심하고 맡길 수 있는 신뢰를, 버디에게는 반려동물과의 의미
          있는 시간을 경험할 기회를, 그리고 모두에게는 반려생활을 나누는{" "}
          <strong>공유의 커뮤니티</strong>를 제공하고자 합니다.
        </p>

        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-3">기획 의도</h3>
          <p className="leading-relaxed text-[17px] mb-4">
            우리는 반려동물을 단순히 돌보는 존재가 아니라, 삶의 한 부분으로 받아들입니다.
            <br />
            그래서 <strong>'맡기고 끝나는'</strong> 서비스가 아닌,
            <strong className="font-medium">‘그 시간마저 소중히 여기는 경험’</strong>을 만들고
            싶었습니다.
            <br />
            <br />
            <em>러브 앤드 버디</em>는 보호자와 펫시터가 서로를 이해하고 존중할 수 있는 환경을
            조성하며, 반려동물을 중심으로 따뜻한 이야기가 오가는 공간을 지향합니다.
            <br />
            <br />
            그리고 단지 필요한 도움을 받는 것을 넘어,
            <strong>감정을 공유하고, 추억을 기록하며, 진심으로 교감할 수 있는 공간</strong>을
            만들고자 합니다.
          </p>

          <p>
            그래서 우리는 일기처럼 감정을 기록할 수 있는 <strong>"디얼 러브 (Dear Love)"</strong>
            메뉴를 만들고, 각자의 성향에 맞게 버디와 러브를 찾을 수 있도록 설계했습니다. 서비스는
            기능보다 마음에 닿고, 연결보다 교감에 집중합니다.
          </p>

          <p className="leading-relaxed text-[17px]">
            그 핵심에는 <strong>"디얼 러브 (Dear Love)"</strong>가 있습니다. 펫시터와의 소중한
            순간을 일기처럼 남기고, 감정을 공유하며, 단 한 번의 만남도 특별하게 기록하는 기능입니다.
            <br />
            우리는 기술보다 <strong>사람의 마음</strong>을, 연결보다 <strong>교감</strong>을 더
            중요하게 생각합니다.
          </p>
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-3">컨셉</h3>
          <ul className="list-disc ml-6 text-[17px] leading-relaxed">
            <li>버디와 러브의 관계를 '친구'처럼 따뜻하고 자연스럽게 표현</li>
            <li>일상과 감정을 기록하고 공유할 수 있는 다이어리 기반 구조</li>
            <li>실시간 메시지 및 교감 기능으로 신뢰와 친밀감 형성</li>
            <li>반려동물을 아끼는 사람들이 모여 경험을 나누는 커뮤니티</li>
            <li>기억을 존중하고 감정을 소중히 여기는 감성 중심의 UX</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Intro;
