/* eslint-disable */
import { useEffect } from "react";
import { Stack } from "@chakra-ui/react";
import { collection, getDocs, limit, onSnapshot, orderBy, query, where,} from "firebase/firestore";
import type { NextPage } from "next";
import PageContentLayout from "../component/Layout/PageContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import usePosts from "../hooks/usePosts";
import { Post, PostVote } from "../atoms/postsAtom";
import CreatePostLink from "../component/Community/CreatePostLink";
import PostLoader from "../component/Post/Loader";
import PostItem from "../component/Post/PostItem";
import useCommunityData from "@/hooks/useCommunityData";
import Recommendations from "../component/Community/Recommendations";
import Premium from "../component/Community/Premium";
//import PersonalHome from "../component/Community/PersonalHome";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onVote, onSelectPost, onDeletePost, loading,setLoading,} = usePosts();
  const {communityStateValue}=useCommunityData();

  const getNoUserHomePosts = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(15)
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    
      setPostStateValue((prev: any) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getNoUserHomePosts error", error);
    }
    setLoading(false);
  };

  // const getUserHomePosts = async () => {
  //   setLoading(true);
  //   try {
  //     // User has joined communities
  //     if (communityStateValue.mySnippets.length) {
  //       const myCommunityIds = communityStateValue.mySnippets.map(
  //         (snippet) => snippet.communityId
  //       );
        
  //       const postQuery=query(
  //       collection(firestore, "posts"),
  //       where("communityId", "in" , myCommunityIds),
  //       limit(10)
  //       );

  //       const postDocs= await getDocs(postQuery);
  //       const posts = postDocs.docs.map((doc) => ({
  //         id: doc.id,
  //          ...doc.data(),
  //       })) ;

  //       setPostStateValue((prev) => ({
  //         ...prev,
  //         posts: posts as Post[],
  //       }));   
  //     }
  //     else {
  //         getNoUserHomePosts();}
  //   } catch (error: any) {
  //     console.log("getUserHomePosts error", error.message);
  //   }
  //   setLoading(false);
  // };

  const getUserPostVotes = async () => {
    try{
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      ); 
      const  postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((postVote) => ({
        id: postVote.id,
        ...postVote.data(),
      }));
  
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
      
    }
    catch(error: any){
      console.log("getUserPostVots errro", error);
    }
  };

    
  // useEffect(() => {
  //   if (communityStateValue.snippetsFetched) getUserHomePosts();
  //   // if (user) {getUserHomePosts();}
  // }, [communityStateValue.snippetsFetched]);


  useEffect(() => {
    if (!loadingUser) {  //if (!user && !loadingUser)
      getNoUserHomePosts();
    }
  }, [user, loadingUser]);

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();
    return ()=>{
      setPostStateValue((prev)=>({
            ...prev,
            postVotes: [],
      }))
    }
  }, [postStateValue.posts, user?.uid]);

  return (
    <PageContentLayout>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post: Post, index) => (
              <PostItem
                key={post.id}
                post={post}
                onVote={onVote}
                onDeletePost={onDeletePost}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                onSelectPost={onSelectPost}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={5} position="sticky" top="14px">
         <Recommendations />
         <Premium />
         {/*<PersonalHome />*/}
      </Stack>
    </PageContentLayout>
  );
};

export default Home;
