import { db } from '../../../lib/db';
import { patternsTable } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request){
    try {
        const {id} = await request.json();
        if(!id){
            return "Pattern not found.";
        }

        const result = await db
            .select({description:patternsTable.description})
            .from(patternsTable)
            .where(eq(patternsTable.id,id))
            .limit(1);
        
        let description: string;
        if (result.length>0){
            description = result[0].description;
        }
        else{
            description = "No description found.";
        }

        return description;
    }
    catch(error){
        console.error('Failed to fetch description:', error);
        return "No description found.";
    }
}