import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaRegister } from "@/components/pwa-register";
import { Toaster } from "sonner";
import { getSiteProfile } from "@/lib/queries";
import { hexToRgba, sanitizeAccentHex } from "@/lib/accent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://olehi-davis-portfolio.vercel.app";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Olehi Davis — Software & Electronics Engineer",
  description:
    "Portfolio and technical blog of Olehi Davis — Web Developer, Desktop & Mobile App Developer, and Electronics Engineer.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Olehi Davis",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Olehi Davis",
    title: "Olehi Davis — Software & Electronics Engineer",
    description:
      "Web Developer, Desktop & Mobile App Developer, and Electronics Engineer. Explore projects, experience, and technical notes.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Olehi Davis — Software & Electronics Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Olehi Davis — Software & Electronics Engineer",
    description:
      "Web Developer, Desktop & Mobile App Developer, and Electronics Engineer.",
    images: ["/opengraph-image"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getSiteProfile();
  const accentHex = sanitizeAccentHex(profile?.accent_color);
  const accentMuted = hexToRgba(accentHex, 0.15);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { --accent: ${accentHex}; --accent-muted: ${accentMuted}; }`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PwaRegister />
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
