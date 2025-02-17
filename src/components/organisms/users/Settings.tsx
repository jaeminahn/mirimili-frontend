import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeDateModal from "./ChangeDateModal";

const userData = {
  nick: "국방부택시운전사",
  tel: "010-9876-5432",
  service_type: "공군",
  service_start: "2024-05-27",
  service_pfc: "2024-08-01",
  service_cpl: "2025-02-01",
  service_sgt: "2025-08-01",
  service_end: "2026-02-26",
  service_mos: "일반차량운전",
  service_unit: "제15특수전투비행단",
};

export default function Settings() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  const openDateModal = () => setIsDateModalOpen(true);
  const closeDateModal = () => setIsDateModalOpen(false);

  return (
    <div className="flex flex-col lg:w-4/5 gap-4">
      <div className="flex flex-col h-full gap-2 p-6 bg-white rounded-3xl">
        <h2 className="text-xl font-semibold pb-4">프로필 정보</h2>

        <div className="py-4 px-6 border rounded-lg">
          <div className="pb-4 border-b">
            <h3 className="text-sm text-gray-500">닉네임</h3>
            <p className="mt-2">{userData.nick}</p>
          </div>

          <div className="flex justify-between items-center py-4 border-b">
            <div>
              <h3 className="text-sm text-gray-500">비밀번호</h3>
              <p className="mt-2">●●●●●●●</p>
            </div>
            <button
              onClick={openPasswordModal}
              className="w-20 h-10 text-sm rounded-lg bg-gray-100"
            >
              변경
            </button>
          </div>

          <div className="pt-4">
            <h3 className="text-sm text-gray-500">전화번호</h3>
            <p className="mt-2">{userData.tel}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold pt-8 pb-4">복무 정보</h2>

        <div className="py-4 px-6 border rounded-lg">
          <div className="pb-4 border-b">
            <h3 className="text-sm text-gray-500">복무형태</h3>
            <p className="mt-2">{userData.service_type}</p>
          </div>

          <div className="py-4 border-b">
            <h3 className="text-sm text-gray-500">입대일</h3>
            <p className="mt-2">{userData.service_start}</p>
          </div>

          <div className="flex justify-between items-center py-4 border-b">
            <div>
              <h3 className="text-sm text-gray-500">진급일 및 전역예정일</h3>
              <p className="mt-2 flex gap-4 lg:flex-row flex-col">
                <span>일병 {userData.service_pfc}</span>
                <span>상병 {userData.service_cpl}</span>
                <span>병장 {userData.service_sgt}</span>
              </p>
              <p className="mt-4 flex lg:flex-row flex-col">
                <span>전역 {userData.service_end}</span>
              </p>
            </div>
            <button
              onClick={openDateModal}
              className="w-20 h-10 text-sm rounded-lg bg-gray-100"
            >
              변경
            </button>
          </div>

          <div className="py-4 border-b">
            <h3 className="text-sm text-gray-500">특기</h3>
            <p className="mt-2">{userData.service_mos}</p>
          </div>

          <div className="pt-4">
            <h3 className="text-sm text-gray-500">복무부대</h3>
            <p className="mt-2">{userData.service_unit}</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-orange-100 text-orange-600 text-sm rounded-lg flex justify-between items-center">
          <div>
            <p className="font-bold">전화번호·복무형태·입대일·특기·복무부대 변경이 필요하신가요?</p>
            <p className="mt-2">불가피한 사유로 변경이 필요한 경우, 고객센터를 통해 증빙 후 변경할 수 있어요</p>
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg">
            고객센터 바로가기
          </button>
        </div>
      </div>

      {isPasswordModalOpen && <ChangePasswordModal closeModal={closePasswordModal} />}
      {isDateModalOpen && (
        <ChangeDateModal
          closeModal={closeDateModal}
          initialData={{
            service_pfc: userData.service_pfc,
            service_cpl: userData.service_cpl,
            service_sgt: userData.service_sgt,
            service_end: userData.service_end,
          }}
        />
      )}
    </div>
  );
}
