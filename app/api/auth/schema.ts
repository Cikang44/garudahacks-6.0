import { Static, Type as t } from "@sinclair/typebox";
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const authPutBodySchema = t.Object({
    clerkId: t.String(),
    name: t.Optional(t.String({ minLength: 2, maxLength: 255 })),
    daerahId: t.Optional(t.String()),
});
export const authPutBodySchemaCompiler = TypeCompiler.Compile(authPutBodySchema);
export type TAuthPutBody = Static<typeof authPutBodySchema>;