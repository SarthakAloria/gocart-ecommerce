import {getAuth} from '@clerk/nextjs/server';
import { NextResponse }  from 'next/server';

export async function POST(req) {
    try {
        const {userId} = getAuth(request)
        const formData = await request.formData()

        const name = formData.get("name")
        const username = formData.get("username")
        const description = formData.get("description")
        const email = formData.get("email")
        const contact = formData.get("contact")
        const image = formData.get("image")

        if(!name || !username || !description || !email || !contact || !image)   
            { return NextResponse.json({error: "Missing store info"}, {status: 400})
    }
        const store = await prisma.store.findFirst({
            where: {userId: userId}
        })
         
        if(store) {
            return NextResponse.json({status : store.status})
        }
        const isUsernameTaken = await prisma.store.findFirst({
            where: {username: toLowerCase()}
        })
        if(isUsernameTaken) {
            return NextResponse.json({error: "Username is already taken"}, {status: 400})
        }
        
    


    }catch (error) {
    }
}