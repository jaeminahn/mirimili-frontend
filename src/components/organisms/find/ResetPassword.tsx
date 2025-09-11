import { useEffect, useState, ChangeEvent } from "react";

type Props = {
  password: string;
  changed: (key: "password") => (e: ChangeEvent<HTMLInputElement>) => void;
  setCanProceed: (value: boolean) => void;
  step: number;
};

export default function ResetPassword({
  password,
  changed,
  setCanProceed,
  step,
}: Props) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

  useEffect(() => {
    setIsPasswordValid(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,16}$/.test(password)
    );
    setIsPasswordConfirmed(password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    if (step !== 2) return;
    setCanProceed(isPasswordValid && isPasswordConfirmed);
  }, [isPasswordValid, isPasswordConfirmed, step, setCanProceed]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col px-6 py-9 bg-white rounded-3xl w-[360px]">
        <h2 className="mb-3 text-lg font-bold text-gray-700">
          비밀번호 재설정
        </h2>

        <div className="mb-4">
          <div className="relative flex flex-row items-center justify-between">
            <input
              type="password"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="새 비밀번호 입력"
              value={password}
              onChange={changed("password")}
            />
          </div>
          {password && (
            <div
              className={`mt-2 ml-2 text-xs ${
                isPasswordValid ? "text-green-500" : "text-orange-500"
              }`}
            >
              {isPasswordValid
                ? "사용할 수 있는 비밀번호예요"
                : "8~16자, 영문·숫자·특수문자를 포함해야 해요"}
            </div>
          )}
        </div>

        <div className="mb-2">
          <input
            type="password"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && (
            <div
              className={`mt-2 ml-2 text-xs ${
                isPasswordConfirmed ? "text-green-500" : "text-orange-500"
              }`}
            >
              {isPasswordConfirmed
                ? "비밀번호가 일치해요"
                : "비밀번호가 일치하지 않아요"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
