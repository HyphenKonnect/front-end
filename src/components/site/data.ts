import {
  Award,
  BookOpen,
  Brain,
  Clock,
  FileText,
  Headphones,
  Heart,
  Mail,
  MapPin,
  Phone,
  Scale,
  Shield,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";

export type ProfessionalProfile = {
  id: number;
  slug: string;
  name: string;
  specialty: string;
  category: "therapist" | "doctor" | "legal" | "wellness" | "all";
  image: string;
  rating: number;
  reviews: number;
  experience: string;
  rate: string;
  available: boolean;
  location: string;
  intro: string;
  about: string[];
  qualifications: string[];
  expertise: string[];
  approach: string;
  languages: string[];
};

export const serviceCatalog = [
  {
    slug: "mental-wellness",
    icon: Brain,
    title: "Mental Wellness",
    tagline: "Professional Therapy & Counseling",
    description:
      "Licensed therapists and counselors provide compassionate, evidence-based support for anxiety, stress, trauma, relationships, and growth.",
    image:
      "https://images.unsplash.com/photo-1714976695024-55a90b113f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    features: [
      "Individual Therapy Sessions",
      "Trauma-Informed Support",
      "Relationship Counseling",
      "Mindfulness-Based Therapy",
      "Long-term Wellness Planning",
    ],
    specialists: "45+ Licensed Therapists",
    availability: "7 Days a Week",
  },
  {
    slug: "medical-consultation",
    icon: Stethoscope,
    title: "Medical Consultation",
    tagline: "Expert Medical Guidance",
    description:
      "Connect with board-certified doctors for virtual consultations, prescription support, health assessments, and ongoing medical care.",
    image:
      "https://images.unsplash.com/photo-1615177393579-5fc7431152c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    features: [
      "General Practice Consultations",
      "Specialist Referrals",
      "Prescription Renewals",
      "Lab Results Review",
      "Second Opinions",
    ],
    specialists: "30+ Medical Doctors",
    availability: "24/7 Emergency Access",
  },
  {
    slug: "legal-guidance",
    icon: Scale,
    title: "Legal Guidance",
    tagline: "Professional Legal Support",
    description:
      "Access qualified attorneys for consultations, document review, rights protection, and clear guidance through complex legal matters.",
    image:
      "https://images.unsplash.com/photo-1743017524261-f026c51acf7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    features: [
      "Family Law Consultations",
      "Employment Law Advice",
      "Contract Reviews",
      "Estate Planning",
      "Document Preparation",
    ],
    specialists: "25+ Licensed Attorneys",
    availability: "Business Hours + On-Call",
  },
  {
    slug: "wellness-programs",
    icon: Heart,
    title: "Wellness Programs",
    tagline: "Holistic Health & Lifestyle",
    description:
      "Comprehensive wellness programs including nutrition guidance, stress management, sleep support, and sustainable healthy routines.",
    image:
      "https://images.unsplash.com/photo-1773212902295-14c35ee22235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    features: [
      "Nutrition Plans",
      "Fitness Coaching",
      "Meditation Support",
      "Sleep Optimization",
      "Preventive Health Coaching",
    ],
    specialists: "20+ Wellness Coaches",
    availability: "Flexible Scheduling",
  },
];

