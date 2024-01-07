import { ChevronDownIcon } from "@chakra-ui/icons";
import {Menu, MenuButton, MenuList, Flex, Icon} from "@chakra-ui/react";
import React from "react";
import { Text } from "@chakra-ui/react";
import Communities from "./Communities";
import useDirectory from "@/hooks/useDirectory";
import { Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { TiHome } from "react-icons/ti";
import { BiLabel } from "react-icons/bi";

const Directory: React.FC=()=>{
    const { directoryState, toggleMenuOpen } = useDirectory();
    const router = useRouter();

    return (
        <Menu isOpen={directoryState.isOpen}>
            <MenuButton cursor="pointer" padding="0px 6px" borderRadius={4}
                _hover={{outline: "1px solid", outlineColor: "gray.200"}}
                mr={2}
                ml={{base:0, md:2}}
                onClick={toggleMenuOpen}
            >
                <Flex align="center" justify="space-between" width={{base:"auto", lg:"200px"}}>
                    <Flex align="center"> 

                        { (directoryState.selectedMenuItem.imageURL && router.pathname !== "/") && <Image src={directoryState.selectedMenuItem.imageURL} borderRadius="full" 
                            boxSize="24px"  mr={2} alt="memuItemImage"/>
                        }

                        { (!directoryState.selectedMenuItem.imageURL && router.pathname !== "/") && 
                          <Icon fontSize={24} mr={{base:1, md:2}} as={directoryState.selectedMenuItem.icon}
                            color={directoryState.selectedMenuItem.iconColor}/>
                        }
                        
                        { router.pathname === "/" && <Icon fontSize={24} mr={{base:1, md:2}} as={TiHome}
                           color="black"/>
                        }

                        <Flex display={{base:"none", lg:"flex"}}>
                            <Text fontWeight={600} fontSize="10pt">
                              {router.pathname==="/"? "Home" : directoryState.selectedMenuItem.displayText}
                            </Text>
                        </Flex>
                    </Flex>
                    <ChevronDownIcon/>
                </Flex>
            </MenuButton>
            <MenuList> 
                <Communities/>
                <Text textAlign="left"  ml={{base:0, md:2}} fontSize="10pt" color="red.400">
                   Select or Create Community
                </Text>
            </MenuList>
        </Menu>
    )
}
export default Directory;