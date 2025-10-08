import Header from '@/common/header';
import 'react-resizable/css/styles.css';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
}
