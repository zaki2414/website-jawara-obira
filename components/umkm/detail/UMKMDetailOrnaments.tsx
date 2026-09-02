"use client";

import Image from "next/image";

export function UMKMDetailOrnaments() {
  return (
    <>
      {/* Desktop Ornaments */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute -right-20 top-1/4 w-80 h-80 opacity-35 animate-[spin_35s_linear_infinite]">
          <Image
            src="/Hiasan 5.svg"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
        <div className="absolute -left-20 bottom-1/4 w-72 h-72 opacity-35 animate-[spin_35s_linear_infinite_reverse]">
          <Image
            src="/Hiasan 5.svg"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Mobile Subtle Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none lg:hidden opacity-10">
        <div className="absolute -top-12 -right-12 w-40 h-40">
          <Image
            src="/Hiasan 5.svg"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40">
          <Image
            src="/Hiasan 5.svg"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
      </div>
    </>
  );
}
