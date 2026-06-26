export type PublicServiceGroup = {
  title: string;
  summary: string;
  services: string[];
};

export const contactDetails = {
  email: "stephanie@burgessinc.co.za",
  phone: "078 749 6223",
  address: "10 Nuxia Street, Kuilsriver"
} as const;

export const serviceGroups: PublicServiceGroup[] = [
  {
    title: "Dispute Resolution",
    summary:
      "Practical support for civil disputes, contractual disagreements, debt recovery and litigation preparation.",
    services: [
      "Litigation",
      "Contractual Disputes",
      "Debt Collection",
      "Building Disputes",
      "Insurance Law"
    ]
  },
  {
    title: "Family, Property and Estates",
    summary:
      "Personal legal guidance for family, property, estate and trust-related matters.",
    services: ["Family Law", "Property Law", "Trusts & Estates", "Evictions"]
  },
  {
    title: "Commercial and Recovery",
    summary:
      "Commercial legal support for businesses, joint ventures, corporate recovery and insolvency-related work.",
    services: [
      "Commercial Law",
      "Insolvency Law",
      "Corporate Recovery",
      "Joint Ventures",
      "Liquor Law"
    ]
  },
  {
    title: "Specialist Claims and Public Law",
    summary:
      "Assistance with selected public law, labour, personal injury and Road Accident Fund matters.",
    services: [
      "Constitutional Law",
      "Labour Law",
      "Personal Injury",
      "Road Accident Fund Claims"
    ]
  }
];

export const testimonial = {
  author: "Romeo Brand",
  quote:
    "I had the honour of making use of Burgess Attorneys representation, and it is with high praise that I commend and recommend them for any legal issue."
} as const;

export const stephanieProfile = {
  name: "Stephanie Burgess",
  title: "Attorney and Insolvency Practitioner",
  summary:
    "Stephanie Burgess obtained her LLB degree from the University of Pretoria, was admitted as an attorney, and later completed further insolvency law and practice training. Burgess Attorneys is based in the Northern Suburbs of Cape Town and focuses on personal, practical legal service.",
  highlights: [
    "LLB degree from the University of Pretoria",
    "Admitted attorney",
    "Insolvency Practitioner",
    "Boutique firm in the Northern Suburbs of Cape Town"
  ]
} as const;
