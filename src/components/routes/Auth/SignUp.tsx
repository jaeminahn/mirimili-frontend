import { ChangeEvent, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";

type SignUpFormType = Record<
  | "email"
  | "password"
  | "confirmPassword"
  | "name"
  | "tel"
  | "nick"
  | "birth"
  | "serviceType"
  | "serviceStart"
  | "serviceEnd"
  | "serviceUnit"
  | "serviceMos",
  string
>;
const initialFormState = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  tel: "",
  nick: "",
  birth: "",
  serviceType: "",
  serviceStart: "",
  serviceEnd: "",
  serviceUnit: "",
  serviceMos: "",
};

const serviceTypeCodeLabel = [
  {
    code: "0",
    label: "육군",
  },
  {
    code: "1",
    label: "해군",
  },
  {
    code: "2",
    label: "공군",
  },
  {
    code: "3",
    label: "해병대",
  },
];

export default function SignUp() {
  const [
    {
      email,
      password,
      confirmPassword,
      name,
      tel,
      nick,
      birth,
      serviceType,
      serviceStart,
      serviceEnd,
      serviceUnit,
      serviceMos,
    },
    setForm,
  ] = useState<SignUpFormType>(initialFormState);

  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((obj) => ({ ...obj, [key]: e.target.value }));
    },
    []
  );

  const serviceTypeLabel = serviceTypeCodeLabel.map((item, idx) => (
    <label className="flex items-center gap-2" key={idx}>
      <input
        type="radio"
        name="serviceType"
        value={item.code}
        checked={serviceType === item.code}
        onChange={changed("serviceType")}
        className="text-emerald-600"
      />
      {item.label}
    </label>
  ));

  const navigate = useNavigate();
  const { signup } = useAuth();
  const createAccount = useCallback(() => {
    if (
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      name === "" ||
      tel === "" ||
      nick === "" ||
      birth === "" ||
      serviceType === "" ||
      serviceStart === "" ||
      serviceEnd === "" ||
      serviceUnit === "" ||
      serviceMos === ""
    )
      alert("형식을 모두 작성해주세요!");
    if (password === confirmPassword) {
      signup(email, password);
    } else alert("비밀번호가 일치하지 않습니다!");

    console.log(
      email,
      password,
      confirmPassword,
      name,
      tel,
      nick,
      birth,
      serviceType,
      serviceStart,
      serviceEnd,
      serviceUnit,
      serviceMos
    );
  }, [
    email,
    password,
    confirmPassword,
    name,
    tel,
    nick,
    birth,
    serviceType,
    serviceStart,
    serviceEnd,
    serviceUnit,
    serviceMos,
    navigate,
    signup,
  ]);

  return (
    <div className="flex w-screen h-screen">
      <div className="flex items-center justify-center w-1/2 h-full bg-emerald-600">
        <Link className="text-white font-get text-9xl" to="/">
          미리밀리
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center w-1/2 gap-4 p-10 overflow-y-scroll">
        <p className="mt-64 text-5xl font-get">회원가입</p>
        <input
          type="email"
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
        <input
          type="text"
          className="w-64 p-2 border-2 border-gray-500 rounded-xl"
          name="name"
          placeholder="성명"
          value={name}
          onChange={changed("name")}
        />
        <input
          type="tel"
          className="w-64 p-2 border-2 border-gray-500 rounded-xl"
          name="tel"
          placeholder="전화번호"
          value={tel}
          onChange={changed("tel")}
        />
        <input
          type="text"
          className="w-64 p-2 border-2 border-gray-500 rounded-xl"
          name="nick"
          placeholder="닉네임"
          value={nick}
          onChange={changed("nick")}
        />
        <input
          type="date"
          className="w-64 p-2 border-2 border-gray-500 rounded-xl"
          name="birth"
          placeholder="생년월일"
          value={birth}
          onChange={changed("birth")}
        />
        <div className="w-64 p-2 border-2 border-gray-500 rounded-xl">
          <p className="mb-2 text-gray-500">군복무 종류</p>
          <div className="flex gap-4">{serviceTypeLabel}</div>
        </div>
        <input
          type="date"
          className="w-64 p-2 border-2 border-gray-500 rounded-xl"
          name="serviceStart"
          placeholder="군입대일"
          value={serviceStart}
          onChange={changed("serviceStart")}
        />
        <input
          type="date"
          className="w-64 p-2 border-2 border-gray-500 rounded-xl"
          name="serviceEnd"
          placeholder="군전역일"
          value={serviceEnd}
          onChange={changed("serviceEnd")}
        />
        <input
          type="text"
          className="w-64 p-2 border-2 border-gray-500 rounded-xl"
          name="serviceUnit"
          placeholder="군 부대"
          value={serviceUnit}
          onChange={changed("serviceUnit")}
        />
        <input
          type="text"
          className="w-64 p-2 border-2 border-gray-500 rounded-xl"
          name="serviceMos"
          placeholder="군 특기"
          value={serviceMos}
          onChange={changed("serviceMos")}
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
