import { pgTable, varchar, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    firstName: varchar(55).notNull(),
    lastName: varchar(55).notNull(),
    email: varchar(255).notNull().unique(),
    password: text().notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow().$onUpdateFn(() => new Date())
});