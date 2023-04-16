import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [colorTheme, setTheme] = useState<string | null>(null);

  const setMode = (mode: string) => {
    if (mode === 'light') {
      document.body.dataset.theme = 'light';
      window.localStorage.setItem('theme', 'light');
    } else {
      document.body.dataset.theme = 'dark';
      window.localStorage.setItem('theme', 'dark');
    }
    setTheme(mode);
  };

  const toggleTheme = () => {
    colorTheme === 'light' ? setMode('dark') : setMode('light');
  };

  // next는 기본적으로 SSG를 지원하기 때문에 렌더링이 일어나기전에 브라우저 환경에서 사용할 수 있는
  // localStorage, window 객체 등에 접근 불가
  // => useEffect를 통해 마운트 후 사용
  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');

    // 이용자가 다크모드를 선호하면 다크 모드로 보여주는 로직
    // 위에 localTheme을 받아서 !localTheme 처리 이유는
    // 처음에는 로컬에 저장된게 없으니 false로 나오기 때문에 true로 바꿔주고
    // 둘다 true일 때만 처리해주기
    window.matchMedia('(prefers-color-scheme:dark)').matches && !localTheme
      ? setMode('dark')
      : localTheme === 'dark'
      ? setMode('dark')
      : setMode('light');
  }, []);
  return { colorTheme, toggleTheme };
};
