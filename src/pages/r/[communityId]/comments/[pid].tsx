import React, { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../../../../atoms/postsAtom";
import About from "../../../../component/Community/About";
import PageContentLayout from "../../../../component/Layout/PageContent";
import Comments from "../../../../component/Post/Comments";
import PostLoader from "../../../../component/Post/Loader";
import PostItem from "../../../../component/Post/PostItem";
import { auth, firestore } from "../../../../firebase/clientApp";
import useCommunityData from "../../../../hooks/useCommunityData";
import usePosts from "../../../../hooks/usePosts";
import { User } from "firebase/auth";

type PostPageProps = {};

const PostPage: React.FC<PostPageProps> = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { community, pid } = router.query;
  const { communityStateValue } = useCommunityData();
  // Need to pass community data here to see if current post [pid] has been voted on
  const { postStateValue, setPostStateValue, onDeletePost, loading, setLoading, onVote,} = usePosts();

  const fetchPost = async (postId: string) => {
    setLoading(true);
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error: any) {
      console.log("fetchPost error", error.message);
    }
    setLoading(false);
  };

  // Fetch post if not in already in state
  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);

  return (
    <PageContentLayout>
      {/* Left Content */}
      <>
        {loading ? (
          <PostLoader />
        ) : (
          <>
            {postStateValue.selectedPost && ( 
              <PostItem
                post={postStateValue.selectedPost}
                onVote={onVote}
                onDeletePost={onDeletePost}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === postStateValue.selectedPost?.id
                  )?.voteValue
                }
                userIsCreator={
                  user?.uid === postStateValue.selectedPost?.creatorId
                }
              />
              )
            }

            {postStateValue.selectedPost && <Comments
              user={user as User}
              communityId={postStateValue.selectedPost?.communityId as string}
              selectedPost={postStateValue.selectedPost}
            />}

          </>
        )}
      </>
      {/* Right Content */}
      <>
        {communityStateValue.currentCommunity && <About communityData={communityStateValue.currentCommunity} loading={loading}/>}
      </>
    </PageContentLayout>
  );
};
export default PostPage;
