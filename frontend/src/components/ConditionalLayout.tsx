'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface ConditionalLayoutProps {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
  scrollHelper: React.ReactNode;
  floatingContact?: React.ReactNode;
}

export default function ConditionalLayout({
  children,
  navbar,
  footer,
  scrollHelper,
  floatingContact,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Conditionally hide Navbar, Footer, and Scroll helper for any admin dashboard pages
  const isAdminPath = pathname?.startsWith('/admin-dashboard');

  if (isAdminPath) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      <main className="flex-grow">{children}</main>
      {floatingContact}
      {footer}
      {scrollHelper}
    </>
  );
}
