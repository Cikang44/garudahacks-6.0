import { boolean, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Tables

export const usersTable = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    name: varchar('name', { length: 255 }).notNull(),
    daerahId: uuid('daerah_id').notNull(),
    placementQuota: integer('placement_quota').notNull().default(3),
});

export const daerahTable = pgTable('daerah', {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    name: varchar('name', { length: 255 }).notNull().unique(),
});

export const patternsTable = pgTable('patterns', {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    daerahId: uuid('daerah_id').notNull(),
    imageUrl: varchar('image_url', { length: 511 }).notNull(),
});

export const apparelTable = pgTable('apparel', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
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
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    apparelId: uuid('apparel_id').notNull(),
    isPurchasable: boolean('is_purchasable').notNull().default(true),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    price: integer('price').notNull(),
    imageUrl: varchar('image_url', { length: 511 }).notNull(),
    stock: integer('stock').notNull().default(0),
});

export const transactionsTable = pgTable('transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
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

export const apparelRelations = relations(apparelTable, ({ many }) => ({
    shopItems: many(shopItemsTable),
    userApparel: many(userApparelTable),
}));

export const daerahRelations = relations(daerahTable, ({ one, many }) => ({
    users: one(usersTable, {
        fields: [daerahTable.id],
        references: [usersTable.daerahId],
    }),
    patterns: many(patternsTable),
}));

export const patternsRelations = relations(patternsTable, ({ one }) => ({
    user: one(daerahTable, {
        fields: [patternsTable.daerahId],
        references: [daerahTable.id],
    }),
}));

export const shopItemsRelations = relations(shopItemsTable, ({ one, many }) => ({
    transactions: many(transactionsTable),
    apparel: one(apparelTable, {
        fields: [shopItemsTable.apparelId],
        references: [apparelTable.id],
    }),
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