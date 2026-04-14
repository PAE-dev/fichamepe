"use client";

import { Children, isValidElement } from "react";

export function SwipeCards({ children }: { children: React.ReactNode }) {
  const items = Children.toArray(children);

  return (
    <div className="fp-scroll-x -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:hidden">
      {items.map((child, index) => (
        <div
          key={
            isValidElement(child) && child.key != null
              ? String(child.key)
              : `swipe-${index}`
          }
          className="min-w-[82%] snap-start"
        >
          {child}
        </div>
      ))}
    </div>
  );
}
