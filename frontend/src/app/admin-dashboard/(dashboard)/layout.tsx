import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/actions/auth';
import { SidebarNav, DynamicHeader } from './SidebarNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    redirect('/admin-dashboard/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
          {/* Logo */}
          <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-800 shrink-0">
            <div className="w-8 h-8 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center">
              <img src="/optum_logo.png" alt="Optum" className="h-5 w-5 object-contain" />
            </div>
            <div>
              <span className="text-xs font-black font-heading uppercase text-primary tracking-widest">Optum</span>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold -mt-0.5">Admin Portal</p>
            </div>
          </div>

          {/* Dynamic navigation with active highlighting */}
          <SidebarNav />

          {/* Bottom: Sign Out + View Site */}
          <div className="p-4 border-t border-gray-800 space-y-2 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors px-1"
            >
              <span>↗</span> View Live Site
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="w-full text-left text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-2 px-1 py-1"
              >
                <span>⎋</span> Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-w-0">
          {/* Top Header with dynamic title */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-8 shrink-0 shadow-sm">
            <DynamicHeader />
            <div className="flex items-center gap-4">
              <span className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Backend Connected
              </span>
              <Link
                href="/"
                target="_blank"
                className="text-xs font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-black transition-all duration-200"
              >
                View Site ↗
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
