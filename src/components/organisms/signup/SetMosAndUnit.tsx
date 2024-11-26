import { useState, useEffect, ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";
import ServiceType from "../../../data/serviceType.json";
import DatePicker from "../../molecules/DatePicker";

type SetMosAndUnitProps = {
  form: SignUpFormType;
  changed: (
    key: keyof SignUpFormType
  ) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setCanProceed: (value: boolean) => void;
};

export default function SetMosAndUnit({
  form,
  changed,
  setCanProceed,
}: SetMosAndUnitProps) {
  const [isNoMos, setIsNoMos] = useState(false);
  const [isSelectMosOpened, setIsSelectMosOpened] = useState(false);

  const handleServiceMosSelect = (mosId: number) => {
    changed("serviceUnit")({
      target: { value: mosId },
    } as unknown as ChangeEvent<HTMLSelectElement>);
  };
  const handleServiceUnitSelect = (unitId: number) => {
    changed("serviceMos")({
      target: { value: unitId },
    } as unknown as ChangeEvent<HTMLSelectElement>);
  };

  useEffect(() => {
    setCanProceed(form.serviceEndDate !== null);
  }, [form.serviceType, setCanProceed]);

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg w-96">
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-bold text-gray-700">군사특기</p>
        <div
          className="flex items-center gap-2"
          onClick={() => setIsNoMos((prev) => !prev)}
        >
          <input
            // className="w-4 h-4 bg-emerald-600 focus:ring-0"
            className="w-4 h-4 border-gray-300 appearance-none checked:bg-emerald-500 checked:border-emerald-500 checked:text-white"
            type="checkbox"
            checked={isNoMos}
          />
          <p className="text-sm">특기부여 전이에요.</p>
        </div>
      </div>

      <h2 className="mt-4 mb-4 text-lg font-bold text-gray-700">복무부대</h2>
    </div>
  );
}
