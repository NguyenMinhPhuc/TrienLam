interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <span className={`font-display inline-flex items-center gap-1.5 text-xl font-bold tracking-[-0.025em] ${className}`} aria-hidden="true">
      <span className="text-lhu-orange">LHU</span>
      <span className="text-[#4aa6dc]">TECH HUB</span>
    </span>
  );
}
