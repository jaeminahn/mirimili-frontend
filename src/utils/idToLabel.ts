import ServiceType from "../data/serviceType.json";
import ServiceMos from "../data/serviceMos.json";
import ServiceUnit from "../data/serviceUnit.json";

export function typeId2Label(typeId: number) {
  return ServiceType.find((val) => val.id == typeId)?.label || "에러";
}

export function mosId2Label(mosId: number) {
  return ServiceMos.find((val) => val.id == mosId)?.label || "에러";
}

export function unitId2Label(unitId: number) {
  return ServiceUnit.find((val) => val.id == unitId)?.label || "에러";
}
