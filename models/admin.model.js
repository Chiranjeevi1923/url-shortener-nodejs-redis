import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";

export const adminTable = pgTable("admins", {
    id: uuid().primaryKey().defaultRandom(),
    firstName: varchar(55).notNull(),
    lastName: varchar(55).notNull(),
    email: varchar(255).notNull().unique(),
    createdAt: timestamp().defaultNow(),
});