import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

type UseChromeStorage = <T>(key: string, initialValue: T) => [T, Dispatch<SetStateAction<T>>];
const useChromeStorage: UseChromeStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);

  // 데이터를 저장하는 함수
  const setData = useCallback(
    (newValue: T) => {
      chrome.storage.local.set({ [key]: newValue }, () => {
        setValue(newValue);
      });
    },
    [key]
  );

  // 데이터를 가져오는 함수
  const getData = useCallback(() => {
    chrome.storage.local.get(key, (result) => {
      if (result[key]) {
        setValue(result[key]);
      } else {
        // 초기 상태 값 설정
        setValue(initialValue);
        setData(initialValue);
      }
    });
  }, [initialValue, key, setData]);

  useEffect(() => {
    getData();
  }, [getData]);

  return [value, setData];
};

export default useChromeStorage;
