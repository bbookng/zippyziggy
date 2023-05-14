import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

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

  return [
    value,
    useCallback(
      (newValue: SetStateAction<T>) => {
        setValue((prevValue) => {
          const updatedValue =
            typeof newValue === 'function'
              ? (newValue as (prevState: T) => T)(prevValue)
              : newValue;
          chrome.storage[storageArea].set({ [key]: updatedValue }, () => {});
          return updatedValue;
        });
      },
      [key, storageArea]
    ),
  ];
};

export default useChromeStorage;
