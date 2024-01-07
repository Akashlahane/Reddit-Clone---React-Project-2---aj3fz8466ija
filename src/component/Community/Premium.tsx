import React from "react";
import { Flex, Icon, Text, Stack, Button } from "@chakra-ui/react";
import { GiCheckedShield } from "react-icons/gi";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth} from "../../firebase/clientApp";

const Premium: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [user, loadingUser] = useAuthState(auth);
  const [showMessage, setShowMessage] = useState(false);

  const showNote =()=>{
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  }

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      p="12px"
      border="1px solid"
      borderColor="gray.300"
    >
      <Flex mb={2}>
        <Icon as={GiCheckedShield} fontSize={26} color="brand.100" mt={2} />
        <Stack spacing={1} fontSize="9pt" pl={2}>
          <Text fontWeight={600}>Reddit Premium</Text>
          <Text>The best Reddit experience, with monthly Coins</Text>
        </Stack>
      </Flex>
      <Button height="30px" bg="brand.100" onClick={showNote}>
        Try Now
      </Button>
      {showMessage && <Text textAlign="center" mt={2} fontSize="10pt" color="red.400">Feature Comming Soon</Text>}
    </Flex>
  );
};

export default Premium;
