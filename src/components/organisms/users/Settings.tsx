import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeDateModal from "./ChangeDateModal";
import DetailProfilePromptModal from "../../molecules/DetailProfilePromptModal";
import { getJSON } from "../../../api/getAndDel";
import { patchJSON } from "../../../api/postAndPut";

type MemberStatus = "PRE_ENLISTED" | "ENLISTED" | "DISCHARGED";
type MilitaryType = "ARMY" | "NAVY" | "AIR_FORCE";

type MilitaryInfo = {
  type: MilitaryType | null;
  specialtyId: string | null;
  unitId: string | null;
  startDate: string | null;
  privateDate: string | null;
  corporalDate: string | null;
  sergeantDate: string | null;
  dischargeDate: string | null;
};

type MyPageInfo = {
  status: MemberStatus | null;
  nickname: string | null;
  phoneNumber: string | null;
  militaryInfo: MilitaryInfo | null;
};

type ApiEnvelope<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

function formatValue(value: string | null | undefined): string {
  if (!value) return "미설정";
  if (value.trim().length === 0) return "미설정";
  return value;
}

function getMemberStatusLabel(status: MemberStatus | null | undefined): string {
  if (!status) return "미설정";
  if (status === "PRE_ENLISTED") return "입대 전 회원";
  if (status === "ENLISTED") return "현역 군인 회원";
  if (status === "DISCHARGED") return "예비역·민방위 회원";
  return "미설정";
}

function getMilitaryTypeLabel(type: MilitaryType | null | undefined): string {
  if (!type) return "미설정";
  if (type === "ARMY") return "육군";
  if (type === "NAVY") return "해군";
  if (type === "AIR_FORCE") return "공군";
  return "미설정";
}

const normalizePhone = (v: string) =>
  (v ?? "").toString().replace(/[^0-9]/g, "");

