'use client';
import { useEffect } from 'react';

export default function FileLimit() {
  useEffect(() => {
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && target.type === 'file' && target.files && target.files.length > 0) {
        let hasLargeFile = false;
        for (let i = 0; i < target.files.length; i++) {
          if (target.files[i].size > 2 * 1024 * 1024) {
            hasLargeFile = true;
            break;
          }
        }
        if (hasLargeFile) {
          alert("Please upload images smaller than 2MB.");
          target.value = ""; // Clear the file input
        }
      }
    };
    // Use capture phase to intercept before React synthetic events
    document.addEventListener('change', handleFileChange, true);
    return () => document.removeEventListener('change', handleFileChange, true);
  }, []);

  return null;
}
