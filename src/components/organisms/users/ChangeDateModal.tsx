import { useState } from "react";
import DatePicker from "../../molecules/DatePicker";

type ChangeDateModalProps = {
  closeModal: () => void;
  initialData: {
    service_pfc: string;
    service_cpl: string;
    service_sgt: string;
    service_end: string;
  };
};

export default function ChangeDateModal({
  closeModal,
  initialData,
}: ChangeDateModalProps) {
  const [pfcDate, setPfcDate] = useState(new Date(initialData.service_pfc));
  const [cplDate, setCplDate] = useState(new Date(initialData.service_cpl));
  const [sgtDate, setSgtDate] = useState(new Date(initialData.service_sgt));
  const [endDate, setEndDate] = useState(new Date(initialData.service_end));

  const handleDateChange = () => {
    if (pfcDate > cplDate || cplDate > sgtDate || sgtDate > endDate) {
      return;
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 p-6 mx-2 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-lg font-bold text-gray-700">진급일 및 전역예정일 변경</h2>

        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-600 mb-2">일병</h3>
          <DatePicker date={pfcDate} setDate={setPfcDate} />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-600 mb-2">상병</h3>
          <DatePicker date={cplDate} setDate={setCplDate} />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-600 mb-2">병장</h3>
          <DatePicker date={sgtDate} setDate={setSgtDate} />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-600 mb-2">전역예정일</h3>
          <DatePicker date={endDate} setDate={setEndDate} />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={handleDateChange}
            className={`px-4 py-2 text-sm text-white rounded-lg ${
              pfcDate <= cplDate && cplDate <= sgtDate && sgtDate <= endDate
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!(pfcDate <= cplDate && cplDate <= sgtDate && sgtDate <= endDate)}
          >
            변경
          </button>
        </div>
      </div>
    </div>
  );
}
