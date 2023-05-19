import Footer from '@/components/Footer/Footer';
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
      <Navbar toggleTheme={toggleTheme} />
      <div>{children}</div>
    </>
  );
}

export default AppLayout;
