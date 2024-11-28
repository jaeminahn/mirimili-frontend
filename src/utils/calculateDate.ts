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
