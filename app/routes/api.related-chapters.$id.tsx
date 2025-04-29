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
export interface Question {
    id?: number; // question_id
    chapter_id?: number;
    question_text?: string;
    question_type?: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER'; // expand if needed
    correct_answer?: string;
    topic_id?: number;
    question_id: number;
    choice_text?: string;
    is_correct?: string;
}
export async function loader({ params }: LoaderFunctionArgs) {
    console.log("params received:", params);

    const id = params.id;
    const chapterId = Number(id);

    if (isNaN(chapterId)) {
        throw new Response("Invalid Chapter ID", { status: 400 });
    }

    try {
        const client = await pool.connect();

        try {
            const chapters = await client.query(
                `SELECT * FROM public.chapters c WHERE c.id != $1 ORDER BY random() LIMIT 10`,
                [chapterId]
            );
            return json(chapters.rows || []);
        } finally {
            client.release();
        }
    } catch (err) {
        throw new Response("Database Error", { status: 500 });
    }
}

