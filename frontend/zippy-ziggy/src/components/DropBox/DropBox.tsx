import React, { useEffect, useRef, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { DropBtn, Dropdown, DropdownContent } from './DropBoxStyle';

type PropsType = {
  initialValue?: string;
  itemList: Array<Array<string>>;
  handleChange: (e) => void;
};

/**
 *
 * @param {string} initialValue 박스 초기값
 * @param {Array<Array<string>>} itemList 예시) ['학업', 'STUDY']
 * @param {(e) => void} handleChange 선택시 값을 바꾸는 함수
 */

export default function DropBox({ initialValue = '', itemList, handleChange }: PropsType) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(initialValue);
  const categoryRef = useRef<HTMLUListElement>(null);
  const handleOpenDropdown = (e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const handleCloseDropdown = (e) => {
    if (categoryRef.current && !categoryRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleCloseDropdown);
    return () => {
      document.removeEventListener('mousedown', handleCloseDropdown);
    };
  }, []);

  return (
    <Dropdown>
      <DropBtn onClick={handleOpenDropdown}>
        <span className="dropbtn_content">{value || '카테고리'}</span>
        <FaAngleDown className="icon" />
      </DropBtn>
      {isOpen && (
        <DropdownContent ref={categoryRef}>
          {itemList.map((item) => {
            return (
              <li
                key={item[1]}
                data-value={item[1]}
                onClick={(e) => {
                  handleChange(e);
                  setValue(item[0]);
                  setIsOpen(false);
                }}
              >
                {item[0]}
              </li>
            );
          })}
        </DropdownContent>
      )}
    </Dropdown>
  );
}
