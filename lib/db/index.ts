import { drizzle } from 'drizzle-orm/neon-http';
import { assert } from 'console';
import * as schema from './schema';
import { v4 } from 'uuid';

assert(process.env.DATABASE_URL, 'DATABASE_URL must be set in the environment variables');
export const db = drizzle(process.env.DATABASE_URL ?? "", { schema });

// Seed
const regions = ["Nanggroe Aceh Darussalam", "Sumatera Utara", "Sumatera Selatan", "Sumatera Barat", "Bengkulu", "Riau", "Kepulauan Riau","Jambi", "Lampung","Bangka Belitung","Kalimantan Barat", "Kalimantan Timur", "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Utara","Banten", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Daerah Istimewa Yogyakarta", "Jawa Timur", "Bali", "Nusa Tenggara Timur", "Nusa Tenggara Barat", "Gorontalo", "Sulawesi Barat", "Sulawesi Tengah", "Sulawesi Utara", "Sulawesi Tenggara", "Sulawesi Selatan", "Maluku Utara", "Maluku", "Papua Barat", "Papua", "Papua Tengah", "Papua Pegunungan", "Papua Selatan", "Papua Barat Daya"];

await db.insert(schema.daerahTable).values(
  regions.map((region) => ({
    id: v4(),
    name: region,
  })),
).onConflictDoNothing({
    target: schema.daerahTable.name,
});