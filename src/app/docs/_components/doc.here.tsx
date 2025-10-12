import { scrollToId } from '.';

export default function DocHero() {
    return (
        <section className="mb-6 lg:mb-10">
            <div className="rounded-2xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 p-6 lg:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                            soom [Love & Buddy] – 프로젝트 문서
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-300 mt-2 max-w-2xl">
                            반려동물 보호자(Love)와 검증된 버디(Buddy)를 연결하는 매칭 플랫폼의 기획·UX·설계·시연을
                            문서형 레이아웃으로 정리했습니다. 아래 목차를 따라 살펴보세요.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-col">
                        <a
                            href="#links"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToId('demo__live');
                            }}
                            className="inline-flex items-center justify-center h-11 px-4 rounded-xl custom-card custom-card-hover w-full"
                        >
                            시연 보기
                        </a>
                        <a
                            href="#stack"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToId('architecture__stack');
                            }}
                            className="inline-flex items-center justify-center h-11 px-4 btn-card rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                            Tech Stack
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
