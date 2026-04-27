import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: "text-lg" },
    md: { icon: 24, text: "text-xl" },
    lg: { icon: 32, text: "text-2xl" },
  };
  const { icon, text } = sizes[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-semibold text-[#1B4F72] hover:opacity-90 transition-opacity ${className}`}
      aria-label="HjemTrygg – gå til forsiden"
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L3 8v14h18V8L12 2z"
          fill="#1B4F72"
          stroke="#1B4F72"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M9 22V12h6v10"
          fill="white"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 5l7 4.5v11H5V9.5L12 5z"
          fill="#2E86AB"
          fillOpacity="0.5"
        />
        <path
          d="M10 14h4M12 12v4"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className={`${text} font-semibold`}>HjemTrygg</span>
    </Link>
  );
}
