import Image, { type ImageProps } from "next/image";

/** Local files and Supabase Storage go through Next's optimizer; any other https host is served as-is instead of crashing the page. */
const optimizable = (src: string) => src.startsWith("/") || /^https:\/\/[^/]+\.supabase\.co\//.test(src);

export function SafeImage({ src, alt, ...rest }: Omit<ImageProps, "src" | "alt"> & { src: string; alt: string }) {
  return <Image src={src} alt={alt} unoptimized={rest.unoptimized ?? !optimizable(src)} {...rest} />;
}
