'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundVideo({ src, poster }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const play = () => v.play().catch(() => {});
    if (v.readyState >= 2) play();
    v.addEventListener('loadeddata', play);
    v.addEventListener('canplay', play);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) play();
    });
    const onFirstInteraction = () => {
      play();
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };
    window.addEventListener('pointerdown', onFirstInteraction);
    window.addEventListener('keydown', onFirstInteraction);
    return () => {
      v.removeEventListener('loadeddata', play);
      v.removeEventListener('canplay', play);
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      key={src}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster || undefined}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
