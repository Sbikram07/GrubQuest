// components/ui/FeatureCard.tsx

import { cn } from "@/lib/utils";

export default function FeatureCard({
  title,
  description,
  imageUrl,
}) {
  return (
    <div className="group bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-md hover:shadow- hover:shadow-[0_4px_20px_rgba(30,41,59,0.4)] transition-shadow p-6 flex flex-col items-center text-center gap-4">
      <img
        src={imageUrl}
        alt={title}
        className="w-16 h-16 object-contain transition-transform duration-200 group-hover:scale-110"
      />
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
