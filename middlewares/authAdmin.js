import { clerkClient } from('@clerk/clerk-sdk-node');

const authAdmin = async (userid) => {
    try {
        if(!userid) return false

        const client = await clerkClient()
        const user = await client.users.getUser(userid)

        return process.env.ADMIN_EMAILS.split(",").includes(user.emailAddresses[0].emailAddress)

    }catch (error) {
        console.error(error)
            return false
        }
    }

    export default authAdmin  