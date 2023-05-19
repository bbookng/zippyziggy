import React, { HTMLAttributes } from 'react';
import countryData from '@pages/content/components/InputWrapper/FlagKit/country-code';
import { FLAGKIT_CDN_URL } from '@pages/constants';

interface FlagKitProps extends HTMLAttributes<HTMLImageElement> {
  code: string;
  alt: string;
  role?: string;
  size?: number;
}
const FlagKit = ({ code, alt, size = 24, role = 'img', ...rest }: FlagKitProps) => {
  const countryCode = code.toUpperCase();
  const isCountryCodeValid =
    countryData.find((country) => country.code === countryCode) !== undefined;

  // 유효한 국가 코드인 경우
  if (isCountryCodeValid) {
    const flagSrc = `${FLAGKIT_CDN_URL}/${countryCode}.svg`;

    // 국기 이미지를 반환합니다.
    return (
      <img
        src={flagSrc}
        role={role}
        alt={alt ?? `${countryCode} Flag`}
        height={size}
        width={size}
        {...rest}
      />
    );
  }

  // 유효하지 않은 국가 코드인 경우, 국가 코드를 반환합니다.
  return <span>{countryCode}</span>;
};

export default FlagKit;
