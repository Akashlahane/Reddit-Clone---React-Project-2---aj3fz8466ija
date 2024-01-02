import React from "react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";
import {GrAdd} from "react-icons/gr";
import {Box, Flex, Icon, MenuItem, Text} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { communityState } from "@/atoms/communitiesAtom";
import { FaReddit } from "react-icons/fa";
import MenuListItem from "./MenuListItem";

type CommunitiesProps={menuOpen: boolean};

const Communities: React.FC=(CommunitiesProps)=>{
  const [open, setOpen]=useState(false);
  const mySnippets= useRecoilValue(communityState).mySnippets;
  console.log("akash testing my snippets ", mySnippets );

  return(
    <>
      <CreateCommunityModal open={open}  handleClose={()=>setOpen(false)}/>
      {mySnippets.find((item) => item.isModerator) && (
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {mySnippets
          .filter((item) => item.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              icon={FaReddit}
              iconColor="brand.100"
            />
          ))}
      </Box>
      )}

      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
       <MenuItem width="100%" fontSize="10pt" _hover={{bg: "gray.500"}} onClick={()=> setOpen(true)}>
         <Flex align="center">
            <Icon fontSize={20} mr={2} as={GrAdd}/>
            Create Community
         </Flex>
       </MenuItem>
       {mySnippets.map((snippet) => (
            <MenuListItem
                  key={snippet.communityId}
                  icon={FaReddit}
                  displayText={`r/${snippet.communityId}`}
                  link={`/r/${snippet.communityId}`}
                  iconColor="blue.500"
                  imageURL={snippet.imageURL}
               /> 
        ))}
      </Box>
    </>
  );
};

export default Communities;


