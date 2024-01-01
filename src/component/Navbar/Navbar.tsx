import React from "react";
import { Flex, Image, position } from "@chakra-ui/react";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import Directory from "./Directory/Directory";
import useDirectory from "@/hooks/useDirectory";
import { defaultMenuItem } from "@/atoms/directoryMenuAtom";

const Navbar: React.FC= () =>  {
  const [user] = useAuthState(auth);
  const {onSelectMenuItem} = useDirectory();

  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justify={{md:"space-between"}}
      position="sticky"    // Make the navbar sticky
      top="0"              // Stick it to the top
      zIndex="100"         // Set a high z-index to ensure it's above other elements   
    >
      <Flex align="center" width={{base:"40px", md:"auto"}} mr={{base:0, md:2}}
       cursor="pointer"
       onClick={()=> onSelectMenuItem(defaultMenuItem)}
      >
        <Image src="/images/redditFace.svg"  alt="redditlogo" height="30px" />
        <Image src="/images/redditText.svg" alt="redditTextLogo" height="46px" display={{ base: "none", md: "unset" }}/>
      </Flex>
      {user && <Directory />}
      <SearchInput user={user}/>
      <RightContent user={user}/>
    </Flex> 
  );
};

export default Navbar;

