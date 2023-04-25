import Navbar from '@/components/Navbar/Navbar';
import Head from 'next/head';
import React from 'react';

type AppLayoutProps = {
  children: React.ReactNode;
  toggleTheme: () => void;
};

function AppLayout({ children, toggleTheme }: AppLayoutProps) {
  return (
    <>
      <Head>
        <title>Gippy - ChatGPT 활용 플랫폼</title>
        <meta name="description" content="우리팀 이름 뭐임?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar toggleTheme={toggleTheme} />
      <div>{children}</div>
    </>
  );
}

export default AppLayout;
