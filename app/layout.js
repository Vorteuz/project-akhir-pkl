import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ISP Portal",
  description: "Customer Portal & Admin Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="corporate">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-200 min-h-screen text-base-content`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
