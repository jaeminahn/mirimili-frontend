import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";
import * as U from "../../../utils";

type LoginFormType = Record<"email" | "password", string>;
const initialFormState = { email: "", password: "" };

export default function Login() {
  const [{ email, password }, setForm] =
    useState<LoginFormType>(initialFormState);
  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((obj) => ({ ...obj, [key]: e.target.value }));
    },
    []
  );

  const navigate = useNavigate();
  const { login } = useAuth();
  const loginAccount = useCallback(() => {
    login(email, password, () => navigate("/"));
  }, [email, password, navigate, login]);

  useEffect(() => {
    U.readObjectP<LoginFormType>("user")
      .then((user) => {
        if (user) setForm(user);
      })
      .catch((e) => {});
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
            name="email"
            placeholder="이메일"
            value={email}
            onChange={changed("email")}
          />
          <input
            type="text"
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
