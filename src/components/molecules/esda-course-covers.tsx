"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const courses = [
  {
    key: "gezondheid",
    image_url: "https://esda-instituut.nl/wp-content/uploads/2025/09/Gezondheid.png",
    course_url: "https://esda-instituut.nl/cursus/gezondheid/",
  },
  {
    key: "koningschap",
    image_url: "https://esda-instituut.nl/wp-content/uploads/2025/09/Het_KvG.png",
    course_url: "https://esda-instituut.nl/cursus/het-koningschap-van-god/",
  },
  {
    key: "archeologie",
    image_url: "https://esda-instituut.nl/wp-content/uploads/2025/09/Archeologie.png",
    course_url: "https://esda-instituut.nl/cursus/archeologie/",
  },
];

export const EsdaCourseCovers = () => {
  const t = useTranslations("esda-courses");

  return (
    <div className="grid h-[340px] w-[300px] grid-cols-2 grid-rows-2 gap-3 sm:h-[380px] sm:w-[340px]">
      {/* Column 1 — two stacked images */}
      {courses.slice(0, 2).map((course, i) => (
        <Link
          key={course.key}
          href={course.course_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative overflow-hidden rounded-md shadow-lg ${
            i === 0 ? "row-start-1" : "row-start-2"
          } col-start-1`}
        >
          <Image
            src={course.image_url}
            alt={t(`course-${course.key}`)}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 200px"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/55">
            <span
              className="translate-y-2 px-2 text-center text-sm font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              {t(`course-${course.key}`)}
            </span>
          </div>
        </Link>
      ))}

      {/* Column 2 — one full-height image */}
      <Link
        href={courses[2].course_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative col-start-2 row-span-2 overflow-hidden rounded-md shadow-lg"
      >
        <Image
          src={courses[2].image_url}
          alt={t(`course-${courses[2].key}`)}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 200px"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/55">
          <span
            className="translate-y-2 px-2 text-center text-sm font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            {t(`course-${courses[2].key}`)}
          </span>
        </div>
      </Link>
    </div>
  );
};
