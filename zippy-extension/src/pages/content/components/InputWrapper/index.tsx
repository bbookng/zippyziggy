import React, { ChangeEvent, useState } from 'react';
import ActionGroup from './ActionGroup';
import OutputSettingGroup from './OutputSettingGroup';

interface SelectOption {
  value: string;
  text: string;
  prompt: string;
}

const options: Array<SelectOption> = [
  { value: 'continue', text: '계속 작성', prompt: '답변을 이어서 계속 작성해줘' },
  { value: 'rewrite', text: '다시 작성', prompt: '다시 답변해줘' },
  { value: 'exemplify', text: '예시 제시', prompt: '예시를 제시해줄래?' },
  { value: 'clarify', text: '명확하게', prompt: '좀 더 명확하게 답변해줘' },
  { value: 'expand', text: '자세하게', prompt: '좀 더 자세하게 답변해줘' },
  { value: 'shorten', text: '요약해서', prompt: '답변을 요약해줘' },
  { value: 'explain', text: '설명해줘', prompt: '답변에 대해서 부가설명 부탁해' },
];

const InputWrapper = () => {
  const [selectedOption, setSelectedOption] = useState(0);
  const handleSelectActionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { selectedIndex } = e.target;
    setSelectedOption(selectedIndex);
  };

  const handleSubmitClick = () => {
    const textarea = document.querySelector(`form textarea`) as HTMLTextAreaElement;
    textarea.value = options[selectedOption].prompt;
    const button = textarea?.nextElementSibling as HTMLButtonElement;
    if (button.nodeName === 'BUTTON' && button.disabled) {
      button.disabled = false;
    }
    button.click();
  };
  return (
    <>
      <OutputSettingGroup>
        <div>asd</div>
      </OutputSettingGroup>
      <ActionGroup>
        <button id="ZP_actionWritingButton" type="button" onClick={handleSubmitClick}>
          {options[selectedOption].text}
        </button>
        <select id="ZP_actionSelect" onChange={handleSelectActionChange}>
          {options.map(({ value, text }) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </ActionGroup>
    </>
  );
};

export default InputWrapper;
