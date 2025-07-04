import React from "react";
import Header from "./header";
import LayoutInitializer from "./LayoutInitializer";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutInitializer>
      <div>
        <Header />
        <div>{children}</div>
      </div>
    </LayoutInitializer>
  );
}

export default MainLayout;
