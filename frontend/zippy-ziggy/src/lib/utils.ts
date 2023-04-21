function getTodayDate(today: Date = new Date()) {
  const year = Number(today.getFullYear()); // 년도
  let month: string | number = Number(today.getMonth()); // 월
  let date: string | number = today.getDate(); // 날짜
  // const day = today.getDay(); // 요일

  if (month >= 1 && month < 10) {
    month = `0${month}`;
  }

  if (date >= 1 && date < 10) date = `0${date}`;

  return `${year}년 ${month}월 ${date}일`;
}

export { getTodayDate };
