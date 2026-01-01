"use client";

import { useEffect } from 'react';

export function Polyfill() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.Buffer = window.Buffer || require('buffer').Buffer;
    }
  }, []);
  return null;
}
