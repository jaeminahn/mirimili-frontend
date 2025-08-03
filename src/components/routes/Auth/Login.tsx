import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../../../contexts";

type LoginFormType = Record<"tel" | "password", string>;
const initialFormState = { tel: "", password: "" };

const formatTel = (value: string) => {
  const onlyNumbers = value.replace(/\D/g, "");
  if (onlyNumbers.length <= 3) return onlyNumbers;
  if (onlyNumbers.length <= 7)
    return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
  return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(
    3,
    7
  )}-${onlyNumbers.slice(7, 11)}`;
};

export default function Login() {
  const [{ tel, password }, setForm] =
    useState<LoginFormType>(initialFormState);
  const navigate = useNavigate();
  const { login } = useAuth();

  const changed = useCallback(
    (key: keyof LoginFormType) => (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (key === "tel") value = formatTel(value);
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const loginAccount = useCallback(() => {
    const pureTel = tel.replace(/-/g, "");
    login(pureTel, password, () => navigate("/"));
  }, [tel, password, navigate, login]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tel && password) loginAccount();
  };

  useEffect(() => {
    setForm(initialFormState);
  }, []);

  const canProceed = tel.trim() !== "" && password.trim() !== "";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-6">
      <div className="flex flex-col gap-6 px-6 pt-9 pb-9 bg-white rounded-3xl w-[360px]">
        <p className="text-xl font-semibold text-left">로그인</p>

        <div className="flex flex-col gap-0 w-full">
          <input
            type="text"
            name="tel"
            placeholder="전화번호 입력"
            className="w-full p-3 px-4 border-2 border-gray-200 focus:border-emerald-600 focus:outline-none rounded-xl"
            value={tel}
            onChange={changed("tel")}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호 입력"
            className="w-full p-3 px-4 border-2 border-gray-200 focus:border-emerald-600 focus:outline-none rounded-xl mt-6"
            value={password}
            onChange={changed("password")}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex items-center gap-1 text-sm text-black self-center">
          <Icon
            icon="fluent:question-circle-24-filled"
            className="w-4 h-4 text-black"
          />
          <span>비밀번호를 잊으셨나요?</span>
        </div>
      </div>

      <div className="flex items-center justify-between w-[360px]">
        <Link
          to="/auth/signup"
          className="w-[112px] py-3 text-base font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-center rounded-3xl"
        >
          회원가입
        </Link>
        <button
          onClick={loginAccount}
          disabled={!canProceed}
          className={`w-[224px] py-3 text-base font-semibold text-white rounded-3xl ${
            canProceed
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          로그인
        </button>
      </div>
    </div>
  );
}
