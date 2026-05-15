import Link from "next/link";

interface LogoScriptProps {
  className?: string;
  size?: "sm" | "md";
}

/**
 * Placeholder logo component.
 * Renders "esquina estudio" in cursive until the real SVG asset is provided.
 */
export default function LogoScript({
  className = "",
  size = "md",
}: LogoScriptProps) {
  const sizeClasses = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <Link href="/" className={`inline-block ${className}`}>
      <span
        className={`${sizeClasses} italic tracking-tight`}
        style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
      >
        esquina estudio
      </span>
    </Link>
  );
}
