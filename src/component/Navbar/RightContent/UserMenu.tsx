import { ChevronDownIcon } from "@chakra-ui/icons";
import {Menu, MenuButton, MenuList, MenuItem, Icon, Flex, Text} from "@chakra-ui/react";
import {User, signOut} from "firebase/auth";
import React from "react";
import {FaRedditSquare} from "react-icons/fa";
import {VscAccount} from "react-icons/vsc";
import { IoSparkles } from "react-icons/io5";
import {CgProfile} from "react-icons/cg";
import {MdOutlineLogin} from "react-icons/md";
import { MenuDivider } from "@chakra-ui/react";
import { auth } from "../../../firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { useRouter } from 'next/router';
import { AiOutlineShopping } from "react-icons/ai";
import { RxSpeakerLoud } from "react-icons/rx";
import { BsThreeDots } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type UserMenuProps={
    user?: User | null;
};

const UserMenu : React.FC<UserMenuProps> = ({user})=>{
    const setAuthModalState = useSetRecoilState(authModalState);
    const router = useRouter(); 
    
    const logout = async () => {
      await signOut(auth);
      router.push('/');
      //resetCommunityState(defaultCommunityState);
    };

    const notify = () => toast("Feature coming soon!");

    return ( <>
        <Menu>
            <MenuButton cursor="pointer" padding="0px 6px" borderRadius={4} _hover={{outline: "1px solid", outlineColor: "gray.500"}}>
                 <Flex align="center">
                   <Flex align="center">
                    {user ? 
                        ( 
                            <>
                                <Icon fontSize={24} mr={1} color="gray.300" as={FaRedditSquare}/>
                                <Flex
                                  direction="column"
                                  display={{base:"none", lg:"flex"}}
                                  fontSize="8pt"
                                  align="flex-start"
                                  mr={8}
                                >
                                    <Text fontWeight={700}>
                                        {user?.displayName || user.email?.split("@")[0]}
                                    </Text>
                                    <Flex>
                                        <Icon as={IoSparkles} color="brand.100" mr={1}/>
                                        <Text color="gray.400">1 karma</Text>
                                    </Flex>
                                </Flex>
                            </>  
                        )
                        :
                        ( <Icon fontSize={24} color="gray.400" mr={1} as={BsThreeDots}/>)
                    }
                    <ChevronDownIcon/>
                  </Flex>
                </Flex>
            </MenuButton>
            <MenuList>
                {user ? (
                    <>
                      {/*<MenuItem fontSize="10pt" fontWeight={700 } _hover={{bg:"blue.500", color:"white"}}>
                            <Flex align="center">
                                <Icon fontSize={20} mr={2} as={CgProfile}/>
                                Profile
                            </Flex>
                            </MenuItem>*/}
                      <MenuDivider/>
                      <MenuItem fontSize="10pt" fontWeight={700 } _hover={{bg:"blue.500", color:"white"}} onClick={logout}>
                            <Flex align="center">
                                <Icon fontSize={20} mr={2} as={MdOutlineLogin}/>
                                   Log Out
                            </Flex>
                      </MenuItem>
                      
                    </>
                ) : (
                    <>
                      <MenuItem fontSize="10pt" fontWeight={700 } m={0} p={0}>
                            <Flex direction="column" width={"100%"} m={0} >
                            <Flex align="center" pl={4} pr={0} pb={2}  pt={2} m={0} _hover={{bg:"blue.500", color:"white"}}
                                           onClick={()=>setAuthModalState({open:true, view:"signup" })}> 
                                <Icon fontSize={20} mr={2} as={CgProfile}/>
                                  Sign Up
                            </Flex>
                            <Flex align="center"  pl={4} pr={0}  m={0} pb={2}  pt={2} _hover={{bg:"blue.500", color:"white"}}
                             onClick={notify}> 
                                <Icon fontSize={20}  mr={2} as={RxSpeakerLoud}/>
                                  Advertise on Reddit
                            </Flex>
                            <Flex align="center" pl={4} pr={0} m={0} pb={2}  pt={2} _hover={{bg:"blue.500", color:"white"}}
                             onClick={notify}> 
                                <Icon fontSize={20} mr={2} as={AiOutlineShopping}/>
                                  Shop Collectibe Avatars
                            </Flex>
                            </Flex>
                       </MenuItem>
                    </>
                )}
                
            </MenuList>
           
        </Menu>
        <ToastContainer/>
    </>
      
    )
}
export default UserMenu;