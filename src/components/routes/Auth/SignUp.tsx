import { ChangeEvent, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";

type SignUpFormType = Record<"email" | "password" | "confirmPassword", string>;
const initialFormState = { email: "", password: "", confirmPassword: "" };

export default function SignUp() {
  const [{ email, password, confirmPassword }, setForm] =
    useState<SignUpFormType>(initialFormState);
  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((obj) => ({ ...obj, [key]: e.target.value }));
    },
    []
  );

  const navigate = useNavigate();
  const { signup } = useAuth();
  const createAccount = useCallback(() => {
    console.log(email, password, confirmPassword);
    if (password === confirmPassword) {
      signup(email, password, () => navigate("/"));
    } else alert("비밀번호가 일치하지 않습니다!");
  }, [email, password, confirmPassword, navigate, signup]);

  return (
    <div className="flex w-screen h-screen">
      <div className="flex items-center justify-center w-1/2 h-full bg-emerald-600">
        <Link className="text-white font-get text-9xl" to="/">
          미리밀리
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center w-1/2 gap-4">
        <p className="text-5xl font-get">회원가입</p>
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
        <input
          type="text"
          className="w-64 p-2 border-2 border-gray-500 rounded-xl"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={changed("confirmPassword")}
        />
        <button
          type="submit"
          onClick={createAccount}
          className="w-64 p-2 text-lg font-semibold text-white rounded-xl bg-emerald-600"
        >
          계정 만들기
        </button>
        <div className="text-gray-400">
          이미 계정이 있다면?{" "}
          <Link to="/auth/login" className="text-gray-900">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
