'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Home, Briefcase, Star, HelpCircle,
  Car, Layers, Image, GitBranch
} from 'lucide-react';

const navLinks = [
  { href: '/admin-dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin-dashboard/home-config', label: 'Home Page Content', icon: Home, exact: false },
  { href: '/admin-dashboard/services', label: 'Services', icon: Briefcase, exact: false },
  { href: '/admin-dashboard/testimonials', label: 'Customer Reviews', icon: Star, exact: false },
  { href: '/admin-dashboard/faqs', label: 'General FAQs', icon: HelpCircle, exact: false },
  { href: '/admin-dashboard/makes-partners', label: 'Brands & Makes', icon: Car, exact: false },
  { href: '/admin-dashboard/process', label: 'Process Steps', icon: GitBranch, exact: false },
  { href: '/admin-dashboard/studio-experience', label: 'Studio Experience', icon: Image, exact: false },
];

export const pageTitles: Record<string, string> = {
  '/admin-dashboard': 'Dashboard Overview',
  '/admin-dashboard/home-config': 'Home Page Content',
  '/admin-dashboard/services': 'Services Manager',
  '/admin-dashboard/testimonials': 'Customer Reviews',
  '/admin-dashboard/faqs': 'General FAQs',
  '/admin-dashboard/makes-partners': 'Brands & Makes',
  '/admin-dashboard/process': 'Process Steps',
  '/admin-dashboard/studio-experience': 'Studio Experience',
};

export function SidebarNav() {
  const pathname = usePathname();

  function isActive(link: { href: string; exact: boolean }) {
    if (link.exact) return pathname === link.href;
    return pathname?.startsWith(link.href);
  }

  const currentTitle = Object.entries(pageTitles).find(([path]) =>
    pathname === path || (!path.endsWith('/admin-dashboard') && pathname?.startsWith(path))
  )?.[1] ?? 'Admin Dashboard';

  return (
    <>
      {/* Sidebar links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5">
          {navLinks.map((link) => {
            const active = isActive(link);
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-150 border-r-2 ${
                    active
                      ? 'bg-primary/10 text-primary border-primary font-bold'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-primary' : ''}`} />
                  <span className="truncate">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Current title injected into a data attribute so layout can read it */}
      <span data-page-title={currentTitle} className="hidden" />
    </>
  );
}

export function DynamicHeader() {
  const pathname = usePathname();

  // Find the most specific matching path
  const title = Object.entries(pageTitles)
    .filter(([path]) => pathname === path || pathname?.startsWith(path + '/'))
    .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? 'Admin Dashboard';

  return (
    <h1 className="text-base font-bold text-gray-800 uppercase tracking-wider">{title}</h1>
  );
}
