import React from "react";
import Navbar from "../Navbar/Navbar";

type LayoutProps= {
    children: any;
}
  
const Layout: React.FC<LayoutProps> = ( {children}:{ children: React.ReactNode } ) => {
    return (
        <>  
            <Navbar/>
            {children}
        </>
    );
};
export default Layout;