import React from 'react';
import Dropdown from '@pages/content/components/InputWrapper/Dropdown';

const LanguageDropbox = () => {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <div>ㅎㅎ</div>
      </Dropdown.Trigger>
      <Dropdown.OptionList>
        <li>한국어</li>
        <li>영어</li>
        <li>중국어</li>
        <li>일본어</li>
      </Dropdown.OptionList>
    </Dropdown>
  );
};

export default LanguageDropbox;
