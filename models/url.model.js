import { pgTable, varchar, uuid, text, timestamp, index, integer } from "drizzle-orm/pg-core";
import { userTable } from "./user.model.js";

export const urlTable = pgTable("urls", {
    id: uuid().primaryKey().defaultRandom(),
    shortCode: varchar(155).notNull().unique(),
    targetUrl: text().notNull(),
    createdAt: timestamp().defaultNow(),
    clickCount: integer().default(0).notNull(),
    userId: uuid()
        .references(() => userTable.id).notNull(),
    updatedAt: timestamp().defaultNow().$onUpdateFn(() => new Date())
},
    (table) => ([
        index("url_short_code_index").on(table.shortCode),
    ])
);