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
        <button id="actionWritingButton" type="button">
          a
        </button>
        <select id="actionSelect">
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
      </ActionGroup>
    </>
  );
};

export default InputWrapper;
