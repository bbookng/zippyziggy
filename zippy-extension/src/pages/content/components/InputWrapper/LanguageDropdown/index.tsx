import React, { useContext, useEffect, useState } from 'react';
import Dropdown, { DropdownContext } from '@pages/content/components/InputWrapper/Dropdown';
import countryData from '@pages/content/components/InputWrapper/FlagKit/country-code';
import FlagKit from '@pages/content/components/InputWrapper/FlagKit';
import useChromeStorage from '@pages/hooks/@shared/useChromeStorage';
import { CHAT_GPT_URL, CHROME_LANGUAGE_KEY } from '@pages/constants';
import useBrowserName from '@pages/hooks/@shared/useBrowserName';
import BrowserIcon from '@pages/content/components/InputWrapper/BrowserIcon';
import SearchBar from '@pages/content/components/PromptContainer/SearchBar';
import splitKorean from '@pages/content/utils/split-korean';

const LanguageDropbox = () => {
  const { setIsExpand, isExpand } = useContext(DropdownContext);
  const [searchLanguage, setSearchLanguage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useChromeStorage<number>(CHROME_LANGUAGE_KEY, 0);
  const browserName = useBrowserName();

  const handleLanguageDetection = () => {
    setSelectedLanguage(-1);
  };

  const handleLanguageClick = (index: number) => {
    setSelectedLanguage(index);
    setIsExpand(false);
    console.log(isExpand);
  };

  useEffect(() => {
    const targetLanguage =
      selectedLanguage > -1
        ? countryData[selectedLanguage].englishName
        : countryData.find((item) => item.navigatorLanguage === navigator.language).englishName;
    const message = {
      type: 'test',
      targetLanguage,
    };

    window.postMessage(message, CHAT_GPT_URL);
  }, [selectedLanguage]);

  return (
    <Dropdown>
      <Dropdown.Trigger className="ZP_language-select">
        <div className="ZP_language-label">
          {selectedLanguage > -1 ? (
            <>
              <FlagKit
                code={countryData[selectedLanguage].code}
                alt={countryData[selectedLanguage].englishName}
                size={18}
              />
              {countryData[selectedLanguage].koreanName}
            </>
          ) : (
            <>
              <BrowserIcon name={browserName} />
              <span style={{ marginLeft: '0.375rem' }}>언어감지</span>
            </>
          )}
        </div>
      </Dropdown.Trigger>
      <Dropdown.OptionList className="ZP_dropdown-menu--language">
        <SearchBar
          searchTerm={searchLanguage}
          setSearchTerm={setSearchLanguage}
          placeholder="검색"
        />
        <ul className="ZP_language-items">
          <li className={`ZP_language-item-wrapper ${selectedLanguage === -1 && 'active'}`}>
            <button type="button" className="ZP_language-item" onClick={handleLanguageDetection}>
              <BrowserIcon name={browserName} />
              <span style={{ marginLeft: '0.375rem' }}>언어감지</span>
            </button>
          </li>
          {countryData
            .filter((country) => {
              const splitKoreanName = splitKorean(country.koreanName);
              const splitSearchTerm = splitKorean(searchLanguage);
              return splitKoreanName.includes(splitSearchTerm);
            })
            .map((country, index) => {
              return (
                <li
                  key={country.englishName}
                  className={`ZP_language-item-wrapper ${index === selectedLanguage && 'active'}`}
                >
                  <button
                    type="button"
                    className="ZP_language-item"
                    onClick={() => handleLanguageClick(index)}
                  >
                    <FlagKit code={country.code} alt={country.englishName} size={18} />
                    {country.koreanName}
                  </button>
                </li>
              );
            })}
        </ul>
      </Dropdown.OptionList>
    </Dropdown>
  );
};

export default LanguageDropbox;
