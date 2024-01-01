/* eslint-disable */
import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,ModalCloseButton,} from '@chakra-ui/react';
import { authModalState } from '../../../atoms/authModalAtom';
import { useRecoilState } from "recoil";
import { Flex, Text } from '@chakra-ui/react';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';
import { useEffect } from 'react';
import ResetPassword from './ResetPassword';

const AuthModal:React.FC=()=>{
  const [modalState, setModalState] = useRecoilState(authModalState);  
  const [user]= useAuthState(auth);
  const handleClose = () =>
    setModalState((prev) => ({
      ...prev,
      open: false,
  }));

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalState.view === "login" && "Login"}
            {modalState.view === "signup" && "Sign Up"}
            {modalState.view === "resetPassword" && "Reset Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={6}
          >
            <Flex direction="column" alignItems="center" justifyContent="center" width="70%">
              {modalState.view === "login" || modalState.view === "signup" ? (
                <>
                  <OAuthButtons/>
                  <Text color="gray.500" fontWeight={700}>OR</Text>
                  <AuthInputs/>
                </>
                ): 
                (
                   <ResetPassword/>
                )
              }
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AuthModal;



