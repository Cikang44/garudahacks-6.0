import { db } from "@/lib/db";
import { shopItemsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");
    if (!productId) {
        return new Response(JSON.stringify({ error: "Product ID is required" }), {
            status: 400,
        });
    };

    const product = await db.query.shopItemsTable.findFirst({
        where: eq(shopItemsTable.id, productId),
    });

    if (!product) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
            status: 404,
        });
    }

    return new Response(JSON.stringify(product), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}