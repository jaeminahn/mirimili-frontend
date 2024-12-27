import React from "react";
import Profile from "./users/Profile";
import Notifications from "./users/Notifications";
import ScrapedPosts from "./users/ScrapedPosts";
import QuestionsAnswers from "./users/QuestionsAnswers";
import Community from "./users/Community";
import Settings from "./users/Settings";
import Support from "./users/Support";

interface UsersContentProps {
  activeMenu: string;
}

const UsersContent: React.FC<UsersContentProps> = ({ activeMenu }) => {
  const renderContent = () => {
    switch (activeMenu) {
      case "프로필":
        return <Profile />;
      case "알림":
        return <Notifications />;
      case "스크랩한 글":
        return <ScrapedPosts />;
      case "질문&답변":
        return <QuestionsAnswers />;
      case "커뮤니티":
        return <Community />;
      case "설정":
        return <Settings />;
      case "고객센터":
        return <Support />;
      default:
        return <div>NO MATCH</div>;
    }
  };

  return renderContent();
};

export default UsersContent;
