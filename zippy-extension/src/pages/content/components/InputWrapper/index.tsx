import React, { useState } from 'react';
import ActionWritingButton from '@pages/content/components/InputWrapper/ActionWritingButton';
import LanguageDropbox from '@pages/content/components/InputWrapper/LanguageDropdown';
import ActionGroup from './ActionGroup';
import OutputSettingGroup from './OutputSettingGroup';

export interface SelectOption {
  id: number;
  value: string;
  text: string;
  prompt: string;
}

const options: Array<SelectOption> = [
  { id: 0, value: 'continue', text: '계속 작성', prompt: '답변을 이어서 계속 작성해줘' },
  { id: 1, value: 'rewrite', text: '다시 작성', prompt: '다시 답변해줘' },
  { id: 2, value: 'exemplify', text: '예시 제시', prompt: '예시를 제시해줄래?' },
  { id: 3, value: 'clarify', text: '명확하게', prompt: '좀 더 명확하게 답변해줘' },
  { id: 4, value: 'expand', text: '자세하게', prompt: '좀 더 자세하게 답변해줘' },
  { id: 5, value: 'shorten', text: '요약해서', prompt: '답변을 요약해줘' },
  { id: 6, value: 'explain', text: '설명해줘', prompt: '답변에 대해서 부가설명 부탁해' },
];

const InputWrapper = () => {
  const [selectedOption, setSelectedOption] = useState(0);
  const handleActionChange = (e: React.MouseEvent<HTMLLIElement>) => {
    setSelectedOption(+e.currentTarget.dataset.index);
  };

  const handleSubmitClick = () => {
    const textarea = document.querySelector(`form textarea`) as HTMLTextAreaElement;
    const button = textarea?.nextElementSibling as HTMLButtonElement;
    if (button.children[0].nodeName === 'DIV') return;
    textarea.value = options[selectedOption].prompt;
    if (button.nodeName === 'BUTTON' && button.disabled) {
      button.disabled = false;
    }

    button.click();
  };
  return (
    <>
      {/* className="ZP_output-setting-group" */}
      <OutputSettingGroup>
        <LanguageDropbox />
      </OutputSettingGroup>

      {/* className="ZP_action-group ZP_invisible" */}
      <ActionGroup>
        <ActionWritingButton
          options={options}
          taskText={options[selectedOption].text}
          handleSubmitClick={handleSubmitClick}
          handleActionChange={handleActionChange}
        />
      </ActionGroup>
    </>
  );
};

export default InputWrapper;
