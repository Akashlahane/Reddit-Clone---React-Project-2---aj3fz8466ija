import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";
import { Community, communityState } from "../../../atoms/communitiesAtom";
import About from "../../../component/Community/About";
import CommunityNotFound from "../../../component/Community/CommunityNotFound";
import CreatePostLink from "../../../component/Community/CreatePostLink";
import Header from "../../../component/Community/Header";
import PageContent from "../../../component/Layout/PageContent";
import Posts from "../../../component/Post/Posts";
import { auth, firestore } from "../../../firebase/clientApp";

interface CommunityPageProps {
  communityData: Community;
}

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
  const [user, loadingUser] = useAuthState(auth);
  const setCommunityStateValue  =useSetRecoilState(communityState);
  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, [communityData]);

  if(!communityData){
    return <CommunityNotFound/>;
 }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        {/* Left Content */}
        <>
          <CreatePostLink />
          <Posts
            communityData={communityData}
           // userId={user?.uid}
           // loadingUser={loadingUser}
          />
        </>
        {/* Right Content */}
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  );
};

export default CommunityPage;

export async function getServerSideProps(context: GetServerSidePropsContext){
  // get community data and pass it to client
  try{
      const communityDocRef= doc(firestore,'communities',context.query.communityId as string);
      const communityDoc=await getDoc(communityDocRef);
      return{
        props:{
            communityData: communityDoc.exists() ? JSON.parse(
                safeJsonStringify({id: communityDoc.id, ...communityDoc.data(),}
            )): "",
        },
      }
  }
  catch(error){
    console.log("getServerSideProps error",error);
  }
}

