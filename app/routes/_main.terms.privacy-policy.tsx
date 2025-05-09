import Terms, { ITerms } from "~/components/UI/Terms";
import { getSeoMeta } from "~/utils/seo";
import { BASE_URL, PRODUCT_NAME } from "~/config/enviromenet";
import { HeadersFunction } from "@remix-run/node";

export const meta = () => {
  return [
    ...getSeoMeta({
      title: Data.title,
      description: Data.pageDescription,
      canonical: `${BASE_URL}/terms/privacy-policy`,
    }),
  ]
}

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=86400, s-maxage=86400",
});

export default function PrivacyPolicy() {
  return (
    <Terms terms={Data} type='POINTS' />
  )
}

const Data: ITerms = {
  "title": "Privacy Policy",
  "description": `Thank you for using ${PRODUCT_NAME}! This Privacy Policy describes how ${PRODUCT_NAME} ("we," "us," or "our") collects, uses, and shares your information when you use our website and any services provided therein (collectively, the "Service"). By accessing or using the Service, you agree to the terms of this Privacy Policy.`,
  "pageDescription": `Thank you for using ${PRODUCT_NAME}! This Privacy Policy describes how ${PRODUCT_NAME} ("we," "us," or "our") collects, uses, and shares your information when you use our website and any services provided therein (collectively, the "Service"). By accessing or using the Service, you agree to the terms of this Privacy Policy.`,
  "lastUpdated": "Last updated: Oct 5, 2024",
  "sections": [
    {
      "title": "Information We Collect",
      "terms": [
        "1.1. <b>Information You Provide:</b> When you register for an account or use certain features of the Service, you may provide us with personal information such as your name, email address, username, and password.",
        "1.2. <b>Automatically Collected Information:</b> We may automatically collect certain information about your use of the Service, including your IP address, browser type, operating system, and device information.",
        "1.3. <b>Cookies and Similar Technologies:</b> We may use cookies and similar technologies to collect information about your browsing activities and preferences. You can set your browser to refuse all or some browser cookies or to alert you when websites set or access cookies."
      ]
    },
    {
      "title": "How We Use Your Information",
      "terms": [
        "2.1. <b>Providing the Service:</b> We use your information to provide, maintain, and improve the Service, including to authenticate your identity, communicate with you, and personalize your experience.",
        "2.2. <b>Analytics and Research:</b> We may use your information for analytics purposes, such as to analyze trends, track user activity, and gather demographic information.",
        "2.3. <b>Advertising:</b> We may use your information to deliver targeted advertising to you both on and off the Service."
      ]
    },
    {
      "title": "How We Share Your Information",
      "terms": [
        "3.1. <b>With Third Parties:</b> We may share your information with third-party service providers who help us operate the Service or fulfill your requests.",
        "3.2. <b>Legal Compliance:</b> We may disclose your information if required to do so by law or in response to a subpoena, court order, or other legal process.",
        "3.3. <b>Business Transfers:</b> In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred to a third party as part of the transaction."
      ]
    },
    {
      "title": "Your Choices",
      "terms": [
        "4.1. <b>Account Information:</b> You may update or delete your account information anytime by logging into your account settings.",
        "4.2. <b>Cookies:</b> You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies."
      ]
    },
    {
      "title": "Children's Privacy",
      "terms": [
        "The Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under the age of 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us to have the information removed."
      ]
    },
    {
      "title": "Security",
      "terms": [
        "We take reasonable measures to protect your information from unauthorized access, disclosure, alteration, or destruction."
      ]
    },
    {
      "title": "Changes to this Privacy Policy",
      "terms": [
        "We reserve the right to modify this Privacy Policy at any time. If we make material changes to this Privacy Policy, we will notify you by email or by posting a notice on the Service prior to the effective date of the changes. Your continued use of the Service after the effective date of the changes constitutes your acceptance of the revised Privacy Policy."
      ]
    }
  ]
}