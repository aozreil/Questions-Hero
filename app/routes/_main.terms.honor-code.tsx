import Terms, { ITerms } from "~/components/UI/Terms";
import { getSeoMeta } from "~/utils/seo";
import { BASE_URL } from "~/config/enviromenet";

export const meta = () => {
  return [
    ...getSeoMeta({
      title: Data.title,
      description: Data.pageDescription,
      canonical: `${BASE_URL}/terms/honor-code`,
    }),
  ]
}

export default function HonorCode() {
  return (
    <Terms terms={Data} type='HIGHLIGHTED' />
  )
}

const Data: ITerms = {
  "title": "Honor Code",
  "description": "Askgram is committed to fostering a community where users can seek knowledge, share information, and engage in meaningful discussions in a respectful and ethical manner. Our platform is designed to facilitate learning and collaboration while upholding the highest standards of academic integrity. By utilizing Askgram, you agree to abide by the following Honor Code:",
  "pageDescription": "Askgram is committed to fostering a community where users can seek knowledge, share information, and engage in meaningful discussions in a respectful and ethical manner. Our platform is designed to facilitate learning and collaboration while upholding the highest standards of academic integrity. By utilizing Askgram, you agree to abide by the following Honor Code:",
  "lastUpdated": "Last updated: Feb 13, 2024",
  "highlightedSections": [
    {
      "title": "Academic Integrity",
      "terms": [
        {
          "type": "HIGHLIGHTED",
          "text": "<ul class='terms-list'>\n  <li>Do not engage in cheating or any form of academic dishonesty. Askgram is intended for educational purposes, and users should refrain from seeking or providing unauthorized assistance that compromises the integrity of learning outcomes.</li>\n  <li>Avoid sharing copyrighted material or confidential information that could violate intellectual property rights or academic regulations.</li>\n  <li>Respect the academic policies and guidelines set forth by your educational institution. Be mindful of any restrictions regarding the sharing or dissemination of course-related materials online.</li>\n</ul>"
        }
      ]
    },
    {
      "title": "Prohibited Activities",
      "terms": [
        {
          "type": "HIGHLIGHTED",
          "text": "<ul class='terms-list'>\n  <li>Do not use Askgram to access or distribute unauthorized solutions to assignments, exams, or any other academic assessments.</li>\n  <li>Refrain from soliciting or providing direct answers to questions that are part of ongoing assessments, quizzes, or examinations.</li>\n  <li>Avoid sharing questions or solutions from assessments you have recently completed, as this may facilitate academic dishonesty.</li>\n  <li>Do not misuse the platform to gain unfair advantage or circumvent academic responsibilities.</li>\n</ul>"
        }
      ]
    },
    {
      "title": "Reporting Violations",
      "terms": [
        {
          "type": "NORMAL",
          "text": "If you encounter any content on Askgram that violates this Honor Code or suspect any form of academic misconduct, please report it immediately to our support team at <a href='mailto:support@askgram.com' class='terms-link'>support@askgram.com</a>. We take misconduct allegations seriously and will promptly investigate and address reported violations."
        },
        {
          "type": "NORMAL",
          "text": "By using Askgram, you acknowledge and agree to uphold this Honor Code, along with our Community Guidelines and Terms of Use. Together, we can maintain a positive and ethical learning environment for all users."
        }
      ]
    }
  ]
}
