import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout(() => {
      navigate("/");
    });
  }, [logout, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-10">
      <p className="text-lg text-gray-700">로그아웃 중입니다...</p>
    </div>
  );
}
