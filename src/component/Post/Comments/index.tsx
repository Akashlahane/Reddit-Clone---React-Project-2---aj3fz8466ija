/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text,} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {collection, doc, getDocs, increment, orderBy, query, serverTimestamp, where, writeBatch,} from "firebase/firestore";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { Post, postState } from "../../../atoms/postsAtom";
import { firestore } from "../../../firebase/clientApp";
import CommentItem from "./CommentItem";
import CommentInput from "./Input";
import { Timestamp } from "firebase/firestore";
import { Comment } from "./CommentItem";

type CommentsProps = {
  user?: User | null;
  selectedPost: Post | null;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({user, selectedPost, communityId,}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment []>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const [loadingDeleteId, setLoadingDeleteId]=useState('');
  const setAuthModalState = useSetRecoilState(authModalState);
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async (comment: string) => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);
      // Create comment document
      const commentDocRef = doc(collection(firestore, "comments"));
      const newComment: Comment={
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        communityId,
        text: commentText,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        createdAt: serverTimestamp() as Timestamp,
      } ;

      batch.set(commentDocRef, newComment);
      newComment.createdAt ={seconds: Date.now()/1000} as Timestamp;
      const postDocRef =doc(firestore, "posts", selectedPost?.id!)
      // Update post numberOfComments
      batch.update(postDocRef, {numberOfComments: increment(1),});
      await batch.commit();
      setCommentText("");
      setComments((prev) => [newComment,...prev]);
      // Fetch posts again to update number of comments on client side
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error: any) {
      console.log("onCreateComment error", error.message);
    }
    setCreateLoading(false);
  };

  const onDeleteComment = async (comment: Comment) => {
    if (!comment || !comment.id) {
      console.error("Invalid comment or comment ID:", comment);
      return;
    }
    setLoadingDeleteId(comment.id);
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(firestore, 'comments', comment.id);
      batch.delete(commentDocRef);
      const postDocRef = doc(firestore, 'posts', selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });
      await batch.commit();
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
      // return true;
    } catch (error: any) {
      console.log("Error deletig comment", error);
      // return false;
    }
    setLoadingDeleteId(comment.id);("");
  };

  const getPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error: any) {
      console.log("getPostComments error", error.message);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if(!selectedPost) return;
      getPostComments();
  }, [selectedPost]);

  return (
    <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        {!fetchLoading && (<CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          createLoading={createLoading}
          user={user}
          onCreateComment={onCreateComment}
        />)}
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {!!comments.length ? (                              
              <>
                {comments.map((item: Comment) => (
                 <CommentItem
                    key={item.id}
                    comment={item}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={loadingDeleteId===item.id}
                    userId={user?.uid}
                />
                
                ))}
              </>
            ) : (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
/* eslint-disable */
