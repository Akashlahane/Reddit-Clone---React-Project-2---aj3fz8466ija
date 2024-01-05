/* eslint-disable */
import React from "react";
import {SearchIcon,CloseIcon,} from "@chakra-ui/icons";
import {Flex, InputGroup, InputLeftElement, Input,Box,InputRightElement,} from "@chakra-ui/react";
import {collection, getDocs, orderBy, query,} from "firebase/firestore";
import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { Community } from "@/atoms/communitiesAtom";
import { firestore } from "../../firebase/clientApp";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";

type SearchInputProps = {
  user?: User | null;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  const [input, setInput] = useState("");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isCloseIconClicked, setIsCloseIconClicked] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();
  
  const getCommunityRecommendations = async () => {
    try {
      const communityQuery = query(
        collection(firestore, "communities"),
        orderBy("numberOfMembers", "desc")
      );
      const communityDocs = await getDocs(communityQuery);
      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunities(communities as Community[]);
    } catch (error: any) {
      console.log("getCommunityRecommendations error", error);
    }
  };

  const handleSearch = () => {
    getCommunityRecommendations();
    const communityArray = communities.filter((snippet) =>
      snippet.id.toLowerCase().includes(input.toLowerCase())
    );
    const results = communityArray.map((item) => item.id);
    setSearchResults(results);
  };

  const clearInput = () => {
    setInput("");
    setIsCloseIconClicked(true);
  };

  useEffect(() => {
    if (!user && input.length>=1) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    handleSearch();
    setIsCloseIconClicked(false);
  }, [input]);

  useEffect(() => {
    setInput("");
    setIsCloseIconClicked(true);
  }, [router]);

  return (
    <Flex
      flexGrow={1}
      mr={2}
      alignItems="center"
      maxWidth={user ? "auto" : "600px"}
      position="relative"
    >
      <Flex
        flexGrow={1}
        mr={2}
        alignItems="center"
        maxWidth={user ? "auto" : "600px"}
      >
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" mb={1} />
          </InputLeftElement>
          <Input
            placeholder="Search Reddit"
            fontSize="10pt"
            _placeholder={{ color: "gray.500" }}
            _hover={{
              bg: "white",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            _focus={{
              outline: "none",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            height="34px"
            bg="gray.50"
            onChange={(event) => setInput(event?.target.value)}
            value={input}
          />

          {input && (
            <InputRightElement onClick={clearInput}>
              <CloseIcon color="gray.400" mb={1} />
            </InputRightElement>
          )}
        </InputGroup>
      </Flex>

      {input && !isCloseIconClicked && (
        <Box
          position="absolute"
          top="40px"
          bg="#FFFFFF"
          maxWidth={user ? "auto" : "600px"}
          minWidth="250px"
          pt="15px"
          pb="15px"
          border="1px"
          borderColor="blue.500"
        >
          {/* Display search results */}
          {searchResults.map((result) => (
            <Box
              key={result}
              mt="2px"
              onClick={() => {
                router.push(`/r/${result}`);
                clearInput();
              }}
              cursor="pointer"
              _hover={{bg:"blue.100"}}
            >
              <Box pl="15px"> {result} </Box>
             
            </Box>
          ))}
        </Box>
      )}
    </Flex>
  );
};
export default SearchInput;
/* eslint-disable */
