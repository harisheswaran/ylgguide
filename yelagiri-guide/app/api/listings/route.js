import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q');

    try {
        let where = {};

        if (category) {
            where.category = {
                slug: category
            };
        }

        if (query) {
            where.OR = [
                { name: { contains: query } }, // Case-insensitive search is database dependent, SQLite is case-insensitive by default for ASCII
                { description: { contains: query } }
            ];
        }

        const listings = await prisma.listing.findMany({
            where,
            include: {
                category: true
            }
        });

        return NextResponse.json(listings);
    } catch (error) {
        console.error('Request error', error);
        return NextResponse.json({ error: 'Error fetching listings' }, { status: 500 });
    }
}
