export function calculatePfcDate(startDate: Date) {
  let newDate = new Date(startDate);
  newDate.setMonth(newDate.getMonth() + 2);
  newDate.setMonth(newDate.getMonth() + 1, 1);
  return newDate;
}

export function calculateCplDate(startDate: Date) {
  let newDate = new Date(startDate);
  newDate.setMonth(newDate.getMonth() + 8);
  newDate.setMonth(newDate.getMonth() + 1, 1);
  return newDate;
}

export function calculateSgtDate(startDate: Date) {
  let newDate = new Date(startDate);
  newDate.setMonth(newDate.getMonth() + 14);
  newDate.setMonth(newDate.getMonth() + 1, 1);
  return newDate;
}

export function calculateEndDate(startDate: Date) {
  let newDate = new Date(startDate);
  newDate.setMonth(newDate.getMonth() + 21);
  return newDate;
}

export function calculateLevel(startDate: Date, currentDate: Date) {
  if (currentDate < startDate) return "입대전";
  else if (currentDate < calculatePfcDate(startDate)) return "이병";
  else if (currentDate < calculateCplDate(startDate)) return "일병";
  else if (currentDate < calculateSgtDate(startDate)) return "상병";
  else if (currentDate < calculateEndDate(startDate)) return "병장";
  else return "예비군";
}
