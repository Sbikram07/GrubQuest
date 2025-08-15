



import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useItem } from "@/context/ItemContext";

// import local images (adjust paths if your folder structure differs)
import biriyani from "@/assets/biriyani.jpeg";
import burger from "@/assets/burger.jpeg";
import pizza from "@/assets/pizza.jpeg";
import chilliChicken from "@/assets/chilli chicken.jpeg";

const slides = [
  {
    image: biriyani,
    tagline: "Desi Flavors, Straight to Your Door.",
  },
  {
    image: burger,
    tagline: "Hot & Fresh, Just for You.",
  },
  {
    image: pizza,
    tagline: "Savor Every Bite of Tradition.",
  },
  {
    image: chilliChicken,
    tagline: "Spice That Speaks to Your Soul.",
  },
];

// simple debounce hook
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function SearchBanner() {
  const { getItemsByCategory } = useItem();
  const [category, setCategory] = useState("Category");
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebouncedValue(query, 300);

  const [current, setCurrent] = useState(0);
const intervalRef = useRef(null);


  const handleSearch = useCallback(() => {
    if (category === "Category" && !debouncedQuery.trim()) return;

    let searchString = "";
    if (category !== "Category") searchString += category;
    if (debouncedQuery.trim()) {
      if (searchString) searchString += "-";
      searchString += debouncedQuery.trim().toLowerCase();
    }

    getItemsByCategory(searchString.replace(/\s+/g, "-"));
  }, [category, debouncedQuery, getItemsByCategory]);

  useEffect(() => {
    // auto-advance slides
    intervalRef.current = window.setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // trigger search when debounced query changes (optional)
  // useEffect(() => {
  //   handleSearch();
  // }, [debouncedQuery, category, handleSearch]);

  return (
    <section className="relative h-[500px] w-full mx-auto overflow-hidden">
      {/* Background slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${slide.image}')`,
            opacity: idx === current ? 1 : 0,
            zIndex: idx === current ? 5 : 1,
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4">
        <div className="bg-white/40 backdrop-blur-sm rounded-md flex w-full max-w-xl items-center overflow-hidden shadow-lg border-amber-600 border-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border-r border-gray-300 outline-none bg-transparent text-gray-800"
          >
            <option>Category</option>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
            <option value="snacks">Snacks</option>
          </select>
          <Input
            className="flex-1 border-none focus-visible:ring-0 text-gray-800 bg-transparent"
            placeholder="Search here"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <div className="flex items-center px-4 cursor-pointer">
            <Search className="text-gray-600" onClick={handleSearch} />
          </div>
        </div>

        <h1 className="text-white text-2xl md:text-3xl font-semibold mt-10 text-center transition-opacity duration-500">
          {slides[current].tagline}
        </h1>
      </div>
    </section>
  );
}
