import { useEffect, useRef, useState } from 'react';

const useDebounce = <T>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (value !== debouncedValue) {
      timerRef.current = window.setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay, debouncedValue]);

  return debouncedValue;
};

export default useDebounce;
