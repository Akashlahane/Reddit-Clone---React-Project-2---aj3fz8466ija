/* eslint-disable */
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Community, communityState } from "../atoms/communitiesAtom";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { collection, getDoc, getDocs, doc, increment, writeBatch } from "firebase/firestore";
import { CommunitySnippet } from "../atoms/communitiesAtom";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { useRouter } from "next/router";

const useCommunityData=()=>{
  const [user,loadingUser]=useAuthState(auth);
  const [communityStateValue, setCommunityStateValue]= useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setAuthModalState = useSetRecoilState(authModalState);
  const router= useRouter();
  
  const onJoinorLeaveCommunity= (communityData: Community, isJoined: boolean) =>{
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    setLoading(true);
    if(isJoined){
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

//getting snippe for specific user
  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs= await getDocs(collection(firestore, `users/${user?.uid}/communitySnippets`));
      const snippets= snippetDocs.docs.map((doc)=>({...doc.data()}));

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        snippetsFetched: true,
      }));
    } catch (error: any) {
      console.log("Error getting user snippets", error);
      setError(error.message);
    }
    setLoading(false);
  };
  
 const joinCommunity = async (communityData: Community) => {
  try {
    const batch = writeBatch(firestore);

    const newSnippet: CommunitySnippet = { 
      communityId: communityData.id, 
      imageURL: communityData.imageURL || "",
      isModerator: user?.uid === communityData.creatorId,
    };

    batch.set(
      doc( firestore, `users/${user?.uid}/communitySnippets`,
           communityData.id // will for sure have this value at this point
         ),
      newSnippet
    );

    batch.update(doc(firestore, "communities", communityData.id), {
      numberOfMembers: increment(1),
    });
    // perform batch writes
    await batch.commit();
    // Add current community to snippet
    setCommunityStateValue((prev) => ({
      ...prev,
      mySnippets: [...prev.mySnippets, newSnippet],
    }));

  } catch (error: any) {
    console.log("joinCommunity error", error);
    setError(error.message);
  }
  setLoading(false);
  
};

const leaveCommunity = async (communityId: string) => {
  try {
    const batch = writeBatch(firestore);

    batch.delete(
      doc(firestore, `users/${user?.uid}/communitySnippets/${communityId}`)
    );

    batch.update(doc(firestore, "communities", communityId), {
      numberOfMembers: increment(-1),
    });

    await batch.commit();

    setCommunityStateValue((prev) => ({
      ...prev,
      mySnippets: prev.mySnippets.filter(
        (item) => item.communityId !== communityId
      ),
    }));
  } catch (error: any) {
    console.log("leaveCommunity error", error.message);
    setError(error.message);
  }
  setLoading(false);
};

const getCommunityData = async (communityId: string) => {
  try {
    const communityDocRef = doc(firestore, "communities", communityId as string);
    const communityDoc = await getDoc(communityDocRef);
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: {
        id: communityDoc.id,
        ...communityDoc.data(),
      } as Community,
    }));
  } catch (error: any) {
    console.log("getCommunityData error", error.message);
  }
};


  useEffect(()=>{
    if(!user){
      setCommunityStateValue((prev)=>({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }
    getMySnippets();
  
  },[user])

  useEffect(()=>{
    const {communityId}=router.query;

    if(communityId && !communityStateValue.currentCommunity){
      getCommunityData(communityId as string);
    }
  },[router.query, communityStateValue.currentCommunity])


  return{
    communityStateValue,
    onJoinorLeaveCommunity,
    loading
  }
}

export default useCommunityData;