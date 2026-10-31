import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./styles/globals.css";
import "flag-icons/css/flag-icons.min.css";
import { Analytics } from "@vercel/analytics/next"

// Single primary typeface for the whole site (variable font — every weight
// from 100–900 is available through it, no need to enumerate a weight list).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Display/editorial typeface used for titles site-wide. Exposed as
// --font-fraunces here and consumed as --font-display-accent in
// globals.css (which is what --font-secondary / --font-plus-jakarta-sans —
// the tokens every heading already renders through — resolve to).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Great Controversy Project",
  description:
    "If you want to prepare for the end of this world and the glorious world to come, you must read this book.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} bg-secondary antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
