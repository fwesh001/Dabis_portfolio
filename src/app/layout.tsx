import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
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

export const metadata: Metadata = {
  metadataBase: new URL('https://olehidavis.dev'),
  title: "Olehi Davis — Senior Software Engineer",
  description: "Senior Software Engineer specializing in distributed systems, high-throughput backend services, and modern web architecture.",
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
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
