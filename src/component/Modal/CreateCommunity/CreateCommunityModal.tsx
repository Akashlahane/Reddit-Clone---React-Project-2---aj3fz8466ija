import React, { useState } from "react";
import {Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Stack, Checkbox} from "@chakra-ui/react";
import { Text, Box, Flex, Icon} from "@chakra-ui/react";
import {BsFillEyeFill, BsFillPersonFill} from "react-icons/bs";
import {HiLockClosed} from "react-icons/hi";
import { Input } from "@chakra-ui/react";
import { doc, serverTimestamp, runTransaction } from "firebase/firestore"; 
import { auth, firestore } from "../../../firebase/clientApp";
import {useAuthState} from "react-firebase-hooks/auth";
import { communityState } from "@/atoms/communitiesAtom";  //a1
import { useRouter } from "next/router"; //a1
import { useSetRecoilState } from "recoil"; //a1
import useDirectory from "@/hooks/useDirectory";

type CreateCommunityModalProps ={
  open: boolean;
  handleClose: ()=> void;
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({open, handleClose})=>{
  const [user]=useAuthState(auth);
  const [communityName, setCommunityName]= useState("");
  const [charsRemaining, setCharsRemaining]= useState(21);
  const [communityType, setCommunityType]= useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setSnippetState = useSetRecoilState(communityState);  //a1
  const router = useRouter(); //a1
  const {toggleMenuOpen}=useDirectory();

  if(error){
    setError("");
  }

  const handleChange= (event: React.ChangeEvent<HTMLInputElement>)=>{
    // recalculate how many chars remaining
    if(event.target.value.length>21) return ; 
    setCommunityName(event.target.value);
    setCharsRemaining(21-event.target.value.length);
  }

  const onCommunityTypeChange= (event: React.ChangeEvent<HTMLInputElement>)=>{
    setCommunityType(event.target.name);
  }

  const handleCreateCommunity = async () => {
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName) || communityName.length < 3) {
      setError( "Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores.");
      return;
    }
    setLoading(true);
    // check community name is not taken
    try{
      const communityDocRef= doc(firestore, 'communities', communityName);
      await runTransaction(firestore, async (transaction)=>{
        const communityDoc = await transaction.get(communityDocRef);
        //check if community exist in database
        if(communityDoc.exists()){
          throw new Error(`Sorry, /r${communityName} is taken. Try another.`);
        }

        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`,communityName),{
          communityId: communityName,
          isModerator: true
        })
      })

      const snip={                    //a1
        communityId: communityName,
        isModerator: true,
        imageURL: "",
      }
    
      setSnippetState((prev) => ({                    //a1
        ...prev,                                     //a2
        mySnippets:  [...prev.mySnippets, snip],    //a3
      }));                                        //a4
      handleClose();                             //a5
      router.push(`r/${communityName}`);       //a6
      toggleMenuOpen();
    }
    catch(error: any){
      console.log("handle create community error",error);
      setError(error.message)
    }
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" flexDirection="column" fontSize={15} padding={3}>Create a community </ModalHeader>
          <Box pl={3} pr={4}>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Text fontWeight={600} fontSize={15} > Name</Text> 
              <Text fontSize={11} color="gray.500">
                  Community names including capitalization can not be changed  
              </Text>
              <Text position="relative" top="28px" left="10px" width="20px" color="gray.500">r/</Text>
              <Input position="relative" value={communityName} size="sm" pl="22px" onChange={handleChange} />
              <Text fontSize="9pt" color={charsRemaining===0 ? "red": "gray.500"}>
                {charsRemaining} Characters remaining
              </Text>
              <Text fontSize="9pt" color="red" pt={1}>
                {error}
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                </Text>
                <Stack spacing={2}>

                  <Checkbox name="public" isChecked={communityType==="public"} onChange={onCommunityTypeChange}>
                    <Flex align="center">
                      <Icon as={BsFillPersonFill} color="gray.500" mr={2}/>
                      <Text fontSize="10pt" mr={1}>
                        Public  
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Anyone can view, post, and comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>

                  <Checkbox name="resricted" isChecked={communityType==="resricted"} onChange={onCommunityTypeChange}>
                    <Flex align="center">
                      <Icon as={BsFillEyeFill} color="gray.500" mr={2}/>
                      <Text fontSize="10pt" mr={1}>
                        Resricted 
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Anyone can view this community but only approved users can post
                      </Text>
                    </Flex> 
                  </Checkbox>

                  <Checkbox name="protected" isChecked={communityType==="protected"} onChange={onCommunityTypeChange}>
                    <Flex align="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={2}/>
                      <Text fontSize="10pt" mr={1}>
                        Protected
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Only approved users can view and submit to this community
                      </Text>
                    </Flex> 
                  </Checkbox>
               </Stack>
              </Box>
            </ModalBody>
          </Box>
          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button variant="outline" height="30px" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button height="30px" onClick={handleCreateCommunity} isLoading={loading}>Create Community</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateCommunityModal;
