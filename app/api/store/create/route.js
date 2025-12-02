import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import ImageKit from '@imagekit/nodejs';
import { transform } from 'next/dist/build/swc/generated-native';
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

        if (isUsernameTaken) {
            return NextResponse.json({ error: "username already taken" }, { status: 400 })
        }

        // image upload to imagekit
        const buffer = Buffer.from(await image.arrayBuffer())
        const response = await imaagekit.upload({
            file: buffer,
            fileName: image.name,
            folder: "logos"
        })

        const optimizedImage = imagekit.url({
            Path: response.filePath,
            transformation: [
                { quality: "auto" },
                { format: "webp" },
                { width: "200" }
            ]
        })

        const newStore = await prisma.store.create({
            data: {
                userId,
                name,
                description,
                username: username.toLowerCase(),
                email,
                contact,
                address,
                logo: optimizedImage,
            }
        })

        // link store to user's profile
        await prisma.user.update({
            where: { id: userId },
            data: { store: { connect: { id: newStore.id } } }
        })

        return NextResponse.json({ message: "applying, waiting for approval" })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

// check if user have already registered store if yes then send status of store

export async function GET(request) {
    try {
        const { userId } = getAuth(request)

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

        return NextResponse.json({ status: "not registered" })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}