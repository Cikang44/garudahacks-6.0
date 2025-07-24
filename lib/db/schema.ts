import { drizzle } from 'drizzle-orm/neon-http';
import { boolean, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { assert } from 'console';

assert(process.env.DATABASE_URL, 'DATABASE_URL must be set in the environment variables');
const db = drizzle(process.env.DATABASE_URL ?? "");

// Tables

export const usersTable = pgTable('users', {
    id: uuid('id').primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    daerahId: integer('daerah_id').notNull(),
    placementQuota: integer('placement_quota').notNull().default(3),
});

export const daerahTable = pgTable('daerah', {
    id: uuid('id').primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    name: varchar('name', { length: 255 }).notNull(),
});

export const patternsTable = pgTable('patterns', {
    id: uuid('id').primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    daerahId: uuid('daerah_id').notNull(),
});

export const apparelTable = pgTable('apparel', {
    id: uuid('id').primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    closedAt: timestamp('closed_at').notNull().defaultNow(),
    data: jsonb('data').notNull().default({}),
});

export const userApparelTable = pgTable('user_apparel', {
    userId: uuid('user_id').notNull(),
    apparelId: uuid('apparel_id').notNull(),
}, (table) => [
    primaryKey({ columns: [table.userId, table.apparelId] }),
]);

export const shopItemsTable = pgTable('shop_items', {
    id: uuid('id').primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    isPurchasable: boolean('is_purchasable').notNull().default(true),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    price: integer('price').notNull(),
    objectKey: varchar('object_key', { length: 255 }).notNull(),
    stock: integer('stock').notNull().default(0),
});

export const transactionsTable = pgTable('transactions', {
    id: uuid('id').primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    itemId: uuid('item_id').notNull(),
    buyerId: uuid('buyer_id').notNull(),
    quantity: integer('quantity').notNull().default(1),
});

// Relations

export const usersRelations = relations(usersTable, ({ one, many }) => ({
    daerah: one(daerahTable, {
        fields: [usersTable.daerahId],
        references: [daerahTable.id],
    }),
    transactions: many(transactionsTable),
}));

export const userApparelRelations = relations(userApparelTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [userApparelTable.userId],
        references: [usersTable.id],
    }),
    apparel: one(apparelTable, {
        fields: [userApparelTable.apparelId],
        references: [apparelTable.id],
    }),
}));

export const daerahRelations = relations(daerahTable, ({ one }) => ({
    users: one(usersTable, {
        fields: [daerahTable.id],
        references: [usersTable.daerahId],
    }),
    patterns: one(patternsTable, {
        fields: [daerahTable.id],
        references: [patternsTable.daerahId],
    }),
}));

export const patternsRelations = relations(patternsTable, ({ one }) => ({
    user: one(daerahTable, {
        fields: [patternsTable.daerahId],
        references: [daerahTable.id],
    }),
}));

export const shopItemsRelations = relations(shopItemsTable, ({ many }) => ({
    transactions: many(transactionsTable),
}));

export const transactionsRelations = relations(transactionsTable, ({ one }) => ({
    item: one(shopItemsTable, {
        fields: [transactionsTable.itemId],
        references: [shopItemsTable.id],
    }),
    buyer: one(usersTable, {
        fields: [transactionsTable.buyerId],
        references: [usersTable.id],
    }),
}));