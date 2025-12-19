'use client';

export default function SortBar({ sort, setSort }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
                <option value="">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Top Rated</option>
                <option value="distance">Distance from me</option>
            </select>
        </div>
    );
}
