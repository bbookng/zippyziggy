import { useEffect, useRef, useState } from 'react';

/**
 * useDebounce 훅
 * @param value 입력값
 * @param delay 딜레이 시간 (기본값: 500)
 * @returns 딜레이된 입력값
 */
const useDebounce = <T>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // 이전 타이머를 제거
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 새로운 타이머를 설정
    if (value !== debouncedValue) {
      timerRef.current = window.setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
    }

    // 언마운트 시 클린업 함수 실행
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay, debouncedValue]);

  return debouncedValue;
};

export default useDebounce;
