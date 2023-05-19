import { useEffect, useState } from 'react';

const useBrowserName = (): string => {
  const [browserName, setBrowserName] = useState<string>('');

  useEffect(() => {
    const { userAgent } = navigator;

    if (userAgent.includes('Firefox')) {
      setBrowserName('Firefox');
    } else if (userAgent.includes('Edg') || userAgent.includes('Edge')) {
      setBrowserName('Edge');
    } else if (userAgent.includes('Whale')) {
      setBrowserName('Whale');
    } else if (userAgent.includes('Chrome') && userAgent.includes('Brave')) {
      setBrowserName('Brave');
    } else if (userAgent.includes('Chrome')) {
      setBrowserName('Chrome');
    } else if (userAgent.includes('Safari')) {
      setBrowserName('Safari');
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
      setBrowserName('Internet Explorer');
    } else {
      setBrowserName('Unknown');
    }
  }, []);

  return browserName;
};

export default useBrowserName;
