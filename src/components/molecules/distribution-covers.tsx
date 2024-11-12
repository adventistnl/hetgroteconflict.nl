"use client";

import Image from "next/image";

export const DistributionCovers = () => {
  return (
    <div className="md:flex-no-wrap flex flex-wrap justify-center gap-3 p-8">
      <div className="flex flex-col gap-3">
        <Image
          src="/trifold-mockup.png"
          alt="image"
          width={275}
          height={275}
          className="h-full rounded-md bg-white shadow-lg transition-all duration-500 hover:scale-105"
        />
        <Image
          className="h-full rounded-md bg-white shadow-lg transition-all duration-500 hover:scale-105"
          src="/mockup-tshirt.jpeg"
          alt="image"
          width={275}
          height={275}
        />
      </div>

      <Image
        className="rounded-md bg-white shadow-lg transition-all duration-500 hover:scale-105"
        src="/street-sign-mockup.jpeg"
        alt="image"
        width={275}
        height={466}
      />
    </div>
  );
};
