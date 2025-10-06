import React from 'react';

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {/* <Header /> */}
            <div>{children}</div>
        </div>
    );
}

export default MainLayout;
