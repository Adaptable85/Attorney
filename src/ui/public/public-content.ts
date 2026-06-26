export type PublicServiceGroup = {
  title: string;
  summary: string;
  services: string[];
};

export type PublicProcessStep = {
  title: string;
  summary: string;
};

export const contactDetails = {
  email: "stephanie@burgessinc.co.za",
  phone: "078 749 6223",
  address: "10 Nuxia Street, Kuilsriver"
} as const;

export const serviceGroups: PublicServiceGroup[] = [
  {
    title: "We Assist In",
    summary:
      "Core legal support for individuals, families and businesses needing clear practical assistance.",
    services: ["Litigation", "Family Law", "Insolvency Law", "Commercial Law", "Property Law", "Trusts & Estates"]
  },
  {
    title: "Our Expertise",
    summary:
      "Focused dispute, recovery and advisory work handled with attention to each matter's facts and documents.",
    services: [
      "Evictions",
      "Constitutional Law",
      "Contractual Disputes",
      "Corporate Recovery",
      "Debt Collection",
      "Building Disputes"
    ]
  },
  {
    title: "Protecting Your Interest",
    summary:
      "Additional practice areas for clients who need protective, responsive legal guidance.",
    services: [
      "Labour Law",
      "Insurance Law",
      "Joint Ventures",
      "Liquor Law",
      "Personal Injury",
      "Road Accident Fund Claims"
    ]
  }
];

export const processSteps: PublicProcessStep[] = [
  {
    title: "Analysing Your Case",
    summary: "We begin by understanding your instructions, documents and the practical context of the matter."
  },
  {
    title: "Taking Steps Forward",
    summary: "The next steps are explained clearly so that decisions can be made with proper legal guidance."
  },
  {
    title: "Court Of Law Success",
    summary:
      "Where litigation is required, preparation is careful and outcome statements remain responsible and matter-specific."
  }
];

export const testimonial = {
  author: "Romeo Brand",
  quote: "Their diligence, tenacity and strive to provide their clients with the best result cannot be ignored."
} as const;

export const stephanieProfile = {
  name: "Stephanie Burgess",
  title: "Attorney and Insolvency Practitioner",
  summary:
    "Stephanie's journey took her from Pretoria to Cape Town, where Burgess Attorneys found its home in the Northern Suburbs. She obtained her LLB degree from the University of Pretoria, was admitted as an Attorney of the High Court in Cape Town and later added the title of Insolvency Practitioner.",
  highlights: [
    "Pretoria to Cape Town",
    "LLB Degree from the University of Pretoria",
    "Admitted Attorney of the High Court in Cape Town",
    "Insolvency Practitioner",
    "Boutique firm in the Northern Suburbs of Cape Town"
  ]
} as const;
