import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";

export type Post = {
  id?: string; 
  communityId: string;
  creatorId: string;
  creatorDisplayName: string; 
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  imageURL?: string;
  communityImageURL?: String,
  createdAt: Timestamp;
  currentUserVoteStatus?: {  
    id: string;
    voteValue: number;
  };
  postIdx?: number;
  editedAt?: Timestamp;
};

export type PostVote = {
  id?: string;
  postId?: string;
  communityId: string;
  voteValue: number;
};

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[];
}

export const defaultPostState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes:[],
};

export const postState = atom<PostState>({
  key: "postState",
  default: defaultPostState,
});




