import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//get dash board stats
export async function GET(request) {
    try {
        const { userId} = getAuth(request)
    const isAdmin = await authAdmin(userId)

    if(!isAdmin) {
       return NextResponse.json({error: " not authorized"}, {status: 401});
    }

    //get total orders
    const orders = await prisma.order.count()
    //get total stors on app
    const stores = await prisma.store.count()
    //get all orders inc created and total calculate revenue
  const allOrders = await prisma.order.findMany({
    select: { createdAt: true, total: true }
});

    let totalrevenue = 0
    allOrders.forEach(order => {
        totalRevenue += order.total
    })
    const revenue = totalRevenue.toFixed(2)

    const products = await prisma.product.count()
    const dashboardData = {
        orders,
        stores,
        revenue,
        products,
        allOrders
    }
 return NextResponse.json({dashboardData})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

    
