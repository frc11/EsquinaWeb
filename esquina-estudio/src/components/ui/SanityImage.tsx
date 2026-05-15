import Image from "next/image";

type SanityImageProps = {
  // TODO: Define proper Sanity image type
  src?: string;
  alt?: string;
};

export default function SanityImage({ src, alt }: SanityImageProps) {
  if (!src) return null;
  return <Image src={src} alt={alt ?? ""} fill />;
}
