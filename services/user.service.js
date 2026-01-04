import { userTable } from "../models/index.js";
import db from "../db/index.js";
import { eq } from "drizzle-orm";


export const getUserByEmail = async (email) => {
    const [user] = await db.select()
        .from(userTable)
        .where(eq(userTable.email, email));
    return user;
};
