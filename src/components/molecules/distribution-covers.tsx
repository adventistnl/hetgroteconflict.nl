"use client";

import Image from "next/image";

export const DistributionCovers = () => {
  return (
    <div className="flex flex-wrap md:flex-no-wrap justify-center gap-3 p-8">
      <div className="flex flex-col gap-3">
        <Image
          src=""
          alt="image"
          width={275}
          height={275}
          className="bg-white rounded-md"
        />
        <Image
          className="bg-white rounded-md"
          src=""
          alt="image"
          width={275}
          height={275}
        />
      </div>

      <Image
        className="bg-white rounded-md"
        src=""
        alt="image"
        width={275}
        height={466}
      />
    </div>
  );
};
