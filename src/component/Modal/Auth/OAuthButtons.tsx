import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";
import { setDoc } from "firebase/firestore";
import { doc,} from "firebase/firestore"; 
import { useEffect } from "react";
import { User } from "firebase/auth";

const OAuthButtons: React.FC= ()=>{
  const [signInWithGoogle, userCred , loading, error] = useSignInWithGoogle(auth);
  const createUserDocument = async(user: User)=>{
    const userDocRef= doc(firestore, "users", user.uid);
    await setDoc(userDocRef,JSON.parse(JSON.stringify(user)));
  };

  useEffect(()=>{
    if(userCred){
      createUserDocument(userCred.user);
    }
  }, [userCred])

  return (
    <Flex direction="column" mb={4} width="100%">
      <Button
        variant="oauth"
        mb={2}
        onClick={() => signInWithGoogle()}
        isLoading={loading}
      >
        <Image src="/images/googlelogo.png" alt="googlelogo" height="20px" mr={4} />
        Continue with Google
      </Button>
      {/*<Button variant="oauth">Some Other Provider</Button>*/}
      {error && typeof error === 'string' &&( //taken from chat gpt
        <Text textAlign="center" fontSize="10pt" color="red" mt={2}>
          {error}
        </Text>
      )}
    </Flex>
  );
};
export default  OAuthButtons;

