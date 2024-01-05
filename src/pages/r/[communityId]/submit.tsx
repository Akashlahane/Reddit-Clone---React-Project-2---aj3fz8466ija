import { Box, Text } from "@chakra-ui/react";
import React from "react";
import PageContent from "@/component/Layout/PageContent";
import NewPostForm from "@/component/Post/PostForm/NewPostForm";
import { auth } from "../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import useCommunityData from "../../../hooks/useCommunityData";
import About from "@/component/Community/About";

const SubmitPostPage: React.FC =()=>{
  const [user] = useAuthState(auth);
  const {communityStateValue}= useCommunityData();

  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        {user && ( <NewPostForm user={user}/> )}
      </>
      <>
        {communityStateValue.currentCommunity && (<About communityData={communityStateValue.currentCommunity}/>)}
      </>
    </PageContent>
 );
}
export default SubmitPostPage;

