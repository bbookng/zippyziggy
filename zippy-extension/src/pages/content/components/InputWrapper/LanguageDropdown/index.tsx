import React, { useEffect } from 'react';
import Dropdown from '@pages/content/components/InputWrapper/Dropdown';
import countryData from '@pages/content/components/InputWrapper/FlagKit/country-code';
import FlagKit from '@pages/content/components/InputWrapper/FlagKit';
import useChromeStorage from '@pages/hooks/@shared/useChromeStorage';
import { CHAT_GPT_URL, CHROME_LANGUAGE_KEY } from '@pages/constants';

const LanguageDropbox = () => {
  const [selectedLanguage, setSelectedLanguage] = useChromeStorage<number>(CHROME_LANGUAGE_KEY, 0);

  const handleLanguageDetection = () => {
    setSelectedLanguage(-1);
  };

  const handleLanguageClick = (index: number) => {
    setSelectedLanguage(index);
  };

  useEffect(() => {
    const targetLanguage =
      selectedLanguage > -1 ? countryData[selectedLanguage].englishName : navigator.language;
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
            '언어감지'
          )}
        </div>
      </Dropdown.Trigger>
      <Dropdown.OptionList className="ZP_dropdown-menu--language">
        <ul className="ZP_language-items">
          <li className={`ZP_language-item-wrapper ${selectedLanguage === -1 && 'active'}`}>
            <button type="button" className="ZP_language-item" onClick={handleLanguageDetection}>
              언어감지
            </button>
          </li>
          {countryData.map((country, index) => {
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
