// components/ui/CategoryStrip.tsx


export default function CategoryStrip({
  categories,
}) {
  return (
    <div className="overflow-x-auto px-6 py-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
         
          <div key={i} className="flex flex-col items-center py-2 group">
           
            <div
              className="w-40 h-40 rounded-full border-[4px] border-orange-500 overflow-hidden flex items-center justify-center 
                  transition-all duration-300 ease-out transform group-hover:scale-110 group-hover:shadow-[0_10px_30px_rgba(249,115,22,0.5)] group-hover:border-orange-400"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                src={cat.icon}
                alt={cat.name}
              />
            </div>
            <p className="mt-2 text-center text-sm font-medium text-gray-700 transition-colors duration-300 group-hover:text-orange-500">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
