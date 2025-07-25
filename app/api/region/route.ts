import { db } from "@/lib/db";

export async function GET() {
    const regions = await db.query.daerahTable.findMany().execute();
    return Response.json(regions);
}