import React from 'react';
import ActionGroup from '@pages/content/components/InputWrapper/ActionGroup';
import OutputSettingGroup from '@pages/content/components/InputWrapper/OutputSettingGroup';

const InputWrapper = () => {
  return (
    <>
      <OutputSettingGroup>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
      </OutputSettingGroup>
      <ActionGroup>
        <button id="ZP_actionWritingButton" type="button">
          a
        </button>
        <select id="ZP_actionSelect">
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
      </ActionGroup>
    </>
  );
};

export default InputWrapper;
