'use client';

import React, { useState, useEffect } from 'react';

export default function ScrollToTopAndGoogle({ config }: { config: any }) {
  const [isVisible, setIsVisible] = useState(false);
  const phone = config?.phone || '';

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const formattedPhone = phone.replace(/[^0-9+]/g, '');
  const waLink = `https://wa.me/${formattedPhone.replace('+', '')}`;
  const telLink = `tel:${formattedPhone}`;
  // Direct link to Google Reviews
  const googleReviewLink = config?.google_review_link || 'https://search.google.com/local/writereview?placeid=ChIJoZfh5tAVrjsROO2SSv288oQ';

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col gap-2 sm:gap-3 items-end font-heading">
      {/* WhatsApp FLOAT BADGE */}
      {phone && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-[#25D366] text-white border border-white/10 rounded-full shadow-2xl hover:bg-[#128C7E] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-75 pointer-events-none'
          }`}
          style={{ transitionDelay: '0ms' }}
          aria-label="WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
            <path d="M12.031 0C5.402 0 .022 5.385.02 12.016c0 2.12.553 4.192 1.603 6.012L0 24l6.115-1.603a11.948 11.948 0 005.914 1.564h.005c6.626 0 12.008-5.383 12.01-12.014C24.041 5.388 18.658 0 12.031 0zm0 19.972h-.004a9.957 9.957 0 01-5.086-1.39l-.365-.216-3.784.992 1.01-3.69-.237-.377a9.946 9.946 0 01-1.523-5.275c.002-5.525 4.502-10.024 10.03-10.024 5.528 0 10.028 4.498 10.028 10.024-.002 5.527-4.502 10.026-10.03 10.026zm5.508-7.514c-.302-.151-1.787-.882-2.064-.984-.277-.101-.48-.151-.681.151-.202.302-.782.984-.959 1.185-.176.202-.353.227-.655.076-1.664-.84-2.836-1.89-3.923-3.744-.202-.344.202-.317.492-.897.101-.202.05-.378-.025-.53-.076-.151-.681-1.64-.932-2.245-.246-.59-.496-.51-.681-.519-.176-.01-.378-.01-.58-.01-.202 0-.53.076-.807.378-.277.302-1.058 1.034-1.058 2.52s1.084 2.923 1.235 3.125c.151.202 2.13 3.252 5.161 4.56.721.311 1.283.497 1.723.636.723.23 1.381.197 1.902.12.583-.086 1.787-.73 2.04-1.436.252-.705.252-1.31.176-1.436-.076-.126-.277-.202-.58-.353z" />
          </svg>
        </a>
      )}

      {/* Phone FLOAT BADGE */}
      {phone && (
        <a
          href={telLink}
          className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-[#0a0a0a] text-primary border border-white/10 rounded-full shadow-2xl hover:bg-[#1a1a1a] hover:border-primary/50 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-75 pointer-events-none'
          }`}
          style={{ transitionDelay: '50ms' }}
          aria-label="Call Us"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </a>
      )}

      {/* SCROLL TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        className={`w-12 h-12 bg-primary text-black rounded-full shadow-2xl flex items-center justify-center font-black transition-all duration-500 transform hover:bg-white hover:scale-110 active:scale-95 cursor-pointer focus:outline-none ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-75 pointer-events-none'
        }`}
        style={{ transitionDelay: '150ms' }}
        aria-label="Scroll to top"
      >
        <span className="text-lg font-sans">↑</span>
      </button>
    </div>
  );
}
