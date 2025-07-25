import { db } from "@/lib/db";
import { apparelTable, shopItemsTable } from "@/lib/db/schema";
import { eq, lt } from "drizzle-orm";

export async function GET() {
    const products = await db.query.shopItemsTable.findMany({
        where: eq(shopItemsTable.isPurchasable, true),
        columns: {
            id: true,
            name: true,
            imageUrl: true,
        }
    });

    const apparels = await db.query.apparelTable.findMany({
        where: lt(apparelTable.closedAt, new Date()),
        columns: {
            id: true,
            name: true,
        }
    });

    const res = [...products, ...apparels]

    return Response.json(res, {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}