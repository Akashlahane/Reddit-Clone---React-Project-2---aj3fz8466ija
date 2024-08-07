/* eslint-disable */
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import { DirectoryMenuItem, defaultMenuItem, directoryMenuState,} from "../atoms/directoryMenuAtom";
import { FaReddit } from "react-icons/fa";
//import { TiHome } from "react-icons/ti";

const useDirectory = () => {
  const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState);
  const router = useRouter();
  const communityStateValue = useRecoilValue(communityState);
 
  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));
    router?.push(menuItem.link);
    if (directoryState.isOpen) {
      toggleMenuOpen();
    }

  };

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen,
    }));
  };

  useEffect(() => {
    if(router.pathname==="/"){    //when returning to home home not shown in community
      return;                     //because there was no home community it was considering older current community        
    }
    const {currentCommunity}= communityStateValue;
    if (currentCommunity) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${currentCommunity.id}`,
          link: `r/${currentCommunity.id}`,
          icon: FaReddit,
          iconColor: "blue.500",
          imageURL: currentCommunity.imageURL,
        },
      }));
      return;
    }
  }, [communityStateValue.currentCommunity]);
  return { directoryState, onSelectMenuItem, toggleMenuOpen };
};
export default useDirectory;
/* eslint-disable */
