import { FaBell } from "react-icons/fa6";
import { BsFillChatDotsFill } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi2";
import { PiNotebookFill } from "react-icons/pi";

export const sideBarItems = [
    {
        title: "Activity",
        icon: <FaBell/>,
        link: "/quiz",
    },
    {
        title: "Chat",
        icon: <BsFillChatDotsFill/>,
        link: "/home",
    },
    {
        title: "Class",
        icon: <HiUserGroup/>,
        link: "/quiz",
    },
    {
        title: "Quiz",
        icon: <PiNotebookFill/>,
        link: "/home",
    },
    
];