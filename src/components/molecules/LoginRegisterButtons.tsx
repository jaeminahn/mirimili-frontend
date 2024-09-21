export default function LoginRegisterButtons() {
  return (
    <div className="flex gap-2">
      <button className="px-4 text-sm text-white rounded-xl bg-emerald-600">
        로그인
      </button>
      <button className="px-4 text-sm bg-gray-100 rounded-xl">회원가입</button>
    </div>
  );
}
