import React from "react";
import { Flex } from "@chakra-ui/react";
import AuthButtons from "./AuthButtons";
import AuthModal from "../../Modal/Auth/AuthModal";
import Icons from "./Icons";
import UserMenu from "./UserMenu";
import { User } from "firebase/auth";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";

type RightContentProps={
  user?: User | null;
};

const RightContent: React.FC<RightContentProps>= ({user})=> {
  const [showMessage, setShowMessage] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState);

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
    <>
      <AuthModal/>
      <Flex justify="center" align="center">
        {user? <Icons/> :<AuthButtons />}
        <UserMenu user={user}/>
      </Flex>
    </>
  );
};
export default RightContent;