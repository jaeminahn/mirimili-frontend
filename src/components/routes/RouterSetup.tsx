import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import NoMatch from "./NoMatch";
import Layout from "./Layout";
import SignUp from "./Auth/SignUp";
import FindPassword from "./Auth/FindPassword";
import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import Questions from "./Questions";
import QuestionPost from "./QuestionPost";
import QuestionNew from "./QuestionNew";
import Users from "./Users";
import SearchResults from "./SearchResults";
import MobileSearchPage from "./MobileSearchPage";
import ProtectedRoute from "./ProtectedRoute";

export default function RouterSetup() {
  return (
    <Routes>
      <Route index element={<Home />} />

      <Route path="/" element={<Layout />}>
        <Route index path="/questions" element={<Questions />} />
        <Route
          index
          path="/questions/new"
          element={
            <ProtectedRoute>
              <QuestionNew />
            </ProtectedRoute>
          }
        />
        <Route index path="/questions/:id" element={<QuestionPost />} />
        <Route index path="/users/mypage" element={<Users />} />
        <Route index path="/search" element={<SearchResults />} />
        <Route path="*" element={<NoMatch />} />
      </Route>

      <Route path="/search-input" element={<MobileSearchPage />} />

      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/logout" element={<Logout />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/findpassword" element={<FindPassword />} />
      <Route path="/auth/*" element={<NoMatch />} />
    </Routes>
  );
}
