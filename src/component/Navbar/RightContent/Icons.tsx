import React from "react";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import {IoNotificationsOutline, IoVideocamOutline,} from "react-icons/io5";
import Image from "next/image";

const ActionIcons: React.FC= ()=>{
  return (
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
         
        >
          <Icon as={GrAdd} fontSize={20} />
        </Flex>
      </>
    </Flex>
  );
};

export default ActionIcons;