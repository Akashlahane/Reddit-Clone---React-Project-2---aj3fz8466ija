/* eslint-disable */
import React, { useRef, useState } from "react";
import { Flex, Icon, Alert, AlertIcon,} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { Timestamp, addDoc, collection, doc, serverTimestamp, updateDoc,} from "firebase/firestore";
import { useRouter } from "next/router";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { firestore, storage } from "../../../firebase/clientApp";
import TabItema from "./TabItem";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import TextInputs from "./TextInputs";
import ImageUpload from "./ImageUpload";
import { Post } from "../../../atoms/postsAtom";
import { Text } from "@chakra-ui/react";
import useSelectFile from "@/hooks/useSelectFile";
//import { v4 as uuidv4 } from 'uuid';

const formTabs: TabItem[]= [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

type NewPostFormProps = {
  //communityId: string;
  communityImageURL?: string;
  user: User;
};


const NewPostForm: React.FC<NewPostFormProps> = ({ user, communityImageURL,}) => {
  const router= useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({title: "", body: "",});
  const{selectedFile, setSelectedFile, onSelectFile}=useSelectFile()
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  //send data to database
  const handleCreatePost = async () => {
    const {communityId}=router.query;
    const newPost: Post = {
      //id: "1",
      //no need to add id a it works without adding id
      communityId: communityId as string,
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
      communityImageURL: communityImageURL || "",
    }

    setLoading(true);

    try{
      const postDocRef = await addDoc(collection(firestore,'posts'), newPost);
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL= await getDownloadURL(imageRef);
        await updateDoc(postDocRef,{imageURL: downloadURL});
      }
      router.back();
    }
    catch(error: any){
        console.log("handleCreatePost error", error.message);
        setError(true);
    }
    setLoading(false);
  };

  const onTextChange = (
   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
   const {target: { name, value },}= event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 
  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item, index) => (
          <TabItema
            key={index}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            selectFileRef={selectFileRef}
            onSelectImage={onSelectFile}
          />
        )}
      </Flex>

      {
        error && (
          <Alert status="error">
            <AlertIcon/>
            <Text mr={2}>Error creating post</Text>
          </Alert>
        )
      }
    </Flex>
  );
};

export default NewPostForm;
