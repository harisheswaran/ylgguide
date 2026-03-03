'use client';

export default function CategoryFilter({ categories, activeCategory, onSelectCategory }) {
    return (
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar">
            <button
                onClick={() => onSelectCategory(null)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === null
                        ? 'bg-[#1F3D2B] text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
            >
                All Items
            </button>

            {categories.map((category) => (
                <button
                    key={category._id}
                    onClick={() => onSelectCategory(category.slug)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category.slug
                            ? 'bg-[#1F3D2B] text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
