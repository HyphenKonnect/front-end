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

export const professionals = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    specialty: "Clinical Psychologist",
    category: "therapist",
    image: "https://images.unsplash.com/photo-1769555949533-703d68e62a02?w=300",
    rating: 4.9,
    reviews: 127,
    experience: "15 years",
    rate: "$120/session",
    available: true,
  },
  {
    id: 2,
    name: "Dr. Emily Chen",
    specialty: "Internal Medicine",
    category: "doctor",
    image: "https://images.unsplash.com/photo-1772987057599-2f1088c1e993?w=300",
    rating: 5.0,
    reviews: 203,
    experience: "12 years",
    rate: "$150/session",
    available: true,
  },
  {
    id: 3,
    name: "Michael Thompson",
    specialty: "Family Law Attorney",
    category: "legal",
    image: "https://images.unsplash.com/photo-1775367407880-63295892ce3a?w=300",
    rating: 4.8,
    reviews: 89,
    experience: "10 years",
    rate: "$200/session",
    available: true,
  },
  {
    id: 4,
    name: "Jennifer Rodriguez",
    specialty: "Nutritionist & Wellness Coach",
    category: "wellness",
    image: "https://images.unsplash.com/photo-1774109896670-002f2676c0fa?w=300",
    rating: 4.9,
    reviews: 156,
    experience: "8 years",
    rate: "$90/session",
    available: true,
  },
  {
    id: 5,
    name: "Dr. Robert Williams",
    specialty: "Psychiatrist",
    category: "therapist",
    image: "https://images.unsplash.com/photo-1777345141303-c4efc7ff6c91?w=300",
    rating: 4.7,
    reviews: 94,
    experience: "20 years",
    rate: "$180/session",
    available: false,
  },
  {
    id: 6,
    name: "Dr. Amanda Lee",
    specialty: "Pediatrician",
    category: "doctor",
    image: "https://images.unsplash.com/photo-1770546896233-48fb5dfb5bb9?w=300",
    rating: 5.0,
    reviews: 178,
    experience: "14 years",
    rate: "$140/session",
    available: true,
  },
];

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
