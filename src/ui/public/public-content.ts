export type PublicServiceGroup = {
  title: string;
  summary: string;
  services: string[];
};

export type PublicProcessStep = {
  title: string;
  summary: string;
};

export type PublicServicePathway = {
  title: string;
  audience: string;
  summary: string;
  services: string[];
  ctaLabel: string;
};

export type PublicTrustSignal = {
  label: string;
  value: string;
};

export const contactDetails = {
  email: "stephanie@burgessinc.co.za",
  phone: "078 749 6223",
  phoneHref: "tel:+27787496223",
  whatsappHref: "https://wa.me/27787496223",
  address: "10 Nuxia Street, Kuilsriver",
  region: "Kuils River, Cape Town and the Northern Suburbs"
} as const;

export const homepageSections = {
  heroEyebrow: "Boutique legal support in Kuils River",
  heroTitle: "Practical legal guidance, handled with personal attention.",
  heroCta: "Speak to Stephanie",
  serviceCta: "Find the right service",
  intentTitle: "What do you need help with?",
  founderTitle: "Meet Stephanie Burgess",
  trustTitle: "A personal firm with serious legal foundations",
  contactTitle: "Start with a clear conversation"
} as const;

export const servicePathways: PublicServicePathway[] = [
  {
    title: "Family and personal matters",
    audience: "For families and individuals",
    summary:
      "Guidance for sensitive personal disputes where clear advice, careful documents and calm next steps matter.",
    services: ["Family Law", "Divorce", "Care and custody", "Maintenance", "Personal legal disputes"],
    ctaLabel: "Discuss a family matter"
  },
  {
    title: "Business and commercial support",
    audience: "For companies, owners and entrepreneurs",
    summary:
      "Commercial legal support for agreements, disputes, debt recovery and business pressure points.",
    services: ["Commercial Law", "Contracts", "Debt Collection", "Corporate Recovery", "Joint Ventures"],
    ctaLabel: "Ask about business support"
  },
  {
    title: "Litigation and dispute resolution",
    audience: "For contested matters",
    summary:
      "Preparation-focused assistance for disputes that need a firm legal position and responsible litigation strategy.",
    services: ["Litigation", "Evictions", "Building Disputes", "Contractual Disputes", "Insurance Law"],
    ctaLabel: "Review a dispute"
  },
  {
    title: "Property, estates and planning",
    audience: "For property and legacy concerns",
    summary:
      "Support for property-related issues, trusts, estates and documents that need careful attention before decisions are made.",
    services: ["Property Law", "Trusts & Estates", "Labour Law", "Liquor Law", "RAF Claims"],
    ctaLabel: "Clarify the next step"
  }
];

export const serviceGroups: PublicServiceGroup[] = [
  {
    title: "Private client and family",
    summary: "Personal legal issues handled with privacy, clarity and practical next steps.",
    services: ["Family Law", "Maintenance", "Divorce", "Care and custody", "Trusts & Estates"]
  },
  {
    title: "Commercial and recovery",
    summary: "Focused business support for contracts, collection, recovery and commercial disputes.",
    services: ["Commercial Law", "Contractual Disputes", "Debt Collection", "Corporate Recovery", "Joint Ventures"]
  },
  {
    title: "Litigation and property",
    summary: "Dispute and property-related work prepared around the facts, documents and available remedies.",
    services: ["Litigation", "Evictions", "Building Disputes", "Property Law", "Insurance Law"]
  },
  {
    title: "Protective legal guidance",
    summary: "Additional practice areas for clients who need responsive and protective advice.",
    services: ["Labour Law", "Constitutional Law", "Liquor Law", "Personal Injury", "Road Accident Fund Claims"]
  }
];

export const processSteps: PublicProcessStep[] = [
  {
    title: "Understand the matter",
    summary: "We begin by listening to your instructions and reviewing the facts, documents and urgency."
  },
  {
    title: "Map the next step",
    summary: "The legal position and practical options are explained clearly before action is taken."
  },
  {
    title: "Move with care",
    summary:
      "Where correspondence, negotiation or litigation is required, preparation remains careful and outcome statements stay responsible."
  }
];

export const trustSignals: PublicTrustSignal[] = [
  {
    label: "Firm foundation",
    value: "Burgess Attorneys Inc was founded on 1 September 2021 after the incorporation of Burgess Attorneys."
  },
  {
    label: "Local presence",
    value: "Based in Kuils River and serving Cape Town and the Northern Suburbs."
  },
  {
    label: "Direct attorney contact",
    value: "Initial contact is handled through Stephanie's direct firm email and phone details."
  },
  {
    label: "Careful boundaries",
    value: "No website statement is a guarantee of outcome or a substitute for advice on your own facts."
  }
];

export const testimonial = {
  author: "Romeo Brand",
  quote:
    "Their diligence, tenacity and strive to provide their clients with the best result cannot be ignored. Thank you, Steph, for always providing sound advice and your willingness to go above and beyond."
} as const;

export const founderStory = {
  eyebrow: "Attorney and Insolvency Practitioner",
  title: "Stephanie brings calm structure to serious legal matters.",
  summary:
    "Stephanie's journey took her from Pretoria to Cape Town, where Burgess Attorneys found its home in the Northern Suburbs. She obtained her LLB degree from the University of Pretoria, was admitted as an Attorney of the High Court in Cape Town and later added the title of Insolvency Practitioner.",
  philosophy:
    "Her approach is direct, prepared and personal: clear explanation, careful document review and legal guidance that respects the practical pressure a matter can place on a person, family or business.",
  credentials: [
    "LLB Degree from the University of Pretoria",
    "Admitted Attorney of the High Court in Cape Town",
    "Insolvency Practitioner",
    "Boutique firm in the Northern Suburbs of Cape Town"
  ]
} as const;

export const stephanieProfile = {
  name: "Stephanie Burgess",
  title: "Attorney and Insolvency Practitioner",
  summary: founderStory.summary,
  highlights: ["Pretoria to Cape Town", ...founderStory.credentials]
} as const;
