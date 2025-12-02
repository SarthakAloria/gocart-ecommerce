import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// get store info & store products
export async function GET(request) {
    try {
        // get store username from querry params
        const { searchParams } = new URl(request.url)
        const username = searchParams.get('username').toLowerCase();

        if (!username) {
            return NextResponse.json({ error: 'missing username' }, { status: 400 })
        }

        const store = await prisma.store.findUnique({
            where: { username, isActive: true },
            include: { Product: { include: { rating: true } } }
        })

        if (!store) {
            return NextResponse.json({ error: 'store not found' }, { status: 400 })
        }

        return NextResponse.json({ store })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}