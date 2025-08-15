"use client";
import { cn } from "@/lib/utils";

export default function CardDemo({ title, description, imageUrl, hoverGif }) {
  return (
    <div className="max-w-xs w-full">
      <div
        className={cn(
          "group w-full cursor-pointer overflow-hidden relative h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800 transition-all duration-500"
        )}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Hover background overlay layer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            backgroundImage: `url(${hoverGif})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        {/* Text content */}
        <div className="relative z-20 text-black">
          <h1 className="font-bold text-xl md:text-2xl">{title}</h1>
          <p className="text-base mt-2">{description}</p>
        </div>
      </div>
    </div>
  );
}
