import { useEffect, useState, ChangeEvent } from "react";
import SelectModal from "../SelectModal";
import serviceMos from "../../../data/serviceMos.json";
import serviceUnit from "../../../data/serviceUnit.json";
import { MosAndUnitRecord } from "../../../data/data";
import { Icon } from "@iconify/react";
import { DetailProfileForm } from "../../routes/DetailProfile";

type Props = {
  form: DetailProfileForm;
  setField: <K extends keyof DetailProfileForm>(
    k: K,
    v: DetailProfileForm[K]
  ) => void;
  setCanProceed: (v: boolean) => void;
};

export default function SetMosAndUnit({
  form,
  setField,
  setCanProceed,
}: Props) {
  const [isNoMos, setIsNoMos] = useState(false);
  const [isMosModalOpen, setIsMosModalOpen] = useState(false);
  const [selectedMosId, setSelectedMosId] = useState<number>(
    form.specialtyId ?? -1
  );
  const [isNoUnit, setIsNoUnit] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<number>(
    form.unitId ?? -1
  );

  const toggleMosModal = () => setIsMosModalOpen(!isMosModalOpen);
  const handleMosSelect = (mos: MosAndUnitRecord) => {
    setSelectedMosId(mos.id);
    setIsMosModalOpen(false);
  };

  const handleServiceMosSelect = (mosId: number) => {
    setField("specialtyId", mosId);
  };

  useEffect(() => {
    if (isNoMos) handleServiceMosSelect(0);
    else if (selectedMosId !== -1) handleServiceMosSelect(selectedMosId);
    else setField("specialtyId", null);
  }, [isNoMos, selectedMosId]);

  const toggleUnitModal = () => setIsUnitModalOpen(!isUnitModalOpen);
  const handleUnitSelect = (unit: MosAndUnitRecord) => {
    setSelectedUnitId(unit.id);
    setIsUnitModalOpen(false);
  };

  const handleServiceUnitSelect = (unitId: number) => {
    setField("unitId", unitId);
  };

  useEffect(() => {
    if (isNoUnit) handleServiceUnitSelect(0);
    else if (selectedUnitId !== -1) handleServiceUnitSelect(selectedUnitId);
    else setField("unitId", null);
  }, [isNoUnit, selectedUnitId]);

  useEffect(() => {
    const mosOk = isNoMos || selectedMosId !== -1;
    const unitOk = isNoUnit || selectedUnitId !== -1;
    setCanProceed(mosOk && unitOk);
  }, [isNoMos, isNoUnit, selectedMosId, selectedUnitId]);

  return (
    <div className="flex flex-col p-6 bg-white rounded-3xl w-[360px]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-bold text-gray-700">군사특기</p>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsNoMos((prev) => !prev)}
        >
          <input
            className="w-4 h-4 mt-0.5 border-gray-500 rounded-sm border appearance-none form-checkbox checked:bg-[url('./images/checked.png')] bg-cover bg-no-repeat bg-center checked:border-emerald-600 checked:text-white"
            type="checkbox"
            checked={isNoMos}
            readOnly
          />
          <p className="text-sm">특기부여 전이에요.</p>
        </div>
      </div>

      {selectedMosId === -1 ? (
        <button
          className={`w-fit px-2 py-1 text-sm rounded-xl ${
            isNoMos
              ? "bg-gray-100 text-gray-500 "
              : "bg-emerald-100 text-emerald-600"
          }`}
          onClick={toggleMosModal}
          disabled={isNoMos}
        >
          군사특기 찾기
        </button>
      ) : (
        <button
          className={`flex gap-1 items-center w-fit pl-2 pr-1 py-1 text-sm rounded-xl ${
            isNoMos
              ? "bg-gray-100 text-gray-500 "
              : "bg-emerald-100 text-emerald-600"
          }`}
          onClick={() => setSelectedMosId(-1)}
          disabled={isNoMos}
        >
          {serviceMos.find((item) => item.id === selectedMosId)?.label}
          <Icon icon="typcn:delete" className="text-lg" />
        </button>
      )}

      <SelectModal
        title="특기"
        isOpen={isMosModalOpen}
        onClose={toggleMosModal}
        onSelect={handleMosSelect}
        DataList={serviceMos}
      />

      <div className="flex items-center justify-between mt-8 mb-4">
        <p className="text-lg font-bold text-gray-700">복무부대</p>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsNoUnit((prev) => !prev)}
        >
          <input
            className="w-4 h-4 mt-0.5 border-gray-500 rounded-sm border appearance-none form-checkbox checked:bg-[url('./images/checked.png')] bg-cover bg-no-repeat bg-center checked:border-emerald-600 checked:text-white"
            type="checkbox"
            checked={isNoUnit}
            readOnly
          />
          <p className="text-sm">자대배치 전이에요.</p>
        </div>
      </div>

      {selectedUnitId === -1 ? (
        <button
          className={`w-fit px-2 py-1 text-sm rounded-xl ${
            isNoUnit
              ? "bg-gray-100 text-gray-500 "
              : "bg-emerald-100 text-emerald-600"
          }`}
          onClick={toggleUnitModal}
          disabled={isNoUnit}
        >
          복무부대 찾기
        </button>
      ) : (
        <button
          className={`flex gap-1 items-center w-fit pl-2 pr-1 py-1 text-sm rounded-xl ${
            isNoUnit
              ? "bg-gray-100 text-gray-500 "
              : "bg-emerald-100 text-emerald-600"
          }`}
          onClick={() => setSelectedUnitId(-1)}
          disabled={isNoUnit}
        >
          {serviceUnit.find((item) => item.id === selectedUnitId)?.label}
          <Icon icon="typcn:delete" className="text-lg" />
        </button>
      )}

      <SelectModal
        title="부대"
        isOpen={isUnitModalOpen}
        onClose={toggleUnitModal}
        onSelect={handleUnitSelect}
        DataList={serviceUnit}
      />
    </div>
  );
}
