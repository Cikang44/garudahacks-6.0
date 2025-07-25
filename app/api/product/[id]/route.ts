import { db } from "@/lib/db";
import { shopItemsTable } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: productId } = await params;
    if (!productId) {
        return new Response(JSON.stringify({ error: "Product ID is required" }), {
            status: 400,
        });
    };

    const product: any = await db.query.shopItemsTable.findFirst({
        where: and(eq(shopItemsTable.id, productId), eq(shopItemsTable.isPurchasable, true)),
        with: {
            apparel: {
                columns: {
                    closedAt: true,
                },
                with: {
                    userApparel: {
                        columns: {},
                        with: {
                            user: {
                                columns: {
                                    name: true,
                                }
                            },
                        },
                    }
                }
            }
        }
    });

    if (!product) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
            status: 404,
        });
    }

    product.contribution = product.apparel.userApparel.map((u: any) => u.user.name);
    product.closedAt = product.apparel.closedAt;
    delete(product.apparel);

    return new Response(JSON.stringify(product), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}