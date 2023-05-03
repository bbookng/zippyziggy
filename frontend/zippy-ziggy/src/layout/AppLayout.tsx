import LoginModal from '@/components/Modal/LoginModal';
import Navbar from '@/components/Navbar/Navbar';
import { useAppSelector } from '@/hooks/reduxHook';
import Head from 'next/head';
import Router from 'next/router';
import React from 'react';

type AppLayoutProps = {
  children: React.ReactNode;
  toggleTheme: () => void;
};

function AppLayout({ children, toggleTheme }: AppLayoutProps) {
  const handleBack = () => {
    Router.back();
  };

  return (
    <>
      <Head>
        <title>Gippy - ChatGPT 활용 플랫폼</title>
        <meta name="description" content="team deun deun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar toggleTheme={toggleTheme} />
      <div>{children}</div>
    </>
  );
}

export default AppLayout;
