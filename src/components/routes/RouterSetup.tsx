import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import NoMatch from "./NoMatch";
import Layout from "./Layout";
import SignUp from "./Auth/SignUp";
import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import Questions from "./Questions";

export default function RouterSetup() {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/" element={<Layout />}>
        <Route index path="/questions" element={<Questions />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/logout" element={<Logout />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/*" element={<NoMatch />} />
    </Routes>
  );
}
