import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import logOnDev from '@pages/content/utils/@shared/logging';

type UseChromeStorage = <T>(
  key: string,
  initialValue: T,
  storageArea?: 'local' | 'sync'
) => [T, Dispatch<SetStateAction<T>>];

const useChromeStorage: UseChromeStorage = <T>(
  key: string,
  initialValue: T,
  storageArea: 'local' | 'sync' = 'local'
) => {
  const initialValueRef = useRef(initialValue);
  const [value, setValue] = useState<T>(initialValue);

  const getData = useCallback(() => {
    return new Promise<T>((resolve) => {
      chrome.storage[storageArea].get(key, (result) => {
        if (result[key]) {
          resolve(result[key]);
        } else {
          setValue(initialValueRef.current);
          chrome.storage[storageArea].set({ [key]: initialValueRef.current }, () => {
            resolve(initialValueRef.current);
          });
        }
      });
    });
  }, [key, storageArea]);

  useEffect(() => {
    getData().then((retrievedValue) => {
      setValue(retrievedValue);
    });
  }, [getData]);

  useEffect(() => {
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === storageArea && changes[key]) {
        const { newValue } = changes[key];
        if (JSON.stringify(value) !== JSON.stringify(newValue)) {
          setValue(newValue);
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [key, storageArea, value]);

  const updateStorage = useCallback(
    (newValue: T) => {
      chrome.storage[storageArea].set({ [key]: newValue }, () => {
        logOnDev.log(`${key} 스토리지 업데이트`);
      });
    },
    [key, storageArea]
  );

  return [
    value,
    useCallback(
      (newValue: SetStateAction<T>) => {
        setValue((prevValue) => {
          const updatedValue =
            typeof newValue === 'function'
              ? (newValue as (prevState: T) => T)(prevValue)
              : newValue;
          updateStorage(updatedValue);
          return updatedValue;
        });
      },
      [updateStorage]
    ),
  ];
};

export default useChromeStorage;
