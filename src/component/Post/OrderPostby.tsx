import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { Box } from "@chakra-ui/react";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { AiTwotoneStar } from "react-icons/ai";


type OrderPostbyProps = {
    order: boolean;
    setOrder: (value: boolean) => void;
};

const OrderPostby: React.FC<OrderPostbyProps> = ({order,setOrder}) => {

  
  return (
    <Flex
      justify="flex-start"
      align="center"
      bg="white"
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
      p={2}
      mb={4}
      display={{base:"flex", md:"none"}}
    >
      <Flex direction="row" justify="center" align="center" cursor="pointer" 
        onClick={()=>setOrder(true)} bg={order ? "gray.300" : "white"}
        borderRadius={15}
        padding="4px"
        mr={4}>
        <Icon as={BsArrowUpRightCircle} fontSize={30} mr={1} />
        <Box mr={2}>Popular</Box>
      </Flex>

      <Flex direction="row" justify="center" align="center" cursor="pointer" 
        onClick={()=>setOrder(false)} bg={order ? "white" : "gray.300"}
        borderRadius={15}
        padding="4px"
        mr={4}>
        <Icon as={AiTwotoneStar} fontSize={30} mr={1} />
        <Box mr={2}>New</Box>
     </Flex>
    </Flex>
  );
};
export default OrderPostby;
