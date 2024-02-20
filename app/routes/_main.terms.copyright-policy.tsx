import Terms, { ITerms } from "~/components/UI/Terms";
import { getSeoMeta } from "~/utils/seo";
import { BASE_URL } from "~/config/enviromenet";

export const meta = () => {
  return [
    ...getSeoMeta({
      title: Data.title,
      description: Data.pageDescription,
      canonical: `${BASE_URL}/terms/copyright-policy`,
    }),
  ]
}

export default function CopyrightPolicy() {
  return (
    <Terms terms={Data} type='HIGHLIGHTED' />
  )
}

const Data: ITerms = {
  "title": "Copyright Policy",
  "description": "Askgram respects the intellectual property rights of others and expects its users to do the same. As such, we have implemented the following Copyright Policy and DMCA Notice to address claims of copyright infringement in accordance with the <a href='https://www.copyright.gov/512/' class='terms-link' target='blank'>Digital Millennium Copyright Act (DMCA).</a>",
  "pageDescription": "Askgram respects the intellectual property rights of others and expects its users to do the same. As such, we have implemented the following Copyright Policy and DMCA Notice to address claims of copyright infringement in accordance with the Digital Millennium Copyright Act (DMCA).",
  "lastUpdated": "Last updated: Feb 13, 2024",
  "highlightedSections": [
    {
      "title": "Reporting Copyright Infringement:",
      "terms": [
        {
          "type": "NORMAL",
          "text": "If you believe that your copyrighted work has been infringed upon on AskGram's platform, please submit a written notification of claimed infringement to our designated Copyright Agent. Your notification must include the following information:"
        },
        {
          "type": "HIGHLIGHTED",
          "text": "1. A physical or electronic signature of the copyright owner or someone authorized to act on their behalf.<br />\n2. Identification of the copyrighted work claimed to have been infringed.<br />\n3. Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material.<br />\n4. Your contact information, including your address, telephone number, and email address.<br />\n5. A statement that you have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.<br />\n6. A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.<br />"
        }
      ]
    },
    {
      "title": "Response to Infringement Claims:",
      "terms": [
        {
          "type": "NORMAL",
          "text": "Upon receiving a valid DMCA Notice, AskGram will take appropriate action, which may include removing or disabling access to the allegedly infringing content and notifying the user who posted the content. We may also terminate the accounts of repeat infringers."
        }
      ]
    },
    {
      "title": "Counter-Notification:",
      "terms": [
        {
          "type": "NORMAL",
          "text": "If you believe that your content was removed or disabled as a result of mistake or misidentification, you may submit a counter-notification to our Copyright Agent. Your counter-notification must include the following:"
        },
        {
          "type": "HIGHLIGHTED",
          "text": "1. Your physical or electronic signature.<br />\n2. Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access to it was disabled.<br />\n3. A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of a mistake or misidentification of the material to be removed or disabled.<br />\n4. Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which the address is located, or if your address is outside of the United States, for any judicial district in which AskGram may be found, and that you will accept service of process from the person who provided the original notification of alleged infringement.<br />\n"
        },
        {
          "type": "NORMAL",
          "text": "Please send your counter-notification to our designated Copyright Agent at the address provided above."
        }
      ]
    },
    {
      "title": "Repeat Infringers:",
      "terms": [
        {
          "type": "NORMAL",
          "text": "AskGram reserves the right to terminate the accounts of users who are repeat infringers of copyright."
        }
      ]
    }
  ]
}