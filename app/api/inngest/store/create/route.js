import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Create the store
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        // Get the data from the form
        const formData = await request.formData()
        const name = formData.get('name')
        const username = formData.get('username')
        const description = formData.get('description')
        const email = formData.get('email')
        const contact = formData.get('contact')
        const address = formData.get('address')
        const image = formData.get('image')

        if (!name || !username || !description || !email || !contact || !address || !image) {
            return NextResponse.json({ error: 'missing store info' }, { status: 400 })
        }

        // Check if the user already has a store
        const store = await prisma.store.findFirst({
            where: {
                userId: userId
            }
        })

        // If store is already registered then send status of store
        if (store) {
            return NextResponse.json({ store: store.status })
        }

        // Check if username is already taken
        const isUsernameTaken = await prisma.store.findFirst({
            where: { username: username.toLowerCase() }
        })

        if(isUsernameTaken) {
            return NextResponse.json({error: "username already taken"}, {status: 400})
        }

        
    } catch (error) {

    }
}