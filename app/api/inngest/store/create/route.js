import {getAuth} from '@clerk/nextjs/server';

export async function POST(req) {
    try {
        const {userId} = getAuthh(request)
        const formData = await request.formData()

    }catch (error) {
    }
}