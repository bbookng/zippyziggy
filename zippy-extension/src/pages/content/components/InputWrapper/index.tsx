import React from 'react';
import ActionGroup from './ActionGroup';
import OutputSettingGroup from './OutputSettingGroup';

const InputWrapper = () => {
  return (
    <>
      <OutputSettingGroup>
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
