import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

type UseChromeStorage = <T>(key: string, initialValue: T) => [T, Dispatch<SetStateAction<T>>];
const useChromeStorage: UseChromeStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);

  const setData = useCallback(
    (newValue: T) => {
      chrome.storage.local.set({ [key]: newValue }, () => {});
    },
    [key]
  );

  const getData = useCallback(() => {
    return new Promise<void>((resolve) => {
      chrome.storage.local.get(key, (result) => {
        if (result[key]) {
          setValue(result[key]);
        } else {
          setValue(initialValue);
          chrome.storage.local.set({ [key]: initialValue }, () => {
            resolve();
          });
        }
      });
    });
  }, [initialValue, key]);

  useEffect(() => {
    getData().then(() => {
      setValue(value);
    });
  }, [getData, setValue, value]);

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
