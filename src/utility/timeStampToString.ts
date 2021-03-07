export function convertTimesStampToDateString(date: Date): String {
  const timeStamp: Date = new Date(date);

  const dayNumber: Number = timeStamp.getDate();
  const dayString: String =
    dayNumber.toString().length === 1
      ? "0" + dayNumber.toString()
      : dayNumber.toString();

  const monthNumber: number = timeStamp.getMonth() + 1;
  const monthString: String =
    monthNumber.toString().length === 1
      ? "0" + monthNumber.toString()
      : monthNumber.toString();

  return `
      ${dayString}.${monthString}.`;
}
