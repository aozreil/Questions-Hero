import Terms, { ITerms } from "~/components/UI/Terms";
import { getSeoMeta } from "~/utils/seo";
import { BASE_URL, PRODUCT_NAME, SUPPORT_EMAIL } from "~/config/enviromenet";
import { HeadersFunction } from "@remix-run/node";

export const meta = () => {
  return [
    ...getSeoMeta({
      title: Data.title,
      description: Data.pageDescription,
      canonical: `${BASE_URL}/terms/honor-code`,
    }),
  ]
}

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=86400, s-maxage=86400",
});

export default function HonorCode() {
  return (
    <Terms terms={Data} type='HIGHLIGHTED' />
  )
}

const Data: ITerms = {
  "title": "Honor Code",
  "description": `${PRODUCT_NAME} is committed to fostering a community where users can seek knowledge, share information, and engage in meaningful discussions in a respectful and ethical manner. Our platform is designed to facilitate learning and collaboration while upholding the highest standards of academic integrity. By utilizing ${PRODUCT_NAME}, you agree to abide by the following Honor Code:`,
  "pageDescription": `${PRODUCT_NAME} is committed to fostering a community where users can seek knowledge, share information, and engage in meaningful discussions in a respectful and ethical manner. Our platform is designed to facilitate learning and collaboration while upholding the highest standards of academic integrity. By utilizing ${PRODUCT_NAME}, you agree to abide by the following Honor Code:`,
  "lastUpdated": "Last updated: Oct 5, 2024",
  "highlightedSections": [
    {
      "title": "Academic Integrity",
      "terms": [
        {
          "key": 1,
          "type": "HIGHLIGHTED",
          "pointedList": [
            `Do not engage in cheating or any form of academic dishonesty. ${PRODUCT_NAME} is intended for educational purposes, and users should refrain from seeking or providing unauthorized assistance that compromises the integrity of learning outcomes.`,
            'Avoid sharing copyrighted material or confidential information that could violate intellectual property rights or academic regulations.',
            'Respect the academic policies and guidelines set forth by your educational institution. Be mindful of any restrictions regarding the sharing or dissemination of course-related materials online.',
          ],
          "text": "",
        }
      ]
    },
    {
      "title": "Prohibited Activities",
      "terms": [
        {
          "key": 1,
          "type": "HIGHLIGHTED",
          "pointedList": [
            `Do not use ${PRODUCT_NAME} to access or distribute unauthorized solutions to assignments, exams, or any other academic assessments.`,
            'Refrain from soliciting or providing direct answers to questions that are part of ongoing assessments, quizzes, or examinations.',
            'Avoid sharing questions or solutions from assessments you have recently completed, as this may facilitate academic dishonesty.',
            'Do not misuse the platform to gain unfair advantage or circumvent academic responsibilities.',
          ],
          "text": '',
          }
      ]
    },
    {
      "title": "Reporting Violations",
      "terms": [
        {
          "key": 1,
          "type": "NORMAL",
          "text": <>
            If you encounter any content on {PRODUCT_NAME} that violates this Honor Code or suspect any form of academic misconduct, please report it immediately to our support team at
            <a href={`mailto:${SUPPORT_EMAIL}`} className='terms-link'> {SUPPORT_EMAIL}</a>.
            We take misconduct allegations seriously and will promptly investigate and address reported violations.
          </>
        },
        {
          "key": 2,
          "type": "NORMAL",
          "text": `By using ${PRODUCT_NAME}, you acknowledge and agree to uphold this Honor Code, along with our Community Guidelines and Terms of Use. Together, we can maintain a positive and ethical learning environment for all users.`
        }
      ]
    }
  ]
}
