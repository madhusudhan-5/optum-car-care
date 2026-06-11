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
          className={`flex items-center gap-2 sm:gap-3 bg-[#25D366] text-white border border-white/10 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-2xl hover:bg-[#128C7E] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-75 pointer-events-none'
          }`}
          style={{ transitionDelay: '0ms' }}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
              <path d="M12.031 0C5.402 0 .022 5.385.02 12.016c0 2.12.553 4.192 1.603 6.012L0 24l6.115-1.603a11.948 11.948 0 005.914 1.564h.005c6.626 0 12.008-5.383 12.01-12.014C24.041 5.388 18.658 0 12.031 0zm0 19.972h-.004a9.957 9.957 0 01-5.086-1.39l-.365-.216-3.784.992 1.01-3.69-.237-.377a9.946 9.946 0 01-1.523-5.275c.002-5.525 4.502-10.024 10.03-10.024 5.528 0 10.028 4.498 10.028 10.024-.002 5.527-4.502 10.026-10.03 10.026zm5.508-7.514c-.302-.151-1.787-.882-2.064-.984-.277-.101-.48-.151-.681.151-.202.302-.782.984-.959 1.185-.176.202-.353.227-.655.076-1.664-.84-2.836-1.89-3.923-3.744-.202-.344.202-.317.492-.897.101-.202.05-.378-.025-.53-.076-.151-.681-1.64-.932-2.245-.246-.59-.496-.51-.681-.519-.176-.01-.378-.01-.58-.01-.202 0-.53.076-.807.378-.277.302-1.058 1.034-1.058 2.52s1.084 2.923 1.235 3.125c.151.202 2.13 3.252 5.161 4.56.721.311 1.283.497 1.723.636.723.23 1.381.197 1.902.12.583-.086 1.787-.73 2.04-1.436.252-.705.252-1.31.176-1.436-.076-.126-.277-.202-.58-.353z" />
            </svg>
          </div>
          <div className="flex flex-col items-start leading-tight">
            <div className="text-[8px] sm:text-[10px] text-green-100 font-extrabold tracking-widest uppercase">Chat with Us</div>
            <div className="text-white text-[10px] sm:text-xs font-black uppercase tracking-wider">WhatsApp</div>
          </div>
        </a>
      )}

      {/* Phone FLOAT BADGE */}
      {phone && (
        <a
          href={telLink}
          className={`flex items-center gap-2 sm:gap-3 bg-[#0a0a0a] text-white border border-white/10 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-2xl hover:bg-[#1a1a1a] hover:border-primary/50 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-75 pointer-events-none'
          }`}
          style={{ transitionDelay: '50ms' }}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-primary group-hover:text-white transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </div>
          <div className="flex flex-col items-start leading-tight">
            <div className="text-primary text-[8px] sm:text-[10px] font-extrabold tracking-widest uppercase group-hover:text-white transition-colors">Call Us Directly</div>
            <div className="text-white text-[10px] sm:text-xs font-black uppercase tracking-wider">{phone}</div>
          </div>
        </a>
      )}

      {/* GOOGLE REVIEWS FLOAT BADGE */}
      <a
        href={googleReviewLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 sm:gap-3 bg-white text-black border border-gray-200 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-2xl hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-75 pointer-events-none'
        }`}
        style={{ transitionDelay: '100ms' }}
      >
        <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>
        <div className="flex flex-col items-start leading-tight">
          <div className="text-[8px] sm:text-[10px] text-gray-500 font-extrabold tracking-widest uppercase">{config?.review_rating || '5.0'} STARS, {config?.review_count || '205'} REVIEWS</div>
          <div className="text-black text-[10px] sm:text-xs font-black uppercase tracking-wider">Leave a Review</div>
        </div>
      </a>

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
