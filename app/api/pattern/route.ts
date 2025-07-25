import { db } from "@/lib/db";
import { apparelTable, usersTable } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        return new Response(JSON.stringify({ error: "User not authenticated" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.clerkId, clerkId),
        with: {
            daerah: {
                with: {
                    patterns: true,
                }
            }
        }
    });

    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(user.daerah.patterns));
}