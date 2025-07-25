import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { apparelTable } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {

    const {data,id} = await request.json();

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ message: 'Invalid grid data.' }, { status: 400 });
    }

    await db
      .update(apparelTable)
      .set({
        data,
      })
      .where(eq(apparelTable.id, id)).execute();
      

    return NextResponse.json({ message: 'Grid saved successfully!'}, { status: 201 });

  } catch (error) {
    console.error('Failed to save grid:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}