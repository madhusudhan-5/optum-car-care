'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home', exact: true },
  { href: '/process', label: 'Process', exact: true },
  { href: '/studio-experience', label: 'Studio', exact: true },
  { href: '/services', label: 'Services', exact: false },
  { href: '/contact', label: 'Contact', exact: true },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  function handleScheduleClick(e: React.MouseEvent) {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById('appointment-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push('/contact#appointment-form');
    }
  }

  function isActive(link: { href: string; exact: boolean }) {
    if (link.exact) return pathname === link.href;
    return pathname?.startsWith(link.href);
  }

  return (
    <>
      {/* TOP HEADER INFO BANNER */}
      <div className="w-full bg-[#111] text-gray-400 text-[10px] sm:text-xs py-3.5 px-4 sm:px-6 border-b border-white/5 flex flex-wrap justify-between items-center font-bold uppercase tracking-wider relative z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex gap-3 sm:gap-4">
            <span>📍 Singasandra, Bengaluru</span>
            <span className="text-gray-700">|</span>
            <span className="hidden sm:inline">🛡️ Fully Insured</span>
          </div>
          <div className="hidden sm:flex gap-4 items-center">
            <span>📞 096328 04024</span>
          </div>
        </div>
      </div>

      <nav
        className={`w-full text-white sticky top-0 z-50 transition-all duration-500 border-b ${
          isScrolled
            ? 'bg-[#0a0a0acc]/90 backdrop-blur-md py-3.5 border-white/5 shadow-xl'
            : 'bg-[#0a0a0ae6]/90 backdrop-blur-sm py-5 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center w-full">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-85 transition-opacity flex items-center">
              <img src="/optum_logo.png" alt="Optum Car Care Logo" className="h-8 sm:h-10 w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Nav — hidden below lg */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-[10px] xl:text-xs uppercase tracking-widest font-black">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-primary transition-colors whitespace-nowrap ${isActive(link) ? 'text-primary' : 'text-gray-300'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA — hidden below lg */}
          <div className="hidden lg:block">
            <button
              onClick={handleScheduleClick}
              className="border border-primary text-primary px-5 py-2.5 uppercase text-[10px] font-black tracking-widest hover:bg-primary hover:text-black transition-all duration-300 rounded-full cursor-pointer whitespace-nowrap"
            >
              Schedule Appointment
            </button>
          </div>

          {/* Mobile Hamburger — visible below lg */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={handleScheduleClick}
              className="hidden sm:block border border-primary text-primary px-4 py-2 uppercase text-[9px] font-black tracking-widest hover:bg-primary hover:text-black transition-all duration-300 rounded-full cursor-pointer whitespace-nowrap"
            >
              Book Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-primary transition-colors text-xs font-black uppercase tracking-wider flex items-center gap-2 focus:outline-none p-1"
              aria-label="Toggle menu"
            >
              <span className="text-lg">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU PANEL */}
      <div
        className={`fixed inset-0 bg-black/97 z-40 lg:hidden flex flex-col items-center justify-center gap-6 sm:gap-8 text-center transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="mb-4">
          <img src="/optum_logo.png" alt="Optum Car Care Logo" className="h-12 sm:h-16 w-auto object-contain mx-auto" />
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            className={`text-2xl sm:text-3xl font-heading font-black tracking-wider uppercase transition-colors ${isActive(link) ? 'text-primary' : 'text-gray-300 hover:text-primary'}`}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={handleScheduleClick}
          className="mt-4 border border-primary text-primary px-8 py-3.5 uppercase text-xs font-black tracking-widest hover:bg-primary hover:text-black transition-colors rounded-full cursor-pointer"
        >
          Schedule Appointment
        </button>
      </div>
    </>
  );
}
