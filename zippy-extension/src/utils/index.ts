/* https://developer.chrome.com/docs/extensions/mv3/security/#sanitize
 * 악의적인 스크립팅 입력 방지 */
const sanitizeInput = (input: string) => {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
};

// 날짜 시간 포맷 YYYY 년 MM월 DD일
const formatDateTime = (timestamp: number, countryCode: string) => {
  const fullDate = new Date(timestamp);

  if (!fullDate || fullDate.toString() === 'Invalid Date') {
    return '';
  }

  const formatter = new Intl.DateTimeFormat(countryCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return formatter.format(fullDate);
};

// 타임스탬프를  N {unit} 전 형태로 포맷
const formatAgo = (timestamp: number) => {
  const fullDate = new Date(timestamp);

  if (!fullDate || fullDate.toString() === 'Invalid Date') {
    return '';
  }

  const now = new Date();
  const diff = Math.max(0, now.valueOf() - fullDate.valueOf());

  const units = [
    {
      name: '년',
      value: 31556952000,
    },
    {
      name: '개월',
      value: 2629746000,
    },
    {
      name: '주',
      value: 604800000,
    },
    {
      name: '일',
      value: 86400000,
    },
    {
      name: '시간',
      value: 3600000,
    },
    {
      name: '분',
      value: 60000,
    },
    {
      name: '초',
      value: 1000,
    },
  ];

  for (let i = 0; i < units.length; i += 1) {
    const unit = units[i];

    if (diff >= unit.value) {
      const unitCount = Math.floor(diff / unit.value);
      const unitName = unitCount > 1 ? unit.name : unit.name;

      return `${unitCount} ${unitName} 전`;
    }
  }

  return '방금 전';
};

const formatHumanReadableNumber = (number: number) => {
  if (number < 1000) {
    return number;
  }

  if (number < 1000000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return `${(number / 1000000).toFixed(1)}M`;
};

export { sanitizeInput, formatDateTime, formatAgo, formatHumanReadableNumber };