export const professionals: ProfessionalProfile[] = [
  {
    id: 1,
    slug: "sritha-nandiraj",
    name: "Sritha Nandiraj",
    specialty: "Clinical Psychologist",
    category: "therapist",
    image: "/professionals/sritha-nandiraj.jpg",
    rating: 0,
    reviews: 0,
    experience: "4+ years",
    rate: "On request",
    available: true,
    location: "Bengaluru",
    intro:
      "Warm, reflective therapy for anxiety, trauma, relationship pain, and rebuilding self-worth.",
    about: [
      "Sritha Nandiraj is a compassionate psychotherapist who creates a steady, non-judgmental space for clients to explore difficult emotions and lived experiences.",
      "Her work is centered on helping people move through anxiety, depression, trauma, suicidal thoughts, and painful relationships with more clarity, resilience, and emotional safety.",
    ],
    qualifications: ["MSc. in Psychological Counselling"],
    expertise: [
      "Anxiety and emotional overload",
      "Depression and low mood",
      "Relationship challenges",
      "Trauma, abuse, and childhood wounds",
      "Self-worth and identity concerns",
    ],
    approach:
      "Empathic, trauma-aware therapy focused on emotional processing, resilience, and grounded healing.",
    languages: ["English", "Kannada", "Hindi"],
  },
  {
    id: 2,
    slug: "aashritha-akula",
    name: "Aashritha Akula",
    specialty: "Psychologist & Community Educator",
    category: "therapist",
    image: "/professionals/aashritha-akula.jpeg",
    rating: 0,
    reviews: 0,
    experience: "3+ years",
    rate: "On request",
    available: true,
    location: "Hyderabad",
    intro:
      "Evidence-based support for trauma, emotional regulation, addiction recovery, and couple dynamics.",
    about: [
      "Aashritha is a psychologist and community educator who works with individuals and couples through trauma, relationship distress, and emotional regulation challenges.",
      "She combines structure with empathy and helps clients reconnect with their inner strength through practical tools and a safe therapeutic relationship.",
    ],
    qualifications: [
      "MA in Clinical Psychology",
      "Certified in CBT, DBT, and Addiction Rehabilitation",
      "Trained in Marriage and Family Therapy",
    ],
    expertise: [
      "Addiction and substance abuse rehabilitation",
      "Family and couples therapy",
      "Trauma recovery and post-traumatic growth",
      "Adolescent and young adult mental health",
      "Community psychoeducation",
    ],
    approach:
      "Structured, skills-based therapy using CBT and DBT alongside emotionally supportive care.",
    languages: ["English", "Telugu", "Hindi"],
  },
  {
    id: 3,
    slug: "titir-dewan",
    name: "Titir Dewan",
    specialty: "Counselling Therapist",
    category: "therapist",
    image: "/professionals/titir-dewan.jpeg",
    rating: 0,
    reviews: 0,
    experience: "7+ years",
    rate: "On request",
    available: true,
    location: "Kolkata",
    intro:
      "Holistic therapy for trauma healing, intimacy concerns, identity work, and deeper self-acceptance.",
    about: [
      "Titir is a counselling psychologist whose work brings together relational, psychodynamic, and somatic perspectives.",
      "She supports clients working through trauma, intimacy struggles, identity questions, and self-doubt with a compassionate and holistic lens.",
    ],
    qualifications: ["MSc. in Counselling Psychology"],
    expertise: [
      "Trauma therapy",
      "Sex therapy and intimacy concerns",
      "Relationship and couple counselling",
      "Self-esteem and identity work",
      "Mindfulness, art, and somatic practices",
    ],
    approach:
      "Relational and psychodynamic therapy informed by somatic practices, mindfulness, and emotional depth.",
    languages: ["English", "Bengali", "Hindi"],
  },
  {
    id: 4,
    slug: "shreya-aila",
    name: "Shreya Aila",
    specialty: "Clinical Psychologist",
    category: "therapist",
    image: "/professionals/shreya-aila.jpeg",
    rating: 0,
    reviews: 0,
    experience: "7+ years",
    rate: "On request",
    available: true,
    location: "Mumbai",
    intro:
      "Inclusive and strengths-based psychological care shaped by diverse experience across India, the UK, and Australia.",
    about: [
      "Shreya brings experience from outpatient, inpatient, probation, and community care settings across multiple countries.",
      "She offers culturally sensitive support for complex mental health needs while helping clients feel empowered and understood.",
    ],
    qualifications: [
      "MSc. Psychology",
      "Bachelor of Social Science (Psychology Major, Forensic Science Minor)",
    ],
    expertise: [
      "Anxiety, depression, OCD, and personality disorders",
      "PTSD, abuse, and grief",
      "Adjustment difficulties and conflict resolution",
      "Crisis management and intervention",
      "DBT and CBT-informed support",
    ],
    approach:
      "Strengths-based, queer-affirmative, and bio-psycho-social care tailored to each client’s context and goals.",
    languages: ["English", "Hindi"],
  },
  {
    id: 5,
    slug: "madhurika-jalakam",
    name: "Madhurika Jalakam",
    specialty: "Junior Clinical Fellow in ITU and Anesthetics",
    category: "doctor",
    image: "/professionals/madhurika-jalakam.jpeg",
    rating: 0,
    reviews: 0,
    experience: "3 years",
    rate: "On request",
    available: true,
    location: "Leeds",
    intro:
      "Clear, compassionate medical guidance from a clinician experienced in acute care and critical settings.",
    about: [
      "Madhurika is a UK-based healthcare professional focused on helping patients understand acute medical challenges and care options.",
      "Her communication style is accessible, reassuring, and rooted in clinical precision.",
    ],
    qualifications: ["MBBS"],
    expertise: ["Acute medicine", "Critical care context", "Patient education"],
    approach:
      "Straightforward, clinically grounded consultations that help people make informed health decisions.",
    languages: ["English", "Telugu", "Hindi"],
  },
  {
    id: 6,
    slug: "sreshta-rao-madhavaram",
    name: "Sreshta Rao Madhavaram",
    specialty: "Legal Counsel - Human Rights",
    category: "legal",
    image: "/professionals/sreshta-rao-madhavaram.png",
    rating: 0,
    reviews: 0,
    experience: "2+ years",
    rate: "On request",
    available: true,
    location: "India",
    intro:
      "Legal guidance with a human-rights lens for people navigating emotionally and socially complex situations.",
    about: [
      "Sreshta Rao Madhavaram is part of the legal support network at The Hyphen Konnect, with a focus on human-rights-informed guidance.",
      "Her profile is being expanded further, but she should be surfaced as a legal advisor rather than a medical professional.",
    ],
    qualifications: ["Legal profile details being refreshed"],
    expertise: [
      "Human-rights-oriented legal guidance",
      "Support for emotionally complex legal situations",
    ],
    approach:
      "Care-aware legal guidance focused on clarity, dignity, and practical next steps.",
    languages: ["English"],
  },
  {
    id: 7,
    slug: "anuraag-badeti",
    name: "Anuraag Badeti",
    specialty: "Advocate",
    category: "legal",
    image: "/professionals/anuraag-badeti.jpeg",
    rating: 0,
    reviews: 0,
    experience: "6 years",
    rate: "On request",
    available: true,
    location: "Hyderabad",
    intro:
      "Litigation-focused legal support for criminal, civil, and human-rights-related matters.",
    about: [
      "Anuraag is a full-time defence lawyer with strong courtroom experience across criminal and civil litigation.",
      "He is known for strategic defence work, procedural clarity, and grounded guidance during high-stakes legal situations.",
    ],
    qualifications: ["BBA LLB (Hons.), Symbiosis Law School, Pune"],
    expertise: [
      "Criminal law",
      "White-collar crime",
      "Civil litigation",
      "Human rights law",
    ],
    approach:
      "Direct, strategic legal counsel with a focus on clarity, defence preparation, and client confidence.",
    languages: ["English", "Telugu", "Hindi"],
  },
  {
    id: 8,
    slug: "vishnu-rao",
    name: "B. Vishnu Rao",
    specialty: "Independent Advocate",
    category: "legal",
    image: "/professionals/vishnu-rao.png",
    rating: 0,
    reviews: 0,
    experience: "6+ years",
    rate: "On request",
    available: true,
    location: "Hyderabad",
    intro:
      "Client-first legal counsel for civil, commercial, property, family, and recovery matters.",
    about: [
      "Vishnu Rao is a practicing advocate enrolled with the Bar Council of Telangana and has worked across civil and commercial disputes.",
      "He is known for transparent advice, ethical practice, and practical legal strategy in complex cases.",
    ],
    qualifications: ["BBA LLB (Hons.), Symbiosis Law School, Pune"],
    expertise: [
      "Commercial disputes",
      "Property and revenue litigation",
      "Banking law and SARFAESI matters",
      "Intellectual property disputes",
      "Family and matrimonial matters",
    ],
    approach:
      "Ethical, solution-oriented representation that keeps communication clear and actionable.",
    languages: ["English", "Telugu", "Hindi"],
  },
  {
    id: 9,
    slug: "sowmiya-bhas",
    name: "Sowmiya Bhas",
    specialty: "Therapist - Trauma & Sleep Health",
    category: "therapist",
    image: "/professionals/sowmiya-bhas.jpg",
    rating: 0,
    reviews: 0,
    experience: "19 years",
    rate: "On request",
    available: true,
    location: "Chennai",
    intro:
      "Deep transformational therapy blending psychotherapy, hypnotherapy, regression work, and emotional healing.",
    about: [
      "Sowmiya helps clients navigate emotional blocks, difficult life phases, and inner misalignment through an integrative therapeutic style.",
      "Her work is centered on helping people access clarity, resilience, and a stronger connection to their authentic self.",
    ],
    qualifications: [
      "MS. Psychotherapy",
      "MSc. Psychology",
      "Clinical Hypnotherapist and Trainer",
      "Diploma in Past Life Regression Therapy",
    ],
    expertise: [
      "One-on-one therapy",
      "Past life regression",
      "Emotional healing",
      "Subconscious reprogramming",
      "Spiritual integration and energy work",
    ],
    approach:
      "Integrative therapy that combines deep emotional work with experiential healing modalities.",
    languages: ["English", "Tamil", "Hindi"],
  },
  {
    id: 10,
    slug: "mamatha-yadav",
    name: "Dr. M Mamatha Yadav",
    specialty: "General Physician",
    category: "doctor",
    image: "/professionals/mamatha-yadav.jpeg",
    rating: 0,
    reviews: 0,
    experience: "3+ years",
    rate: "On request",
    available: true,
    location: "Hyderabad",
    intro:
      "Patient-first primary care support shaped by hands-on experience in government and private hospital settings.",
    about: [
      "Dr. Mamatha Yadav is a general physician with experience managing both acute and ongoing health concerns.",
      "She is valued for calm decision-making, ethical clinical care, and strong communication with patients.",
    ],
    qualifications: ["MBBS"],
    expertise: [
      "General medical practice",
      "Preventive health and primary care",
      "Acute and chronic condition management",
      "Outpatient consultations",
    ],
    approach:
      "Accessible primary care with a focus on clarity, prevention, and continuity.",
    languages: ["English", "Telugu", "Hindi"],
  },
  {
    id: 11,
    slug: "mounish-reddy",
    name: "Dr. Mounish Reddy",
    specialty: "Emergency Medicine",
    category: "doctor",
    image: "/professionals/mounish-reddy.jpeg",
    rating: 0,
    reviews: 0,
    experience: "4 years",
    rate: "On request",
    available: true,
    location: "Leeds",
    intro:
      "Practical emergency and acute-care guidance from a clinician working in high-pressure hospital settings.",
    about: [
      "Dr. Mounish Reddy works in emergency medicine and brings experience from both Indian and UK healthcare systems.",
      "He helps people navigate urgent medical concerns, internal medicine issues, and decisions around acute care.",
    ],
    qualifications: [
      "MBBS",
      "Clinical Fellowship in Emergency Medicine",
    ],
    expertise: [
      "Emergency medicine",
      "Acute medical problems",
      "Critical care context",
      "Internal medicine",
    ],
    approach:
      "Clear, efficient consultations informed by emergency care and evidence-based clinical judgment.",
    languages: ["English", "Telugu", "Hindi"],
  },
  {
    id: 12,
    slug: "dr-rucha-chhajed",
    name: "Dr. Rucha Chhajed",
    specialty: "Psychiatrist",
    category: "therapist",
    image: "/professionals/rucha-chhajed.jpg",
    rating: 0,
    reviews: 0,
    experience: "4 years",
    rate: "On request",
    available: true,
    location: "Pune",
    intro:
      "Psychiatric care for mood, personality, neuropsychiatric, and de-addiction concerns.",
    about: [
      "Dr. Rucha Chhajed is a psychiatrist who works with a wide range of mental health conditions using a patient-centered and holistic lens.",
      "She supports clients with sustained care plans focused on long-term recovery and balance.",
    ],
    qualifications: ["MBBS", "MD Psychiatry"],
    expertise: [
      "Mood disorders",
      "Personality disorders",
      "Neuropsychiatry",
      "Substance use and de-addiction",
    ],
    approach:
      "Holistic psychiatric care combining diagnostic clarity with empathic treatment planning.",
    languages: ["English", "Hindi", "Marathi"],
  },
  {
    id: 13,
    slug: "ashima-sood",
    name: "Ashima Sood",
    specialty: "Meditation Guide & Yoga Teacher",
    category: "wellness",
    image: "/professionals/ashima-sood.jpeg",
    rating: 0,
    reviews: 0,
    experience: "4 years",
    rate: "On request",
    available: true,
    location: "Dubai",
    intro:
      "Trauma-informed movement, meditation, and somatic practices for emotional healing and self-reconnection.",
    about: [
      "Ashima is a meditation guide and yoga teacher who supports clients through trauma recovery, emotional healing, and nervous-system regulation.",
      "Her sessions are designed to help people feel safer in their bodies and more connected to their own inner steadiness.",
    ],
    qualifications: ["500 RYT (Registered Yoga Teacher)"],
    expertise: [
      "Guided meditations",
      "Mindful movement",
      "Somatic practices",
      "Trauma-informed healing",
    ],
    approach:
      "Gentle, body-aware wellness sessions that blend breath, movement, and grounded self-repair.",
    languages: ["English", "Hindi"],
  },
  {
    id: 14,
    slug: "muthyala-preetham-shankar",
    name: "Muthyala Preetham Shankar",
    specialty: "Law Student (BA LLB Hons.)",
    category: "legal",
    image: "/professionals/preetham-shankar.png",
    rating: 0,
    reviews: 0,
    experience: "1+ year internship",
    rate: "On request",
    available: true,
    location: "Bengaluru",
    intro:
      "Emerging legal support with academic focus and internship exposure across litigation and corporate law.",
    about: [
      "Preetham is a law student with internship experience across litigation and corporate practice.",
      "He brings a client-first mindset and a strong interest in making legal processes easier to understand and act on.",
    ],
    qualifications: [
      "BA LLB (Hons.), CHRIST (Deemed to be University), in progress",
    ],
    expertise: [
      "Criminal law",
      "Family law",
      "Banking and recovery",
      "Company law",
      "Negotiable Instruments Act matters",
    ],
    approach:
      "Research-backed, detail-oriented legal assistance focused on practical clarity.",
    languages: ["English", "Telugu", "Hindi"],
  },
  {
    id: 15,
    slug: "vidisha-bhate",
    name: "Vidisha Bhate",
    specialty: "Advocate",
    category: "legal",
    image: "/professionals/vidisha-bhate.jpg",
    rating: 0,
    reviews: 0,
    experience: "3+ years",
    rate: "On request",
    available: true,
    location: "Mumbai",
    intro:
      "Practical, empathetic legal guidance for family, property, employment, and contractual matters.",
    about: [
      "Vidisha Bhate is an advocate with experience across litigation and corporate law, including work at the Bombay High Court.",
      "She combines technical legal understanding with client-sensitive communication to help people move through disputes with confidence.",
    ],
    qualifications: ["B.Tech.", "LL.B.", "LL.M."],
    expertise: [
      "Family law",
      "Property law",
      "Employment law",
      "Contractual and corporate matters",
    ],
    approach:
      "Balanced legal strategy that aims for clarity, speed, and fair outcomes without losing empathy.",
    languages: ["English", "Hindi", "Marathi"],
  },
];

