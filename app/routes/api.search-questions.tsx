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
export async function loader({ params, request  }: LoaderFunctionArgs) {

    const url = new URL(request.url);
    const term = url.searchParams.get("term") ?? ''; // Get 'term' from query string

    try {
        const client = await pool.connect();

        try {
            const questionsResults = await client.query(
                `SELECT * FROM public.questions q WHERE LOWER(q.question_text) LIKE '%' || LOWER($1) || '%' ORDER BY random() LIMIT 20`,
                [term]
            );
            const questions: any = {};

            console.log("questions => ", questionsResults.rows)

            for (const row of questionsResults.rows) {
                if(!questions[row.id]) {
                    questions[row.id] = {
                        id: row.id,
                        text: row.question_text,
                        chapter_id: row.chapter_id,
                        topic_id: row.topic_id,
                        correct_answer: row.correct_answer,
                        question_type: row.question_type,
                        topic_name: row.name,
                        choices: [
                            {
                                choice_text: row.choice_text,
                                is_correct: row.is_correct,
                                id: row.id,
                            }
                        ]
                    };
                }

            }

            return json(Object.values(questions)|| []);
        } finally {
            client.release();
        }
    } catch (err) {
        throw new Response("Database Error", { status: 500 });
    }
}

