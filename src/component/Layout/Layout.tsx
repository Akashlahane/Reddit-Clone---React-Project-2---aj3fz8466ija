import React, {ReactNode} from "react";
import Navbar from "../Navbar/Navbar";
import { Box, Flex } from "@chakra-ui/react";

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