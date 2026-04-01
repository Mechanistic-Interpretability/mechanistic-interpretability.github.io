"use client";

import Image from "next/image";
import { useState } from "react";

export default function GridImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <div className="w-full h-full relative">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover w-full h-full"
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}