import React from "react";
import Header from "../components/header";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
}

export default MainLayout;
