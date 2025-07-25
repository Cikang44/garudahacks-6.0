import { Static, Type as t } from "@sinclair/typebox";
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const regionSchema = t.Object({
    id: t.String({ format: 'uuid' }),
    createdAt: t.String({ format: 'date-time' }),
    updatedAt: t.String({ format: 'date-time' }),
    name: t.String({ maxLength: 255 }),
});
export const regionSchemaCompiler = TypeCompiler.Compile(regionSchema);
export type TRegion = Static<typeof regionSchema>;