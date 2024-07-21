import React from "react";
import { Flex, Box, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { AiTwotoneStar } from "react-icons/ai";
import { BsBook } from "react-icons/bs";
import { RxSpeakerLoud } from "react-icons/rx";
import { FiHelpCircle } from "react-icons/fi";
import { MdRoundaboutRight } from "react-icons/md";
import { BiBulb } from "react-icons/bi";
import { postOrderState } from "@/atoms/postOrder";
import { useRecoilState } from "recoil";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type PageContentProps = {
  children: any;
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const [order, setOrder] = useRecoilState(postOrderState);
  const notify = () => toast("Feature coming soon!");

  return (
    <Flex justify="center" p="16px 0px">
      {isHomePage ? (
        <Flex width="95%" justify="center" maxWidth="1220px">
          <Flex
            direction="column"
            display={{ base: "none", md: "flex" }}
            flexGrow={1}
            background="violet"
            height="100vh"
            left={`calc(-50% - 15px)`}
            width="20%"
            mr="25px"
            p="20px 20px"
            border="1px solid"
            bg="white"
            borderColor="gray.300"
            borderRadius="8px 8px 8px 8px"
            position="sticky"
            top="50px"
          >
            <Flex direction="row" justify="left" align="center" cursor="pointer" 
              onClick={() => setOrder(true)} bg={order ? "gray.300" : "white"}
              borderRadius={15}
              padding="4px"
              mb="4px"
              mr={4}
            >
              <Icon as={BsArrowUpRightCircle} fontSize={30} mr={1} />
              <Box m={2}>Popular</Box>
            </Flex>
            <Flex direction="row" justify="left" align="center" cursor="pointer" 
              onClick={() => setOrder(false)} bg={order ? "white" : "gray.300"}
              borderRadius={15}
              padding="4px"
              mb="4px"
              mr={4}
            >
              <Icon as={AiTwotoneStar} fontSize={30} mr={1} />
              <Box m={2}>New</Box>
            </Flex>
            <Flex direction="row" justify="left" align="center" cursor="pointer" 
              borderRadius={15}
              padding="4px"
              mb="4px"
              mr={4}
              onClick={notify}
            >
              <Icon as={RxSpeakerLoud} fontSize={30} mr={1} />
              <Box m={2}>Advertise</Box>
            </Flex>
            <Flex direction="row" justify="left" align="center" cursor="pointer" 
              borderRadius={15}
              padding="4px"
              mb="4px"
              mr={4}
              onClick={notify}
            >
              <Icon as={BsBook} fontSize={30} mr={1} />
              <Box m={2}>Blog</Box>
            </Flex>
            <Flex direction="row" justify="left" align="center" cursor="pointer" 
              borderRadius={15}
              padding="4px"
              mb="4px"
              mr={4}
              onClick={notify}
            >
              <Icon as={BiBulb} fontSize={30} mr={1} />
              <Box m={2}>Press</Box>
            </Flex>
            <Flex direction="row" justify="left" align="center" cursor="pointer" 
              borderRadius={15}
              mb="4px"
              padding="4px"
              mr={4}
              onClick={notify}
            >
              <Icon as={FiHelpCircle} fontSize={30} mr={1} />
              <Box m={2}>Help</Box>
            </Flex>
            <Flex direction="row" justify="left" align="center" cursor="pointer" 
              borderRadius={15}
              padding="4px"
              mr={4}
              onClick={notify}
            >
              <Icon as={MdRoundaboutRight} fontSize={30} mr={1} />
              <Box m={2}>About Reddit</Box>
            </Flex>
          </Flex>
          <Flex
            direction="column"
            width={{ base: "100%", md: "65%" }}
            mr={{ base: 0, md: 6 }}
            maxWidth="528px"
          >
            {children && children[0 as keyof typeof children]}
          </Flex>
          <Flex
            direction="column"
            display={{ base: "none", md: "flex" }}
            flexGrow={1}
          >
            {children && children[1 as keyof typeof children]}
          </Flex>
        </Flex>
      ) : (
        <Flex width="95%" justify="center" maxWidth="860px">
          <Flex
            direction="column"
            width={{ base: "100%", md: "65%" }}
            mr={{ base: 0, md: 6 }}
          >
            {children && children[0 as keyof typeof children]}
          </Flex>
          <Flex
            direction="column"
            display={{ base: "none", md: "flex" }}
            flexGrow={1}
          >
            {children && children[1 as keyof typeof children]}
          </Flex>
        </Flex>
      )}
      <ToastContainer />
    </Flex>
  );
};

export default PageContent;
