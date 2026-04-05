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
  workingHours?: string;
  daysOff?: string;
  feeCards?: { label: string; price: string }[];
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
    rate: "Rs. 2500/session",
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
    workingHours:
      "Monday to Friday: 9:00 AM - 6:00 PM; Saturday: 9:00 AM - 12:00 PM",
    daysOff: "Sundays and public holidays (emergencies only)",
    feeCards: [
      { label: "1 hour therapy", price: "Rs. 2500" },
      { label: "4 sessions therapy package", price: "Rs. 9700" },
      { label: "1.5 hours therapy", price: "Rs. 3750" },
      { label: "2 hours therapy", price: "Rs. 5000" },
    ],
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
    rate: "Rs. 1700/session",
    available: true,
    location: "Hyderabad",
    intro:
      "Evidence-based support for trauma, emotional regulation, addiction recovery, and couple dynamics.",
    about: [
      "Hi, I’m Aashritha, a psychologist passionate about helping people navigate life’s toughest challenges with safety and steadiness.",
      "I work with individuals and couples on emotional regulation, childhood trauma, PTSD, de-addiction, and relationship concerns, while helping them build healthier coping strategies and stronger connections.",
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
    workingHours: "Monday to Thursday: 10:00 AM - 4:00 PM",
    daysOff: "Friday, Saturday, Sunday (negotiable depending on emergencies)",
    feeCards: [
      { label: "1 hour therapy", price: "Rs. 1700" },
      { label: "4 sessions therapy package", price: "Rs. 6600" },
      { label: "1.5 hours therapy", price: "Rs. 2550" },
      { label: "2 hours therapy", price: "Rs. 3400" },
    ],
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
    rate: "Rs. 2200/session",
    available: true,
    location: "Kolkata",
    intro:
      "Holistic therapy for trauma healing, intimacy concerns, identity work, and deeper self-acceptance.",
    about: [
      "Titir is a counselling psychologist with over seven years of experience supporting individuals through trauma healing, intimacy challenges, and identity exploration.",
      "Her work blends psychodynamic, relational, and somatic approaches to help clients reconnect with their inner strength and move toward empowerment, self-acceptance, and fulfilling relationships.",
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
    workingHours:
      "Weekdays: 6:00 PM - 10:00 PM; Weekends: 10:00 AM - 2:00 PM and 4:00 PM - 7:00 PM",
    daysOff: "Thursday",
    feeCards: [
      { label: "1 hour therapy", price: "Rs. 2200" },
      { label: "4 sessions therapy package", price: "Rs. 8500" },
      { label: "1.5 hours therapy", price: "Rs. 3300" },
      { label: "2 hours therapy", price: "Rs. 4400" },
    ],
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
    rate: "Rs. 4000/session",
    available: true,
    location: "Mumbai",
    intro:
      "Inclusive and strengths-based psychological care shaped by diverse experience across India, the UK, and Australia.",
    about: [
      "With training and experience across the United Kingdom, Australia, and India, Shreya has worked with a diverse range of clients in outpatient, inpatient, probation, and community settings.",
      "She offers a compassionate, empathetic, and culturally sensitive space while using a strengths-based bio-psycho-social model to keep clients at the center of recovery.",
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
    workingHours: "Wednesday to Sunday: 12:00 PM - 7:00 PM",
    daysOff: "Monday and Tuesday",
    feeCards: [
      { label: "1 hour therapy", price: "Rs. 4000" },
      { label: "4 sessions therapy package", price: "Rs. 15000" },
      { label: "1.5 hours therapy", price: "Rs. 6000" },
      { label: "2 hours therapy", price: "Rs. 8000" },
    ],
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
    rate: "Rs. 500/session",
    available: true,
    location: "Leeds",
    intro:
      "Clear, compassionate medical guidance from a clinician experienced in acute care and critical settings.",
    about: [
      "Madhurika is a UK-based healthcare professional passionate about health awareness and bridging gaps in healthcare knowledge.",
      "With her clinical expertise, she empowers patients by providing clear, accessible information and compassionate care that helps individuals navigate acute medical challenges with confidence.",
    ],
    qualifications: ["MBBS"],
    expertise: [
      "Acute medicine",
      "Outpatient consultations (OP)",
      "General medical practice",
      "Preventive health and primary care",
      "Patient communication and ethical practice",
    ],
    approach:
      "Straightforward, clinically grounded consultations that help people make informed health decisions.",
    languages: ["English", "Telugu", "Hindi"],
    workingHours: "9:00 AM - 5:00 PM",
    daysOff: "Saturday and Sunday",
  },
  {
    id: 6,
    slug: "sreshta-rao-madhavaram",
    name: "Sreshta Rao",
    specialty: "Co-Founder & Head Legal Counsel",
    category: "legal",
    image: "/professionals/sreshta-rao-madhavaram.png",
    rating: 0,
    reviews: 0,
    experience: "2+ years",
    rate: "Rs. 3000 / 2 sessions",
    available: true,
    location: "Hyderabad",
    intro:
      "Human-rights-focused legal guidance for people navigating abuse, harassment, and emotionally complex legal situations.",
    about: [
      "Sreshta is a committed Human Rights Advocate with proven experience in legal strategy, advocacy, and operational leadership.",
      "As Co-Founder and Head Legal Counsel at The Hyphen Konnect, she has led over 20 cases supporting individuals facing domestic abuse and harassment while focusing on empowering vulnerable communities and delivering impactful legal solutions.",
    ],
    qualifications: [
      "LLM in Human Rights, University of Edinburgh",
      "Enrolled as an advocate in the Telangana High Court",
      "BA LLB, Symbiosis Law School Hyderabad, Symbiosis International University, Pune",
    ],
    expertise: [
      "Human rights law",
      "Domestic abuse and harassment matters",
      "Legal advocacy and strategy",
    ],
    approach:
      "Care-aware legal advocacy focused on dignity, clarity, and practical next steps for people navigating difficult legal situations.",
    languages: ["English"],
    workingHours: "1:30 PM - 7:00 PM",
    daysOff: "Monday and Tuesday",
    feeCards: [{ label: "2 sessions legal package", price: "Rs. 3000" }],
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
    rate: "Rs. 1200/session",
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
    rate: "Rs. 3000 / 2 sessions",
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
    feeCards: [{ label: "2 sessions legal package", price: "Rs. 3000" }],
  },
  {
    id: 9,
    slug: "sowmiya-bhas",
    name: "Sowmiya Bhas",
    specialty: "Hypnotherapist and Past Life Regression Therapist",
    category: "therapist",
    image: "/professionals/sowmiya-bhas.jpg",
    rating: 0,
    reviews: 0,
    experience: "19 years",
    rate: "Rs. 4000/session",
    available: true,
    location: "Chennai",
    intro:
      "Transformational therapy that helps clients reconnect with their authentic power through hypnotherapy, regression work, and one-on-one guidance.",
    about: [
      "Seeking help outside of yourself is often one of the hardest things to do, and sometimes even to recognize. Sowmiya works from the belief that support is not failure, but a path toward rediscovering the answers already within you.",
      "Her specialty is helping clients navigate muddy emotional waters so they can step into their true, authentic power. Through multiple techniques and tools, she guides people toward becoming their most resilient selves while using the past as a teacher to build a brighter future.",
    ],
    qualifications: [
      "MS. Psychotherapy",
      "MSc. Psychology",
      "Clinical Hypnotherapist and Trainer",
      "Diploma in Past Life Regression Therapy, TASSO (Netherlands)",
      "Access Bars Practitioner and Facilitator",
      "Gaia Touch Practitioner",
      "Shamanic Practitioner",
      "Animal Communicator",
      "Graphologist",
      "MBA in Human Resources",
    ],
    expertise: [
      "Life coaching",
      "One-on-one therapy",
    ],
    approach:
      "Integrative healing that combines reflection, therapeutic tools, and experiential modalities to help clients move forward with clarity and self-trust.",
    languages: ["English", "Tamil", "Hindi"],
    workingHours: "2:00 PM - 7:00 PM",
    daysOff: "Weekends, with exceptions in case of emergencies",
    feeCards: [
      { label: "1 hour therapy", price: "Rs. 4000" },
      { label: "4 sessions therapy package", price: "Rs. 16500" },
      { label: "1.5 hours therapy", price: "Rs. 6300" },
      { label: "2 hours therapy", price: "Rs. 8400" },
    ],
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
    rate: "Rs. 500/session",
    available: true,
    location: "Hyderabad",
    intro:
      "Patient-first primary care support shaped by hands-on experience in government and private hospital settings.",
    about: [
      "Dr. M Mamatha Yadav is a dedicated and passionate general physician with hands-on experience in both government and private hospital settings across India.",
      "Her calm and focused approach, especially during high-pressure clinical environments, has helped patients navigate challenging health situations with trust, clarity, and ethical care.",
    ],
    qualifications: ["MBBS"],
    expertise: [
      "Outpatient consultations (OP)",
      "General medical practice",
      "Preventive health and primary care",
      "Patient communication and ethical practice",
      "Acute and chronic condition management",
    ],
    approach:
      "Accessible primary care with a focus on clarity, prevention, and continuity.",
    languages: ["English", "Telugu", "Hindi"],
    workingHours: "9:00 AM - 5:00 PM",
    daysOff: "Saturday and Sunday",
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
    rate: "Rs. 500/session",
    available: true,
    location: "Leeds",
    intro:
      "Practical emergency and acute-care guidance from a clinician working in high-pressure hospital settings.",
    about: [
      "Dr. Mounish Reddy is a clinically driven emergency medicine professional with four years of experience in acute care settings.",
      "Currently serving as a Junior Clinical Fellow in Emergency Medicine at Leeds Teaching Hospitals, NHS (UK), he brings hands-on expertise in managing acute medical conditions and guiding patients through critical care decisions.",
    ],
    qualifications: [
      "MBBS",
      "Clinical Fellowship in Emergency Medicine",
    ],
    expertise: [
      "Acute medical problems",
      "Emergency medicine and critical care",
      "Clinical decision-making and patient guidance",
      "Internal medicine",
    ],
    approach:
      "Clear, efficient consultations informed by emergency care and evidence-based clinical judgment.",
    languages: ["English", "Telugu", "Hindi"],
    workingHours: "9:00 AM - 5:00 PM",
    daysOff: "Saturday and Sunday",
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
    rate: "Rs. 2100/session",
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
    workingHours:
      "Thursday to Saturday: 9:00 AM - 9:00 PM; Tuesday and Wednesday: 3:00 PM - 9:00 PM; Sunday: 9:00 AM - 3:00 PM",
    daysOff: "Monday",
    feeCards: [
      { label: "1 hour therapy", price: "Rs. 2100" },
      { label: "4 sessions therapy package", price: "Rs. 8200" },
      { label: "1.5 hours therapy", price: "Rs. 3150" },
      { label: "2 hours therapy", price: "Rs. 4200" },
    ],
  },
  {
    id: 13,
    slug: "ashima-sood",
    name: "Ashima Sood-Patil",
    specialty: "Meditation Guide, Yoga Teacher",
    category: "wellness",
    image: "/professionals/ashima-sood.jpeg",
    rating: 0,
    reviews: 0,
    experience: "4 years",
    rate: "On request",
    available: true,
    location: "Dubai",
    intro:
      "Trauma-informed meditation, yoga, and somatic practices for emotional healing, self-trust, and grounded reconnection.",
    about: [
      "Ashima supports individuals in healing from trauma and reconnecting with their sense of self through meditation, yoga, and somatic practices.",
      "Many of her clients come after deep emotional wounds, including narcissistic abuse, and her trauma-informed sessions are designed to help them move from pain and overwhelm toward calm, clarity, courage, and a renewed sense of self-trust.",
    ],
    qualifications: ["500 RYT (Registered Yoga Teacher)"],
    expertise: [
      "Guided meditations",
      "Mindful movement",
      "Somatics",
      "Trauma-informed healing",
    ],
    approach:
      "Gentle, body-aware wellness sessions that combine safe movement, breath, and presence to help clients feel grounded, reclaim their voice, and step into a new chapter of healing.",
    languages: ["English", "Hindi"],
    workingHours:
      "Morning sessions: 6:00 AM - 8:00 AM; Evening sessions: 4:00 PM - 6:00 PM",
    daysOff: "Sunday (unless pre-booked) and Tuesday",
    feeCards: [
      { label: "1 hour session", price: "Rs. 1200" },
      { label: "4 sessions package", price: "Rs. 4500" },
      { label: "1.5 hours session", price: "Rs. 1800" },
      { label: "2 hours session", price: "Rs. 2400" },
    ],
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
    rate: "Rs. 3000 / 2 sessions",
    available: true,
    location: "Mumbai",
    intro:
      "Practical, empathetic legal guidance for personal disputes, family matters, property issues, employment concerns, and contracts.",
    about: [
      "Vidisha Bhate is an advocate with experience across litigation and corporate law, including her time at the Bombay High Court.",
      "Her work advising clients through personal disputes, alongside her practice in contractual and corporate law, gives her a strong combination of legal clarity and empathy aimed at helping people move toward swift and favorable settlements.",
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
    feeCards: [{ label: "2 sessions legal package", price: "Rs. 3000" }],
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
