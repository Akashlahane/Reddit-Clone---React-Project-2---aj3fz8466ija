import React from "react";
import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import { useRouter } from "next/router";//
import { useSetRecoilState } from "recoil";
import useDirectory from "@/hooks/useDirectory";
import { authModalState } from "@/atoms/authModalAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";

const PersonalHome: React.FC = () => {
  const [user, loadingUser] = useAuthState(auth);
  const router = useRouter();
  const setAuthModalState = useSetRecoilState(authModalState);
  const {toggleMenuOpen}=useDirectory();

  const onClick = () => {
    if (!user) {
      setAuthModalState({open: true, view: "login"});
      return;
    }
    const {communityId} = router.query;
    if(communityId){
      router.push(`/r/${communityId}/submit`);
      return;
    }
    toggleMenuOpen();
  };

  return (
    <Flex 
      position="sticky"
      direction="column" 
      bg="white" 
      cursor="pointer" 
      borderRadius={4} 
      border="1px solid" 
      borderColor="gray.300"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="34px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/redditPersonalHome.png)"
        backgroundSize="cover"
      > 
      </Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" mb={2}>
          <Icon as={FaReddit} fontSize={35} color="brand.100" mr={2} />
          <Text fontWeight={600}>Home</Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize="9pt">
            Your personal Reddit frontpage, built for you.
          </Text>
          <Button height="30px">Create Post</Button>
          <Button variant="outline" height="30px" onClick={onClick}>
            Create Community
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default PersonalHome;
