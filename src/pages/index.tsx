/* eslint-disable */
import { useEffect } from "react";
import { Stack } from "@chakra-ui/react";
import { collection, getDocs, query } from "firebase/firestore";
import type { NextPage } from "next";
import PageContentLayout from "../component/Layout/PageContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import usePosts from "../hooks/usePosts";
import { Post } from "../atoms/postsAtom";
import CreatePostLink from "../component/Community/CreatePostLink";
import PostLoader from "../component/Post/Loader";
import PostItem from "../component/Post/PostItem";
import Recommendations from "../component/Community/Recommendations";
import Premium from "../component/Community/Premium";
import OrderPostby from "@/component/Post/OrderPostby";
import { useState } from "react";
import { postOrderState } from "@/atoms/postOrder";
import { useRecoilState } from "recoil";
//import PersonalHome from "../component/Community/PersonalHome";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onVote, onSelectPost, onDeletePost, loading,setLoading,} = usePosts();
  const [sortedPosts, setSortedPosts] = useState<Post[]>([]);
  const [order, setOrder]=useRecoilState(postOrderState);

  const getNoUserHomePosts = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        // Remove the limit to fetch all posts
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSortedPosts(posts as Post[]); // Store all posts in a separate state
    } catch (error: any) {
      console.log("getNoUserHomePosts error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!loadingUser) {  //if (!user && !loadingUser)
      getNoUserHomePosts();
    }
  }, [user, loadingUser]);

  useEffect(() => {
    // Apply sorting when the 'order' value changes
    const sorted = [...sortedPosts].sort((a, b) => {
      if (order) {
        // Sort by voteStatus in descending order
        return b.voteStatus - a.voteStatus;
      } else {
        // Sort by createdAt in descending order
        return b.createdAt.seconds - a.createdAt.seconds;
      }
    });

    setPostStateValue((prev: any) => ({
      ...prev,
      posts: sorted,
    }));
  }, [order, sortedPosts]);

  return (
    <PageContentLayout>
      <>
        <CreatePostLink />
        <OrderPostby order={order} setOrder={setOrder}/>
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
      <Stack spacing={5} position="sticky" top="50px">
         <Recommendations />
         <Premium />
         {/*<PersonalHome />*/}
      </Stack>
    </PageContentLayout>
  );
};
export default Home;

// <Stack spacing={5} position="sticky" top="14px">