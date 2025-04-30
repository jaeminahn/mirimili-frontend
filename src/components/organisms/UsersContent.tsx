import React from "react";
import Activities from "./users/Activities";
import Notifications from "./users/Notifications";
import ScrapedPosts from "./users/ScrapedPosts";
import Settings from "./users/Settings";
import Logout from "./users/logout";

interface UsersContentProps {
  activeMenu: string;
}

const UsersContent: React.FC<UsersContentProps> = ({ activeMenu }) => {
  const renderContent = () => {
    switch (activeMenu) {
      case "내 활동":
        return <Activities />;
      case "알림":
        return <Notifications />;
      case "스크랩":
        return <ScrapedPosts />;
      case "설정":
        return <Settings />;
      case "로그아웃":
        return <Logout />;
      default:
        return <>"NO MATCH"</>;
    }
  };

  return renderContent();
};

export default UsersContent;
