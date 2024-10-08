import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import QnAList from "./components/organisms/QnAList";
import Header from "./components/organisms/Header";
import CommunityList from "./components/organisms/CommunityList";
import BestList from "./components/organisms/BestList";
import ContentList from "./components/organisms/ContentList";
import PostItem from "./components/molecules/PostItem";
import MainContents from "./components/organisms/MainContents";
import SideContents from "./components/organisms/SideContents";
import Home from "./components/routes/Home";
import RouterSetup from "./components/routes/RouterSetup";
import Footer from "./components/organisms/Footer";
import { AuthProvider } from "./contexts";

function App() {
  return (
    <div className="font-nsk">
      <BrowserRouter>
        <AuthProvider>
          <RouterSetup />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
