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
  const [visibleItems, setVisibleItems] = useState<number>(4);
  const [currentItems, setCurrentItems] = useState<T[]>(items);

  const updateVisibleItems = () => {
    if (window.innerWidth < 640) {
      setVisibleItems(1);
    } else if (window.innerWidth < 900) {
      setVisibleItems(2);
    } else if (window.innerWidth < 1200) {
      setVisibleItems(3);
    } else {
      setVisibleItems(4);
    }
  };

  useEffect(() => {
    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
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
    <div className="relative flex flex-row justify-around items-center mx-auto w-full max-w-[1400px] p-10 gap-4">
      <button
        className="relative right-0 top-[-50px] flex items-center justify-center bg-deep_blue text-white p-2 rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="text-gray-400 group-hover:text-white" />
      </button>
      <div className="flex justify-evenly w-full gap-12">
        {currentItems.slice(0, visibleItems).map((item, index) => (
          <ItemComponent key={index} {...item} />
        ))}
      </div>
      <button
        className="relative left-0 top-[-50px] flex items-center justify-center bg-deep_blue text-white p-2 rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="text-gray-200 group-hover:text-white" />
      </button>
    </div>
  );
}