export function getProfessionalBySlug(slug: string) {
  return professionals.find((professional) => professional.slug === slug);
}

export const professionalCategories = [
  { id: "all", label: "All Professionals", icon: Users },
  { id: "therapist", label: "Therapists", icon: Brain },
  { id: "doctor", label: "Medical Doctors", icon: Stethoscope },
  { id: "legal", label: "Legal Advisors", icon: Scale },
  { id: "wellness", label: "Wellness Coaches", icon: Heart },
];

export const resourceItems = [
  {
    icon: BookOpen,
    title: "Mental Health Guide",
    description: "A practical guide to understanding and managing mental health.",
    category: "Mental Wellness",
    meta: "15 min read",
  },
  {
    icon: FileText,
    title: "Legal Rights Handbook",
    description: "Know your rights and prepare for common legal situations.",
    category: "Legal Guidance",
    meta: "20 min read",
  },
  {
    icon: Video,
    title: "Wellness Video Series",
    description: "Expert-led videos on nutrition, movement, and stress care.",
    category: "Wellness Programs",
    meta: "10 videos",
  },
  {
    icon: Headphones,
    title: "Meditation & Mindfulness",
    description: "Guided sessions for calm, focus, and better sleep.",
    category: "Mental Wellness",
    meta: "30+ sessions",
  },
];