export default function Settings() {
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [info, setInfo] = useState<MyPageInfo | null>(null);

  const [openStep1, setOpenStep1] = useState(false);
  const [openStep2, setOpenStep2] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getJSON<ApiEnvelope<MyPageInfo>>("/mypage/info");
        if (!res.ok || !res.data) return;
        const envelope = res.data;
        if (!envelope.success || !envelope.data) return;
        setInfo(envelope.data);
      } catch {
        setInfo(null);
      }
    };
    fetchInfo();
  }, []);

  const memberTypeLabel = getMemberStatusLabel(info?.status);
  const nickname = formatValue(info?.nickname);
  const phoneNumber = formatValue(info?.phoneNumber);

  const rawPhoneNumber = useMemo(() => {
    const raw = normalizePhone(info?.phoneNumber ?? "");
    return raw.length === 11 ? raw : "";
  }, [info?.phoneNumber]);

  const militaryInfo = info?.militaryInfo ?? null;
  const militaryTypeLabel = getMilitaryTypeLabel(militaryInfo?.type ?? null);
  const startDate = formatValue(militaryInfo?.startDate);
  const privateDate = formatValue(militaryInfo?.privateDate);
  const corporalDate = formatValue(militaryInfo?.corporalDate);
  const sergeantDate = formatValue(militaryInfo?.sergeantDate);
  const dischargeDate = formatValue(militaryInfo?.dischargeDate);
  const specialtyLabel = formatValue(militaryInfo?.specialtyId);
  const unitLabel = formatValue(militaryInfo?.unitId);

  const isPreEnlisted = info?.status === "PRE_ENLISTED";

  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  const openDateModal = () => setIsDateModalOpen(true);
  const closeDateModal = () => setIsDateModalOpen(false);

  const openMemberTypeModal = () => setOpenStep1(true);
  const closeStep1 = () => {
    if (updating) return;
    setOpenStep1(false);
  };
  const closeStep2 = () => setOpenStep2(false);

  const onConfirmChangeToEnlisted = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      const res = await patchJSON<ApiEnvelope<null>>("/member/milistatus");
      if (!res.ok || !res.data) {
        alert("회원타입 변경에 실패했습니다.");
        return;
      }
      if (!res.data.success) {
        alert(res.data.message || "회원타입 변경에 실패했습니다.");
        return;
      }
      setInfo((prev) => (prev ? { ...prev, status: "ENLISTED" } : prev));
      setOpenStep1(false);
      setOpenStep2(true);
    } catch {
      alert("회원타입 변경 중 오류가 발생했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  const onProceedDetailSetup = () => {
    setOpenStep2(false);
    navigate("/detail/setup");
  };

  return (
    <div className="flex flex-col lg:w-4/5 gap-4">
      <div className="flex flex-col h-full gap-2 p-6 bg-white rounded-3xl">
        <h2 className="text-xl font-semibold pb-4">회원 정보</h2>

        <div className="py-4 px-6 border rounded-lg">
          <div className="pb-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-sm text-gray-500">회원타입</h3>
              {isPreEnlisted && (
                <button
                  onClick={openMemberTypeModal}
                  className="w-20 h-10 text-sm rounded-lg bg-gray-100"
                >
                  변경
                </button>
              )}
            </div>
            <p className="mt-2">{memberTypeLabel}</p>
          </div>

          <div className="py-4 border-b">
            <h3 className="text-sm text-gray-500">닉네임</h3>
            <p className="mt-2">{nickname}</p>
          </div>

          <div className="flex justify-between items-center py-4 border-b">
            <div>
              <h3 className="text-sm text-gray-500">비밀번호</h3>
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
            <p className="mt-2">{phoneNumber}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold pt-8 pb-4">상세 프로필</h2>

        <div className="py-4 px-6 border rounded-lg">
          <div className="pb-4 border-b">
            <h3 className="text-sm text-gray-500">복무형태</h3>
            <p className="mt-2">{militaryTypeLabel}</p>
          </div>

          <div className="py-4 border-b">
            <h3 className="text-sm text-gray-500">입대일</h3>
            <p className="mt-2">{startDate}</p>
          </div>

          <div className="flex justify-between items-center py-4 border-b">
            <div>
              <h3 className="text-sm text-gray-500">진급일 및 전역(예정)일</h3>
              <p className="mt-2 flex gap-4 lg:flex-row flex-col">
                <span>일병 {privateDate}</span>
                <span>상병 {corporalDate}</span>
                <span>병장 {sergeantDate}</span>
              </p>
              <p className="mt-4 flex lg:flex-row flex-col">
                <span>전역 {dischargeDate}</span>
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
            <p className="mt-2">{specialtyLabel}</p>
          </div>

          <div className="pt-4">
            <h3 className="text-sm text-gray-500">복무부대</h3>
            <p className="mt-2">{unitLabel}</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-orange-100 text-orange-600 text-sm rounded-lg flex justify-between items-center">
          <div>
            <p className="font-bold">
              전화번호·복무형태·입대일·특기·복무부대 변경이 필요하신가요?
            </p>
            <p className="mt-2">
              불가피한 사유로 변경이 필요한 경우, 고객센터를 통해 증빙 후 변경할
              수 있어요
            </p>
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg">
            고객센터 바로가기
          </button>
        </div>
      </div>

      {isPasswordModalOpen && (
        <ChangePasswordModal
          closeModal={closePasswordModal}
          phoneNumber={rawPhoneNumber}
        />
      )}

      {isDateModalOpen && militaryInfo && (
        <ChangeDateModal
          closeModal={closeDateModal}
          initialData={{
            service_pfc: militaryInfo.privateDate ?? "",
            service_cpl: militaryInfo.corporalDate ?? "",
            service_sgt: militaryInfo.sergeantDate ?? "",
            service_end: militaryInfo.dischargeDate ?? "",
          }}
        />
      )}

      {openStep1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeStep1} />
          <div className="relative w-[360px] bg-white rounded-3xl p-6">
            <button
              className="absolute right-4 top-4 text-2xl leading-none"
              aria-label="close"
              onClick={closeStep1}
              disabled={updating}
            >
              ×
            </button>
            <div className="w-full flex flex-col items-center">
              <div className="w-full text-left">
                <h2 className="text-lg font-extrabold text-gray-800 mb-4 leading-snug mt-12">
                  현역 군인 회원으로 변경할까요?
                </h2>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed whitespace-pre-line">
                  {
                    "현역 군인 회원으로 변경되면\n다시 입대 전 회원으로 돌아갈 수 없어요."
                  }
                </p>
              </div>
              <button
                onClick={onConfirmChangeToEnlisted}
                disabled={updating}
                className="w-full h-[48px] rounded-3xl px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-60"
              >
                변경하기
              </button>
            </div>
          </div>
        </div>
      )}

      <DetailProfilePromptModal
        open={openStep2}
        nickname={nickname === "미설정" ? "" : nickname}
        onProceed={onProceedDetailSetup}
        onClose={closeStep2}
      />
    </div>
  );
}
