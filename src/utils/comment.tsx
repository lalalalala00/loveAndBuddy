export function PrivacyNote({ variant = 'short' }: { variant?: 'short' | 'full' | 'lock' }) {
    const text =
        variant === 'full'
            ? '상세 주소는 공개되지 않으며, 매칭 확정 후 시터에게만 안전하게 공유돼요.'
            : variant === 'lock'
              ? '매칭 확정 후 시터에게만 공유됩니다.'
              : '주소를 추가해도 리스트에는 공개되지 않아요.';
    return <p className="px-3 mt-3 text-[12px] text-gray-500">{text}</p>;
}
