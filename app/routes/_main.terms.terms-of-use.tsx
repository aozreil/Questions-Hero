import Terms, { ITerms } from "~/components/UI/Terms";
import { getSeoMeta } from "~/utils/seo";
import { BASE_URL, PRODUCT_NAME } from "~/config/enviromenet";
import { HeadersFunction } from "@remix-run/node";

export const meta = () => {
  return [
    ...getSeoMeta({
      title: Data.title,
      description: Data.pageDescription,
      canonical: `${BASE_URL}/terms/terms-of-use`,
    }),
  ]
}

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=86400, s-maxage=86400",
});

export default function TermsOfUse() {
  return (
    <Terms terms={Data} type='POINTS' />
  )
}

const Data: ITerms = {
  "title": "Terms of Use",
  "description": `Welcome to <b>${PRODUCT_NAME}!</b><br /> These terms of use govern your use of the ${PRODUCT_NAME} website and any services provided therein (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these terms of use. If you do not agree with any part of these terms, then you may not access the Service.\n`,
  "pageDescription": `Welcome to ${PRODUCT_NAME}!, These terms of use govern your use of the ${PRODUCT_NAME} website and any services provided therein (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these terms of use. If you do not agree with any part of these terms, then you may not access the Service.`,
  "lastUpdated": "Last updated: Oct 5, 2024",
  "sections": [
    {
      "title": "Use of Service",
      "terms": [
        "1.1. <b>Eligibility:</b> You must be at least 13 years old to use the Service. If you are under the age of 18, you represent that you have obtained parental or legal guardian consent to use the Service.\n",
        "1.2. <b>Registration:</b> Some features of the Service may require you to register for an account. When registering, you agree to provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        "1.3. <b>Prohibited Activities:</b> You agree not to engage in any of the following prohibited activities:" +
        "<br />- Violating any applicable laws or regulations." +
        "<br />- Interfering with or disrupting the Service or servers or networks connected to the Service.</li>" +
        "<br />- Impersonating another person or entity or falsely stating or otherwise misrepresenting your affiliation with a person or entity.</li>" +
        "<br />- Collecting or storing personal data about other users without their consent.</li>" +
        "<br />- Posting or transmitting any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</li>" +
        "<br />- Using the Service for any commercial purposes without our prior written consent.</li>",
      ]
    },
    {
      "title": "Content",
      "terms": [
        `2.1. <b>User Content:</b> You retain ownership of any content you submit or post to the Service ("User Content"). By submitting User Content, you grant us a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such User Content in any media. <br /><br /> Regarding ${PRODUCT_NAME}’s right to moderate ${PRODUCT_NAME} Services, any removal, screen or edit to your content or your account from ${PRODUCT_NAME} Services may be done by ${PRODUCT_NAME}, at our sole discretion and based on the Community Guidelines, in case you violate these terms, the Community Guidelines or any applicable law, at any time, with no prior notice to you.`,
        "2.2. <b>Moderation:</b> We reserve the right to moderate or remove any User Content that violates these terms of use or is otherwise objectionable in our sole discretion."
      ]
    },
    {
      "title": "Intellectual Property",
      "terms": [
        `3.1. <b>Copyright:</b> All content on the Service, including text, graphics, logos, button icons, images, audio clips, digital downloads, and data compilations, is the property of ${PRODUCT_NAME} or its content suppliers and is protected by copyright laws.`,
        `3.2. <b>Trademarks:</b> The trademarks, service marks, and logos used and displayed on the Service are registered and unregistered trademarks of ${PRODUCT_NAME} and others. Nothing in these terms of use grants you any license or right to use any trademarks displayed on the Service without the express written permission of the trademark owner.`
      ]
    },
    {
      "title": "Limitation of Liability",
      "terms": [
        `4.1. <b>Disclaimer:</b> The Service is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. ${PRODUCT_NAME} makes no representations or warranties about the accuracy or completeness of any content on the Service or the availability of the Service.`,
        `4.2. <b>Limitation of Liability:</b> To the fullest extent permitted by applicable law, ${PRODUCT_NAME} shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Service, including but not limited to any errors or omissions in any content, or any loss or damage of any kind incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available via the Service, even if advised of their possibility.`
      ]
    },
    {
      "title": "Indemnification",
      "terms": [
        `You agree to indemnify and hold harmless ${PRODUCT_NAME} and its affiliates, officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or in connection with your use of the Service or your violation of these terms of use.`
      ]
    },
    {
      "title": "Changes to Terms of Use",
      "terms": [
        "We reserve the right to modify these terms of use at any time without prior notice. By continuing to access or use the Service after such modifications, you agree to be bound by the modified terms of use."
      ]
    },
    {
      "title": "Governing Law",
      "terms": [
        "These terms of use shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles."
      ]
    }
  ]
}