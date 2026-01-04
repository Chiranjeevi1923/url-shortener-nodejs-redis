import db from "../db/index.js";
import { adminTable, userTable } from "../models/index.js";
import { hashPassword, verifyPassword } from "../utils/hashing.js";
import { getUserByEmail } from "../services/user.service.js";
import { createAccessToken } from "../utils/token.js";
import { loginPostRequestBodySchema, signupPostRequestBodySchema } from "../validations/request.validation.js";
import { z } from "zod";
import { generateFakeAdmin } from "../services/fake-data.service.js";
import { and, asc, desc, ilike, sql } from "drizzle-orm";

export const userSignup = async (req, res) => {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);
    if (validationResult.error) {
        return res.status(400).json({ error: z.treeifyError(validationResult.error) });
    }
    try {
        const { firstname, lastname, email, password } = validationResult.data;

        // Check if user with the same email already exists
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        // Hash the password
        const hash = await hashPassword(password);

        // Insert the new user into the database
        const [newUser] = await db.insert(userTable)
            .values({
                firstName: firstname,
                lastName: lastname,
                email,
                password: hash
            })
            .returning({
                id: userTable.id,
            });

        res.status(201)
            .json({
                message: "User has been registered successfully",
                userId: newUser.id
            });

    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }


}

export const userLogin = async (req, res) => {
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);
    if (validationResult.error) {
        return res.status(400).json({ error: z.treeifyError(validationResult.error) });
    }
    try {
        const { email, password } = validationResult.data;

        const existingUser = await getUserByEmail(email);
        if (!existingUser) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const accessTokenPayload = {
            id: existingUser.id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
        }
        const accessToken = createAccessToken(accessTokenPayload);

        res.status(200).json({
            message: "Login successful",
            accessToken
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
}

// Code for Pagination - with Ag-grid 
export const insertAdminUsers = async (req, res) => {
    try {
        const count = Number(req.query.count) || 10;

        const fakeAdmins = Array.from({ length: count }, generateFakeAdmin);

        const insertedAdmins = await db
            .insert(adminTable)
            .values(fakeAdmins)
            .returning({
                id: adminTable.id,
                email: adminTable.email,
            });

        res.status(201).json({
            message: `${insertedAdmins.length} fake admins inserted`,
            data: insertedAdmins,
        });
    } catch (error) {
        // Handles duplicate email edge case cleanly
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Duplicate email generated. Try again.",
            });
        }

        res.status(500).json({ message: "Internal server error" });
    }
}
export const getAdminUsers = async (req, res) => {
    try {
        // console.log("req.body:", req.body);
        const { startRow, endRow, filterModel, sortModel } = req.body;
        const limit = endRow - startRow;
        const offset = startRow;
        const whereConditions = [];

        // Filtering
        if (filterModel?.id?.filter) {
            whereConditions.push(
                eq(adminTable.id, filterModel.id.filter)
            );

        }

        if (filterModel?.firstName?.filter) {
            whereConditions.push(
                ilike(adminTable.firstName, `%${filterModel.firstName.filter}%`)
            )
            // countQuery = countQuery.where(
            //     ilike(adminTable.firstName, `%${filterModel.firstName.filter}%`)
            // );
        }

        if (filterModel?.lastName?.filter) {
            whereConditions.push(
                ilike(adminTable.lastName, `%${filterModel.lastName.filter}%`)
            );
        }

        if (filterModel?.email?.filter) {
            whereConditions.push(
                ilike(adminTable.email, `%${filterModel.email.filter}%`)
            );
        }

        let query = db.select()
            .from(adminTable)
            .where(whereConditions.length ? and(...whereConditions) : undefined)
            .limit(limit)
            .offset(offset);

        let countQuery = db
            .select({ count: sql`count(*)` })
            .from(adminTable)
            .where(whereConditions.length ? and(...whereConditions) : undefined);


        // Sorting
        if (sortModel && sortModel.length > 0) {
            const { colId, sort } = sortModel[0];
            const column = adminTable[colId];
            if (column) {
                if (column) {
                    query = query.orderBy(sort === "asc" ? asc(column) : desc(column));
                }
            }
        }
        const [rows, total] = await Promise.all([
            query,
            countQuery
        ]);

        // console.log("Total admins count:", total[0].count);


        res.status(200).json({
            data: rows,
            totalCount: total[0].count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

}