import type { Metadata, Viewport } from "next";
import { Barlow } from "next/font/google";
import { siteUrl } from "@/lib/data";
import "./globals.css";

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-barlow", display: "swap" });

const title = "Ayush Aryal – Software builder, Hetauda, Nepal";
const description =
  "Ayush Aryal is a self-taught software developer in Hetauda, Nepal, building websites, Android apps and billing systems for real businesses.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Ayush Aryal" },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", siteName: "Ayush Aryal", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dfe4ec" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1f27" },
  ],
};

const themeScript = `try{var d=document.documentElement,t=localStorage.getItem("theme");d.dataset.theme=t==="light"?"light":"dark";d.classList.add("js")}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={barlow.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
