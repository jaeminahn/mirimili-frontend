import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";
import * as U from "../../../utils";

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

  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (key === "tel") value = formatTel(value);
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const navigate = useNavigate();
  const { login } = useAuth();

  const loginAccount = useCallback(() => {
    const pureTel = tel.replace(/-/g, "");
    login(pureTel, password, () => navigate("/"));
  }, [tel, password, navigate, login]);

  useEffect(() => {
    setForm(initialFormState);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-100">
      <div className="flex gap-2">
        <p className="text-2xl text-gray-600 font-get">
          똑똑한 입대, 후회없는 군생활,{" "}
        </p>
        <Link className="text-2xl text-emerald-600 font-get" to="/">
          미리밀리
        </Link>
      </div>
      <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-xl">
        <p className="text-xl font-semibold">로그인</p>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            className="w-64 p-2 px-4 border-2 border-gray-200 focus:border-emerald-600 focus:ring-emerald-600 focus:outline-none rounded-xl"
            name="tel"
            placeholder="전화번호"
            value={tel}
            onChange={changed("tel")}
          />
          <input
            type="password"
            className="w-64 p-2 px-4 border-2 border-gray-200 focus:border-emerald-600 focus:ring-emerald-600 focus:outline-none rounded-xl"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={changed("password")}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            type="submit"
            onClick={loginAccount}
            className="w-64 p-2 text-base text-white rounded-xl bg-emerald-600"
          >
            로그인하기
          </button>
          <Link
            to="/auth/signup"
            className="flex justify-center w-64 p-2 text-base bg-gray-200 rounded-xl"
          >
            회원가입
          </Link>
          <p className="pt-2 text-sm">아이디/비밀번호 찾기</p>
        </div>
      </div>
    </div>
  );
}
