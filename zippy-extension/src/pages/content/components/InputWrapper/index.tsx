import React from 'react';
import ActionWritingButton from '@pages/content/components/InputWrapper/ActionWritingButton';
import LanguageDropbox from '@pages/content/components/InputWrapper/LanguageDropdown';
import useChromeStorage from '@pages/hooks/@shared/useChromeStorage';
import { CHROME_ACTIONS_KEY } from '@pages/constants';
import t from '@src/chrome/i18n';
import ActionGroup from './ActionGroup';
import OutputSettingGroup from './OutputSettingGroup';

export interface SelectOption {
  id: number;
  value: string;
  text: string;
  prompt: string;
}

const options: Array<SelectOption> = [
  {
    id: 0,
    value: 'shorten',
    text: t('actionDropdown_shortenText'),
    prompt: t('actionDropdown_shortenValue'),
  },
  {
    id: 1,
    value: 'expand',
    text: t('actionDropdown_expandText'),
    prompt: t('actionDropdown_expandValue'),
  },
  {
    id: 2,
    value: 'continue',
    text: t('actionDropdown_continueText'),
    prompt: t('actionDropdown_continueValue'),
  },
  {
    id: 3,
    value: 'rewrite',
    text: t('actionDropdown_rewriteText'),
    prompt: t('actionDropdown_rewriteValue'),
  },
  {
    id: 4,
    value: 'exemplify',
    text: t('actionDropdown_exemplifyText'),
    prompt: t('actionDropdown_exemplifyValue'),
  },
  {
    id: 5,
    value: 'clarify',
    text: t('actionDropdown_clarifyText'),
    prompt: t('actionDropdown_clarifyValue'),
  },
  {
    id: 6,
    value: 'explain',
    text: t('actionDropdown_explainText'),
    prompt: t('actionDropdown_explainValue'),
  },
];

const InputWrapper = () => {
  const [selectedOption, setSelectedOption] = useChromeStorage<number>(CHROME_ACTIONS_KEY, 0);
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
    <div>
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
    </div>
  );
};

export default InputWrapper;
