// app/routes/chapter.$slug.tsx
import { LoaderFunctionArgs } from "@remix-run/router";
import { json } from "@remix-run/node";
import { Pool } from "pg";

// Set up a connection pool
const pool = new Pool({
    host: '45.61.51.51',
    port: 5432,
    user: 'db-user',
    password: 'qrjqFmy8eyGfog==',
    database: 'content',
});

export async function loader({ params, request }: LoaderFunctionArgs) {

    try {
        const client = await pool.connect();
        try {
            const result = await client.query(`SELECT * FROM public.chapters`);
            return json(result.rows || {});
        } finally {
            client.release();
        }
    } catch (err) {
        console.error(err);
        throw new Response("Database Error", { status: 500 });
    }
}
