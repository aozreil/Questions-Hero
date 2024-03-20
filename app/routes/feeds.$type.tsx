import { getLatestAddedQuestions } from "~/apis/questionsAPI.server";
import { Feed } from "feed";
import { DEFAULT_META_DESCRIPTION, DEFAULT_META_TITLE } from "~/utils/seo";
import { BASE_URL } from "~/config/enviromenet";
import { QuestionClass } from "~/models/questionModel";
import { LoaderFunctionArgs } from "@remix-run/router";

const rssTypes = ["rss", "atom", "json"];

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const { type } = params;
    if (!type || !rssTypes.includes(type)) {
      return new Response("Not Found", { status: 404 });
    }

    const questions = await getLatestAddedQuestions({
      params: {
        limit: 10
      }
    });
    let lastUpdateDate = new Date();
    if (questions.length > 0 && questions[0].created_at) {
      lastUpdateDate = new Date(questions[0].created_at);
    }
    const feed = new Feed({
      title: DEFAULT_META_TITLE,
      description: DEFAULT_META_DESCRIPTION,
      id: BASE_URL,
      link: BASE_URL,
      favicon: `${BASE_URL}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, AskGram`,
      updated: lastUpdateDate,
      generator: "Feed for Node.js",
      feedLinks: {
        json: `${BASE_URL}/feeds/json`,
        atom: `${BASE_URL}/feeds/atom`,
      },
      author: {
        name: "AskGram",
        link: BASE_URL
      }
    });
    questions.forEach((q) => {
      const question = QuestionClass.questionExtraction(q);
      if (!question.created_at) {
        return;
      }
      const url = `${BASE_URL}/question/${question.slug}`;
      feed.addItem({
        title: question.title ?? "",
        id: url,
        link: url,
        date: new Date(question.created_at),
        published: new Date(question.created_at),
        description: question.text,
        content: question.text
      });
    });
    if (type === "rss") {
      return new Response(feed.rss2(), {
        status: 200,
        headers: {
          "Content-Type": "application/rss+xml"
        }
      });
    } else if (type === "atom") {
      return new Response(feed.atom1(), {
        status: 200,
        headers: {
          "Content-Type": "application/atom+xml"
        }
      });
    } else {
      return new Response(feed.json1(), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

  } catch (error: unknown) {
    return new Response("Not Found", { status: 404 });
  }
}
