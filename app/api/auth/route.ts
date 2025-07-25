import { NextRequest } from "next/server";
import { authPutBodySchemaCompiler, TAuthPutBody } from "./schema";
import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { auth, currentUser } from "@clerk/nextjs/server";

// export async function GET(req: NextRequest) {
//     const { userId: clerkId } = await auth();
//     if (!clerkId) {
//         return new Response(JSON.stringify({ error: "User not authenticated" }), {
//             status: 401,
//             headers: { "Content-Type": "application/json" },
//         });
//     }
//     const user = await db.query.usersTable.findFirst({
//         where: eq(usersTable.clerkId, clerkId),
//     });
//     if (!user) {
//         return new Response(JSON.stringify({ error: "User not found" }), {
//             status: 404,
//             headers: { "Content-Type": "application/json" },
//         });
//     }
//     return new Response(JSON.stringify(user), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//     });
// }

export async function PUT(req: NextRequest) {
    const data: TAuthPutBody = await req.json();
    const err = [...authPutBodySchemaCompiler.Errors(data)];
    if (err.length > 0) {
        return new Response(JSON.stringify({ error: "Invalid request body", details: err }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.clerkId, data.clerkId),
    });
    if (existingUser) {
        await db.update(usersTable)
            .set({
                ...(data.name ? { name: data.name } : {}),
                ...(data.daerahId ? { daerahId: data.daerahId } : {}),
                updatedAt: new Date(),
            })
            .where(eq(usersTable.clerkId, data.clerkId))
            .execute();
    } else {
        const user = await currentUser();

        if (!user) {
            return new Response(JSON.stringify({ error: "User not authenticated" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        let displayName = data.name;

        if (!displayName) {
            if (user.firstName || user.lastName) {
                displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            } else if (user.fullName) {
                displayName = user.fullName;
            } else if (user.emailAddresses?.[0]?.emailAddress) {
                displayName = user.emailAddresses[0].emailAddress.split('@')[0];
            } else {
                displayName = 'Unknown User';
            }
        }

        await db.insert(usersTable).values({
            id: uuidv4(),
            clerkId: data.clerkId,
            name: displayName,
            daerahId: data.daerahId ? String(data.daerahId) : "0000-0000-0000-0000",
        }).execute();
    }

    return new Response();
}