"use client";

import { cn } from "@/utils/tailwind-merge";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--space-grotesk",
});

export default function NotFound() {
  return (
    <html>
      <body
        className={cn(
          spaceGrotesk.className,
          "bg-whitish-beige flex h-screen w-screen items-center justify-center",
        )}
      >
        <div>
          <h1 className="text-xl text-white">Something went wrong!</h1>
          <p className="text-lg">Page not found</p>
        </div>
      </body>
    </html>
  );
}
