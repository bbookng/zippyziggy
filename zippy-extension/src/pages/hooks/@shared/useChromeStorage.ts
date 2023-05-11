import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

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
  const [value, setValue] = useState<T>(initialValue);

  const setData = useCallback(
    (newValue: T) => {
      chrome.storage[storageArea].set({ [key]: newValue }, () => {});
    },
    [key, storageArea]
  );

  const getData = useCallback(() => {
    return new Promise<void>((resolve) => {
      chrome.storage[storageArea].get(key, (result) => {
        if (result[key]) {
          setValue(result[key]);
        } else {
          setValue(initialValue);
          chrome.storage[storageArea].set({ [key]: initialValue }, () => {
            resolve();
          });
        }
      });
    });
  }, [initialValue, key, storageArea]);

  useEffect(() => {
    getData().then(() => {
      setValue(value);
    });
  }, [getData, setValue, value]);

  useEffect(() => {
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === storageArea && changes[key]) {
        setValue(changes[key].newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [key, storageArea]);

  return [
    value,
    useCallback(
      (newValue: SetStateAction<T>) => {
        setValue((prevValue) => {
          const updatedValue =
            typeof newValue === 'function'
              ? (newValue as (prevState: T) => T)(prevValue)
              : newValue;
          setData(updatedValue);
          return updatedValue;
        });
      },
      [setData]
    ),
  ];
};

export default useChromeStorage;
