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
export async function loader({ params, request }: LoaderFunctionArgs) {
    const slug = params.slug;
    try {
        const client = await pool.connect();
        try {
            const questionsResult = await client.query(
                `SELECT * FROM public.questions q, public.question_choices qc, public.question_topics qt WHERE q.id = qc.question_id AND q.topic_id = qt.id AND q.chapter_id = $1`, [slug]
            );

            const questions: any = {};
            const chapter = await client.query(
                `SELECT * FROM public.chapters c WHERE c.id = $1`, [slug]
            );
            for (const row of questionsResult.rows) {
                if(questions[row.question_id]) {
                    questions[row.question_id].choices.push({
                        choice_text: row.choice_text,
                        is_correct: row.is_correct,
                        id: row.id,
                    })
                }
                if(!questions[row.question_id]) {
                    questions[row.question_id] = {
                        id: row.question_id,
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
            return json({...chapter.rows[0], questions: Object.values(questions)} || {});
        } finally {
            client.release();
        }
    } catch (err) {
        console.error(err);
        throw new Response("Database Error", { status: 500 });
    }
}
