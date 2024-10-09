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
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Link className="text-emerald-600 font-get text-9xl" to="/">
        미리밀리
      </Link>
      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          className="w-64 p-2 border-2 border-gray-500 rounded-xl"
          name="email"
          placeholder="이메일"
          value={email}
          onChange={changed("email")}
        />
        <input
          type="text"
          className="w-64 p-2 border-2 border-gray-500 rounded-xl"
          name="password"
          placeholder="비밀번호"
          value={password}
          onChange={changed("password")}
        />
        <button
          type="submit"
          onClick={loginAccount}
          className="w-64 p-2 text-lg font-semibold text-white rounded-xl bg-emerald-600"
        >
          로그인
        </button>
        <div className="text-gray-400">
          계정이 없다면?{" "}
          <Link to="/auth/signup" className="text-gray-900">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
