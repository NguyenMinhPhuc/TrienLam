"use client";

import Image from 'next/image';
import { useState } from 'react';

interface CmsImageProps {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
}

const DEFAULT_FALLBACK = '/window.svg';

export default function CmsImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className,
  sizes = '100vw',
  preload = false,
}: CmsImageProps) {
  const normalizedSrc = src?.trim() || fallbackSrc;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const resolvedSrc = failedSrc === normalizedSrc ? fallbackSrc : normalizedSrc;

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      unoptimized
      className={className}
      onError={() => setFailedSrc(normalizedSrc)}
    />
  );
}