export const faqItems = [
  {
    question: "How do I book my first session?",
    answer:
      "Choose a service, select a professional, pick a time slot, and confirm your booking. You will get a confirmation right away.",
  },
  {
    question: "Are all professionals licensed and verified?",
    answer:
      "Yes. Every professional is verified for credentials, licensing, and background requirements before joining the platform.",
  },
  {
    question: "Is my information confidential?",
    answer:
      "Privacy is central to the platform. Sessions and communication are handled with secure, confidential workflows.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "Coverage can vary by service. The booking flow helps users understand available options and next steps.",
  },
];

export const contactCards = [
  {
    icon: Mail,
    title: "Email Us",
    details: ["support@thehyphenkonnect.com", "appointments@thehyphenkonnect.com"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["24/7 Support: 1-800-HYPHEN-K", "Business: 1-800-555-0123"],
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Wellness Boulevard", "San Francisco, CA 94102"],
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: ["Mon-Fri: 8:00 AM - 8:00 PM", "Sat-Sun: 10:00 AM - 6:00 PM"],
  },
];

export const aboutValues = [
  {
    icon: Heart,
    title: "Compassionate Care",
    description: "We meet people with empathy, respect, and practical support.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We aim for high-quality care experiences across every service.",
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "We make support easier to reach, wherever people are.",
  },
  {
    icon: Shield,
    title: "Trust & Privacy",
    description: "Confidentiality and safety guide the platform experience.",
  },
];
