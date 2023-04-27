import React from 'react';
import Dropdown from '@pages/content/components/InputWrapper/Dropdown';
import { SelectOption } from '@pages/content/components/InputWrapper';

interface ActionWritingButtonProps {
  taskText: string;
  options: Array<SelectOption>;
  handleSubmitClick: () => void;
  handleActionChange: (e: React.MouseEvent<HTMLLIElement>) => void;
}
const ActionWritingButton = ({
  handleSubmitClick,
  handleActionChange,
  options,
  taskText,
}: ActionWritingButtonProps) => {
  return (
    <>
      <button
        id="ZP_actionWritingButton"
        type="button"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={handleSubmitClick}
      >
        {taskText}
      </button>
      <Dropdown>
        <Dropdown.Trigger>
          <i className="ZP_dropdown-arrow" />
        </Dropdown.Trigger>
        <Dropdown.OptionList>
          {options.map(({ value, text }, index) => (
            <li key={value} value={value} data-index={index} onClick={handleActionChange}>
              {text}
            </li>
          ))}
        </Dropdown.OptionList>
      </Dropdown>
    </>
  );
};

export default ActionWritingButton;
