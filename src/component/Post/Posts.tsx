/* eslint-disable */
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where,} from "firebase/firestore";
import { Community } from "../../atoms/communitiesAtom";
import { auth, firestore } from "../../firebase/clientApp";
import { useRouter } from "next/router";
import usePosts from "../../hooks/usePosts";
import { Post } from "@/atoms/postsAtom";
import PostItem from "./PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack } from "@chakra-ui/react";
import PostLoader from "./Loader";

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({communityData,}) => {
  const [user]=useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost} = usePosts();

  const getPosts = async () => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  
  }, [communityData]);

  return (
    <> 
      {loading ? (<PostLoader/>) :
       <Stack> 
          {postStateValue.posts.map((item)=>(
          <PostItem
          key={item.id}
          post={item}
          userIsCreator={user?.uid === item.creatorId}
          userVoteValue={postStateValue.postVotes.find((vote)=>vote.postId==item.id)?.voteValue}
          onVote={onVote}
          onSelectPost={onSelectPost}
          onDeletePost={onDeletePost}
          />
          ))}

        </Stack>
      }
    </>
  );
};
export default Posts;
