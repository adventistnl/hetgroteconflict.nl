"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps<T> {
  items: T[];
  ItemComponent: React.ComponentType<T>;
}

export default function Carousel<T>({
  items,
  ItemComponent,
}: CarouselProps<T>): JSX.Element {
  const checkScreenSize = () => {
    if (window.innerWidth <= 640) {
      return 1;
    } else if (window.innerWidth < 900 && window.innerWidth > 640) {
      return 2;
    } else if (window.innerWidth < 1200) {
      return 3;
    } else {
      return 4;
    }
  };

  const [visibleItems, setVisibleItems] = useState<number>(checkScreenSize);
  const [currentItems, setCurrentItems] = useState<T[]>(items);

  const updateVisibleItems = () => {
    const count = checkScreenSize();
    setVisibleItems(count);
  };

  useEffect(() => {
    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);

    return () => {
      window.removeEventListener("resize", updateVisibleItems);
    };
  }, []);

  const prevSlide = (): void => {
    setCurrentItems((prevItems) => {
      const lastItem = prevItems.pop();
      if (lastItem) {
        return [lastItem, ...prevItems];
      }
      return prevItems;
    });
  };

  const nextSlide = (): void => {
    setCurrentItems((prevItems) => {
      const [firstItem, ...rest] = prevItems;
      return [...rest, firstItem];
    });
  };
  return (
    <div className="relative mx-auto flex w-full max-w-[1400px] flex-row items-center justify-around gap-4 p-10">
      <button
        className="relative right-0 top-[-50px] flex items-center justify-center rounded-full bg-deep_blue p-2 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="text-gray-400 group-hover:text-white" />
      </button>
      <div className="flex w-full justify-evenly gap-12">
        {currentItems.slice(0, visibleItems).map((item, index) => (
          <ItemComponent key={index} {...item} />
        ))}
      </div>
      <button
        className="relative left-0 top-[-50px] flex items-center justify-center rounded-full bg-deep_blue p-2 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="text-gray-200 group-hover:text-white" />
      </button>
    </div>
  );
}
