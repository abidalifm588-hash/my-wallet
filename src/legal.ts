export interface LegalDoc {
  title: string;
  updated: string;
  sections: { heading: string; text: string }[];
}

export const legalDocs: Record<string, LegalDoc> = {
  "Privacy Policy": {
    title: "Privacy Policy",
    updated: "Last updated January 8, 2025",
    sections: [
      { heading: "Information we collect", text: "We collect the details you give us when you verify your account, such as your name, email address, mobile number and government-issued identification, along with basic device and usage information needed to keep your wallet secure." },
      { heading: "How we use it", text: "Your information is used to verify your identity, process transfers, prevent fraud and meet our legal obligations. We never sell your personal data to third parties." },
      { heading: "Data retention", text: "We keep records only as long as required by financial regulations or to provide the service. You may request deletion of non-regulated data at any time by contacting us." },
      { heading: "Your rights", text: "You can access, correct or export your personal information from your profile, or by writing to privacy@mywallet.app." },
    ],
  },
  "Terms of Service": {
    title: "Terms of Service",
    updated: "Last updated January 8, 2025",
    sections: [
      { heading: "Using MyWallet", text: "By using MyWallet you confirm that the information you provide is accurate and that you are the lawful owner of the account. You are responsible for keeping your passwords private." },
      { heading: "Transfers & withdrawals", text: "Incoming transfers may be limited until verification is complete. If repeated withdrawal attempts fail, funds are returned to the original sender, who you may contact to recover them." },
      { heading: "Prohibited activity", text: "Fraud, money laundering, impersonation and any attempt to bypass security controls are strictly prohibited and may result in suspension." },
      { heading: "Changes", text: "We may update these terms from time to time. Continued use of the app after changes means you accept the updated terms." },
    ],
  },
  About: {
    title: "About MyWallet",
    updated: "Our story",
    sections: [
      { heading: "Who we are", text: "MyWallet is a small, security-focused digital wallet built to make receiving and managing international transfers calm and simple." },
      { heading: "What we believe", text: "Money tools should be clear, honest and quiet. No clutter, no dark patterns, and no surprises in the fine print." },
      { heading: "Where we operate", text: "Our Security Department is based in Toronto, Canada, with support teams serving customers across Asia, Europe and North America." },
    ],
  },
  Press: {
    title: "Press",
    updated: "Media resources",
    sections: [
      { heading: "Press enquiries", text: "Journalists can reach our communications team at press@mywallet.app. We usually reply within one business day." },
      { heading: "Brand assets", text: "Logos, colour guidelines and product screenshots are available on request. Please do not alter or recolour the MyWallet mark." },
      { heading: "Recent mentions", text: "MyWallet has been featured in several fintech newsletters for its minimal approach to cross-border transfers." },
    ],
  },
  Copyright: {
    title: "Copyright",
    updated: "© 2025 MyWallet",
    sections: [
      { heading: "Ownership", text: "All text, graphics, logos and software in MyWallet are the property of MyWallet or its licensors and are protected by international copyright law." },
      { heading: "Reporting infringement", text: "If you believe content in the app infringes your copyright, send a notice with details of the work to copyright@mywallet.app and we will investigate promptly." },
    ],
  },
  "Contact Us": {
    title: "Contact Us",
    updated: "We're here to help",
    sections: [
      { heading: "Support", text: "Email support@mywallet.app. Our team responds within 24 hours, Monday to Saturday." },
      { heading: "Security Department", text: "Arshcroft Security Department, Toronto, Canada. For urgent account concerns, please include your registered mobile number in your message." },
      { heading: "Report a problem", text: "If you notice a transfer you don't recognise, contact us immediately so we can protect your funds." },
    ],
  },
  Creators: {
    title: "Creators",
    updated: "For freelancers & makers",
    sections: [
      { heading: "Get paid globally", text: "Creators and freelancers can receive client payments from around the world directly into their MyWallet account." },
      { heading: "Verified status", text: "Completing identity and e-TIN verification unlocks higher limits and faster access to your incoming funds." },
    ],
  },
  Advertise: {
    title: "Advertise",
    updated: "Partnerships",
    sections: [
      { heading: "Work with us", text: "We offer a limited number of respectful, non-intrusive sponsorships for financial education and productivity brands." },
      { heading: "Get in touch", text: "Send a short brief to partners@mywallet.app, including your audience and goals." },
    ],
  },
  Developers: {
    title: "Developers",
    updated: "API & integrations",
    sections: [
      { heading: "Build with MyWallet", text: "Our REST API lets approved partners read transfer status and verify account ownership. Access is granted case by case." },
      { heading: "Security", text: "All requests require signed tokens over TLS. Never share your API keys, and rotate them regularly." },
      { heading: "Request access", text: "Email developers@mywallet.app with a short description of your project." },
    ],
  },
  "Policy & Safety": {
    title: "Policy & Safety",
    updated: "Staying safe",
    sections: [
      { heading: "Protect your passwords", text: "MyWallet staff will never ask for your passwords by phone, email or chat. Do not share them with anyone." },
      { heading: "Account lock", text: "After three incorrect balance passwords your account is locked for 24 hours to protect your funds." },
      { heading: "Review before you withdraw", text: "Please double-check every detail of a withdrawal. Repeated failed attempts will cause funds to return to the sender." },
    ],
  },
};

export const legalLinks = Object.keys(legalDocs);
