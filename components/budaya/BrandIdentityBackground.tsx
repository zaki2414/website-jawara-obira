"use client";

export function BrandIdentityBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute -right-28 top-16 w-80 h-80 rounded-full bg-linear-to-br from-primary/18 via-transparent to-transparent blur-3xl opacity-30" />
      <div className="absolute -left-28 bottom-20 w-80 h-80 rounded-full bg-linear-to-br from-tertiary/18 via-transparent to-transparent blur-3xl opacity-24" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.1),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.07),_transparent_30%)]" />
    </div>
  );
}
