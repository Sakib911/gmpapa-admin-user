'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { SearchHeader } from '@/components/layout/SearchHeader';
import { MobileNav } from '@/components/layout/MobileNav';
import { Toaster } from 'sonner';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        
        <main className="flex-1 flex flex-col">
          <SearchHeader />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}