import React from "react";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import {IoNotificationsOutline, IoVideocamOutline,} from "react-icons/io5";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDirectory from "../../../hooks/useDirectory";

const ActionIcons: React.FC= ()=>{

  const notify = () => toast("Feature coming soon");
  const {toggleMenuOpen}=useDirectory()

  const onClickPlus = () => {
    toggleMenuOpen();
    //open create community module
  };

  return (
    <>
      <Flex alignItems="center" flexGrow={1}>
        <Box
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          borderRight="1px solid"
          borderColor="gray.200"
        >
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            onClick={notify}
          >
            <Icon as={BsArrowUpRightCircle} fontSize={20} />
          </Flex>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            onClick={notify}
          >
            {/*<Icon as={IoFilterCircleOutline} fontSize={22} />*/}
            <Image aria-label="Icon for Recap event" width="20" height="20" src="https://www.redditstatic.com/shreddit/assets/moments/recap/recap-banana-icon.svg" alt="Icon for Recap event" />
          </Flex>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            onClick={notify}
          >
            <Icon as={IoVideocamOutline} fontSize={22} />
          </Flex>
        </Box>
        <>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            onClick={notify}
          >
            <Icon as={BsChatDots} fontSize={20} />
          </Flex>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            onClick={notify}
          >
            <Icon as={IoNotificationsOutline} fontSize={20} />
          </Flex>
          <Flex
            display={{ base: "none", md: "flex" }}
            mr={3}
            ml={1.5}
            padding={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            onClick={onClickPlus}
          >
            <Icon as={GrAdd} fontSize={20} />
          </Flex>
        </>
      </Flex>
     <ToastContainer/>
    </>
  );
};

export default ActionIcons;