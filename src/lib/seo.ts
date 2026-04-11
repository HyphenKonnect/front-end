import type { Metadata } from "next";

export const SITE_NAME = "The Hyphen Konnect";
export const SITE_URL = "https://thehyphenkonnect.com";
export const DEFAULT_OG_IMAGE = "/brand-logo.png";
export const SITE_LOCALE = "en_IN";

const brandKeywords = [
  "The Hyphen Konnect",
  "Hyphen Konnect",
  "THK",
];

const coreKeywords = [
  "mental wellness platform",
  "online therapy India",
  "online counselling India",
  "trauma therapy",
  "narcissistic abuse recovery",
  "abuse survivor support",
  "mental health support",
  "medical consultation online",
  "online doctor consultation India",
  "legal guidance India",
  "legal support for women",
  "wellness coaching India",
  "holistic wellness platform",
  "book online therapy session",
  "book online counselling session",
  "verified therapists India",
  "verified doctors India",
  "verified legal advisors India",
  "wellness experts online",
];

const locationKeywords = [
  "India mental wellness platform",
  "online healthcare India",
  "online support services India",
  "mental health services India",
  "telehealth India",
];

export const defaultKeywords = uniqueKeywords(
  brandKeywords,
  coreKeywords,
  locationKeywords,
);

export const serviceKeywordGroups = {
  "mental-wellness": [
    "mental wellness",
    "online therapist",
    "online psychologist India",
    "trauma counselling",
    "anxiety therapy",
    "relationship counselling",
    "depression support",
  ],
  "medical-consultation": [
    "medical consultation",
    "online doctor",
    "virtual health consultation",
    "general physician online",
    "second opinion doctor",
    "prescription support",
    "telemedicine India",
  ],
  "legal-guidance": [
    "legal guidance",
    "online legal consultation",
    "family lawyer consultation",
    "legal help for abuse survivors",
    "rights protection support",
    "legal advisor India",
    "document review lawyer",
  ],
  "wellness-programs": [
    "wellness programs",
    "holistic wellness coach",
    "stress management coaching",
    "sleep support program",
    "nutrition guidance online",
    "meditation support",
    "preventive wellness care",
  ],
} as const;

export function buildAbsoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function uniqueKeywords(...groups: readonly (readonly string[])[]) {
  return Array.from(
    new Set(
      groups
        .flat()
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    ),
  );
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = buildAbsoluteUrl(path);

  return {
    title,
    description,
    keywords: uniqueKeywords(defaultKeywords, keywords),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "website",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: `${SITE_NAME} logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export function buildNoIndexMetadata(
  title: string,
  description: string,
  path: string,
) {
  return buildPageMetadata({
    title,
    description,
    path,
    noIndex: true,
  });
}

export const publicStaticRoutes = [
  {
    path: "/",
    label: "Home",
    description:
      "Online mental wellness, medical consultation, legal guidance, and wellness support from trusted professionals.",
    priority: 1,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/about",
    label: "About",
    description:
      "Learn about The Hyphen Konnect mission, leadership, and values for holistic support.",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/services",
    label: "Services",
    description:
      "Explore mental wellness, medical consultation, legal guidance, and wellness programs.",
    priority: 0.95,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/professionals",
    label: "Professionals",
    description:
      "Browse therapists, doctors, legal advisors, and wellness coaches on The Hyphen Konnect.",
    priority: 0.95,
    changeFrequency: "daily" as const,
  },
  {
    path: "/resources",
    label: "Resources",
    description:
      "Read FAQs, mental wellness resources, legal guides, and support content.",
    priority: 0.75,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/contact",
    label: "Contact",
    description:
      "Contact The Hyphen Konnect for booking help, support, or service guidance.",
    priority: 0.75,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/join-professional",
    label: "Join as a Professional",
    description:
      "Apply to join The Hyphen Konnect professional network for therapy, medical, legal, or wellness services.",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/privacy",
    label: "Privacy Policy",
    description:
      "Review how The Hyphen Konnect handles privacy, confidentiality, and user information.",
    priority: 0.4,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/terms",
    label: "Terms of Service",
    description:
      "Read the platform terms, booking policies, and service expectations for The Hyphen Konnect.",
    priority: 0.4,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/sitemap.html",
    label: "HTML Sitemap",
    description:
      "Browse the human-readable sitemap for The Hyphen Konnect website.",
    priority: 0.3,
    changeFrequency: "monthly" as const,
  },
];
