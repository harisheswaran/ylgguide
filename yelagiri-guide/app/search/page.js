import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';

async function searchListings(query) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/listings?q=${encodeURIComponent(query)}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

export default async function SearchPage({ searchParams }) {
    const query = searchParams.q || '';
    const results = await searchListings(query);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12 pt-28">
                <h1 className="text-3xl font-bold mb-2">Search Results</h1>
                <p className="text-muted-foreground mb-8">
                    Showing results for &quot;{query}&quot;
                </p>

                {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((item) => (
                            <ListingCard key={item.id} {...item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground mb-4">No results found.</p>
                        <Link href="/" className="text-primary hover:underline">
                            Go back home
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
