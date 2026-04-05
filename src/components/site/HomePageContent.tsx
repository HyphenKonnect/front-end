"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  CheckCircle,
  Clock,
  Heart,
  Shield,
  Star,
  Stethoscope,
  Users,
  Scale,
  Award,
  TrendingUp,
  Phone,
  Lock,
} from "lucide-react";
import { ProfessionalsScrollSection } from "./ProfessionalsScrollSection";

const services = [
  {
    icon: Brain,
    title: "Mental Wellness",
    description: "Professional therapy and counseling for your healing journey.",
    image:
      "https://images.unsplash.com/photo-1493836512294-502baa1986e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    icon: Stethoscope,
    title: "Medical Consultation",
    description: "Licensed medical experts available online when you need them.",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    icon: Scale,
    title: "Legal Guidance",
    description: "Qualified legal professionals for advice and next steps.",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    icon: Heart,
    title: "Wellness Programs",
    description: "Holistic programs that support mind, body, and routine.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Clients" },
  { icon: CheckCircle, value: "50+", label: "Expert Professionals" },
  { icon: Clock, value: "24/7", label: "Support Available" },
  { icon: Shield, value: "100%", label: "Confidential" },
];

const journey = [
  {
    step: "1",
    title: "Tell us what you're going through",
    mockup: "intake",
  },
  {
    step: "2",
    title: "Get matched with the right professionals",
    mockup: null,
  },
  {
    step: "3",
    title: "Start your sessions online",
    mockup: "video",
  },
  {
    step: "4",
    title: "Stay supported through your dashboard",
    mockup: "dashboard",
  },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: "Privacy-First Platform",
    description:
      "Your personal information, requests, and conversations are handled with confidentiality and care.",
  },
  {
    icon: Award,
    title: "Verified Experts",
    description:
      "We work with professionals whose backgrounds, credentials, and areas of practice are reviewed before onboarding.",
  },
  {
    icon: Clock,
    title: "Flexible Online Access",
    description:
      "Sessions are online, easy to schedule, and designed to reduce the stress of travel, waiting rooms, and coordination.",
  },
  {
    icon: TrendingUp,
    title: "Thoughtful Matching",
    description:
      "We focus on connecting people with the right kind of support instead of leaving them to figure everything out alone.",
  },
  {
    icon: Phone,
    title: "Responsive Support Team",
    description:
      "Our customer support team stays available around the clock to guide users, even though professionals are not 24x7.",
  },
  {
    icon: Lock,
    title: "Comfort and Trust",
    description:
      "From first contact to follow-up, the experience is built to feel safe, respectful, and human-centered.",
  },
];

const testimonials = [
  {
    quote:
      "I was able to find a therapist who really understood trauma recovery, and the whole booking process felt calm and private.",
    name: "Ananya Sharma",
    city: "Bengaluru",
  },
  {
    quote:
      "The legal consultation gave me clarity at a time when I felt completely stuck. It was practical, kind, and easy to access online.",
    name: "Rohan Mehta",
    city: "Mumbai",
  },
  {
    quote:
      "Being able to speak with a doctor remotely saved me time and stress, especially while managing things across time zones.",
    name: "Priya Nair",
    city: "Hyderabad",
  },
  {
    quote:
      "The wellness support helped me rebuild my routine after burnout. The experience felt personal rather than transactional.",
    name: "Karthik Iyer",
    city: "Dubai",
  },
];

const faqs = [
  {
    question: "What is Hyphen Konnect and how can it help me?",
    answer:
      "Hyphen Konnect is a support and connection platform designed to help you easily find trusted mental health, medical, legal, and wellness services online. We understand that seeking help can feel confusing or overwhelming, so we simplify the process for you. Our team listens carefully to your needs and connects you with the right professionals. Our goal is to make quality support accessible, comfortable, and stress-free.",
  },
  {
    question: "What types of support can I access through Hyphen Konnect?",
    answer:
      "Through Hyphen Konnect, you can access a wide range of online services including mental health counseling, medical guidance, legal consultations, and wellness coaching. All professionals in our network are verified and experienced in their respective fields. We carefully match you with experts based on your concerns and preferences. This ensures you receive personalized and reliable care from the very beginning.",
  },
  {
    question: "Is my personal information kept confidential?",
    answer:
      "Absolutely. Your privacy and confidentiality are extremely important to us. All personal information you share is protected using secure systems and strict data policies. We only use your details to connect you with appropriate professionals and never share them without your consent. You can feel safe knowing your journey with us is handled with complete discretion.",
  },
  {
    question: "Do you provide direct medical treatment or legal advice?",
    answer:
      "Hyphen Konnect does not replace licensed doctors, therapists, or legal professionals. Instead, we act as a bridge that connects you with qualified experts who can provide proper advice and treatment online. We carefully verify all professionals in our network before onboarding them. This ensures you always receive guidance from trained and certified practitioners.",
  },
  {
    question: "Can I choose my own therapist, doctor, or legal expert?",
    answer:
      "Yes, you have complete freedom to choose the professional you feel most comfortable with. You can browse profiles, review areas of expertise, and select based on your specific needs and preferences. We believe that the right connection makes a big difference in your healing and support journey. Our team is also available to assist you in making the best choice.",
  },
  {
    question: "Are consultations conducted online?",
    answer:
      "Yes, all consultations and guidance sessions are conducted online for your convenience and privacy. This allows you to access quality support from the comfort of your home, no matter where you are located. Our online platforms are secure and easy to use. This also helps reduce travel time, waiting periods, and unnecessary stress.",
  },
  {
    question: "How quickly will someone contact me after I submit a request?",
    answer:
      "Once you submit your request, our support team carefully reviews your information and typically responds within 24 hours. We take the time to understand your concerns before connecting you with the right professional. In urgent cases, we try our best to respond even faster. Our priority is to ensure you receive timely and appropriate guidance.",
  },
  {
    question: "Is Hyphen Konnect suitable for families and caregivers?",
    answer:
      "Yes, Hyphen Konnect supports not only individuals but also families and caregivers who are seeking guidance and assistance. We understand that caregiving can be emotionally and physically demanding. Our platform helps families find the right mental, medical, legal, and wellness support online. We aim to strengthen both individuals and their support systems.",
  },
  {
    question: "Do I need a referral to use Hyphen Konnect?",
    answer:
      "No referral is needed to use Hyphen Konnect. You can directly reach out to us whenever you feel the need for support. Our simple and easy onboarding process allows you to get started quickly without any formal paperwork. We are here to guide you step by step from your very first interaction.",
  },
  {
    question: "How do I get started with Hyphen Konnect?",
    answer:
      "Getting started is simple and quick. Click on “Connect with us,” fill out the short form with your basic details and concerns, and submit it. Our team will contact you within 24 hours to understand your needs better. From there, we will guide you through selecting the right professional and scheduling your online session.",
  },
];

export function HomePageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeJourneyStep, setActiveJourneyStep] = useState(1);

  return (
    <div className="bg-[#f7f5f4] pt-20">
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#f7f5f4] to-white px-6 py-20 lg:px-[120px] lg:py-32">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#f56969]/5 to-[#e6b9e6]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-[#f5912d]/5 to-[#ffdbff]/5 blur-3xl" />
        <div className="relative z-10 mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f56969]/20 bg-gradient-to-r from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10 px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-[#f5912d] to-[#f56969]" />
              <span className="text-sm font-medium text-[#f56969]">
                Your Holistic Wellness Platform
              </span>
            </div>
            <h1 className="mb-6 text-[48px] font-bold leading-tight tracking-[-1.8px] text-[#2b2b2b] lg:text-[56px]">
              Connect with{" "}
              <span className="bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] bg-clip-text text-transparent">
                Expert Care
              </span>
              <br />
              Anytime, Anywhere
            </h1>
            <p className="mb-8 max-w-[560px] text-[18px] leading-[28px] text-[#7e7e7e]">
              Book online sessions with licensed professionals for mental health,
              medical consultation, legal guidance, and wellness support.
            </p>
            <div className="mb-12 flex flex-col gap-4 sm:flex-row">
              <Link href="/#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-8 py-4 font-medium text-white shadow-lg">
                Book a Session
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/#services" className="rounded-full border-2 border-[#2b2b2b] px-8 py-4 font-medium text-[#2b2b2b] transition-all hover:bg-[#2b2b2b] hover:text-white">
                Explore Services
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 border-t border-[#e6b9e6]/30 pt-6">
              <TrustItem icon={Shield} label="HIPAA Compliant" />
              <TrustItem icon={CheckCircle} label="Licensed Professionals" />
              <TrustItem icon={Clock} label="24/7 Support" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <div className="overflow-hidden rounded-[32px] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Professional care"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-[24px] bg-white p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6]">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2b2b2b]">10,000+</p>
                  <p className="text-sm text-[#7e7e7e]">Happy Clients</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 lg:px-[120px]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10">
                <stat.icon className="h-8 w-8 text-[#f56969]" />
              </div>
              <p className="mb-2 text-4xl font-bold text-[#2b2b2b]">{stat.value}</p>
              <p className="text-sm text-[#7e7e7e]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="bg-[#f7f5f4] px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading eyebrow="Our Services" title="Comprehensive Care for" highlight="Your Wellness" />
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <div key={service.title} className="group overflow-hidden rounded-[24px] bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative h-[240px] overflow-hidden">
                  <img src={service.image} alt={service.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm">
                    <service.icon className="h-7 w-7 text-[#f56969]" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="mb-3 text-[24px] font-bold text-[#2b2b2b]">{service.title}</h3>
                  <p className="mb-6 text-[16px] leading-6 text-[#7e7e7e]">{service.description}</p>
                  <Link href="/#contact" className="inline-flex items-center gap-2 text-[15px] font-medium text-[#f56969] transition-all hover:gap-3">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading eyebrow="Your Journey" title="How It" highlight="Works" />
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-6">
              {journey.map((item, index) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActiveJourneyStep(index)}
                  className={`block w-full rounded-[24px] p-8 text-left transition-all ${
                    activeJourneyStep === index
                      ? "bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] shadow-lg"
                      : "bg-[#bfd4ee] hover:bg-[#b3cae8]"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="text-[64px] font-bold leading-none text-white">
                      {item.step}
                    </div>
                    <h3
                      className={`text-[18px] font-bold leading-6 ${
                        activeJourneyStep === index
                          ? "text-white"
                          : "text-[#2b2b2b]"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative h-[680px] w-[340px] rounded-[48px] bg-[#1a1a1a] p-3 shadow-2xl">
                <div className="absolute top-6 left-1/2 z-10 h-[28px] w-[120px] -translate-x-1/2 rounded-full bg-[#1a1a1a]" />
                <div className="h-full w-full overflow-hidden rounded-[36px] bg-white">
                  {journey[activeJourneyStep]?.mockup === "intake" ? (
                    <JourneyIntakeScreen />
                  ) : journey[activeJourneyStep]?.mockup === "video" ? (
                    <JourneyVideoScreen />
                  ) : journey[activeJourneyStep]?.mockup === "dashboard" ? (
                    <JourneyDashboardScreen />
                  ) : (
                    <div className="p-8 pt-12">
                      <div className="mb-8 text-center">
                        <p className="mb-4 text-[14px] text-[#f56969]">
                          The Hyphen Konnect
                        </p>
                        <h3 className="text-[18px] font-bold text-[#2b2b2b]">
                          Meet with professional
                        </h3>
                      </div>
                      <div className="rounded-[20px] bg-white p-6 shadow-lg">
                        <div className="mb-4 text-center">
                          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d]/20 via-[#f56969]/20 to-[#e6b9e6]/20">
                            <Brain className="h-12 w-12 text-[#f56969]" />
                          </div>
                          <h4 className="mb-1 text-[16px] font-bold text-[#2b2b2b]">
                            Swetha Rao Madiwalar
                          </h4>
                          <div className="mb-3 flex items-center justify-center gap-2">
                            <span className="text-[12px] text-[#7e7e7e]">
                              Delhi
                            </span>
                            <span className="rounded-full bg-[#f56969] px-3 py-1 text-[10px] font-medium text-white">
                              Top Rated
                            </span>
                          </div>
                        </div>
                        <p className="mb-4 text-center text-[11px] leading-4 text-[#7e7e7e]">
                          A compassionate counselor profile designed to mirror
                          the Figma mobile card.
                        </p>
                        <div className="mb-4 space-y-2">
                          <DetailItem label="7 Years Experience" />
                          <DetailItem label="Master Degree in Law" />
                        </div>
                        <button
                          type="button"
                          className="w-full rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] py-3 text-[12px] font-medium text-white"
                        >
                          Book Session
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProfessionalsScrollSection />

      <section id="professionals" className="bg-[#f7f5f4] px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading eyebrow="Why Choose Us" title="Your Trust is" highlight="Our Priority" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((feature) => (
              <div key={feature.title} className="rounded-[24px] bg-white p-8 transition-all hover:shadow-lg">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10">
                  <feature.icon className="h-7 w-7 text-[#f56969]" />
                </div>
                <h3 className="mb-3 text-[20px] font-bold text-[#2b2b2b]">{feature.title}</h3>
                <p className="text-[15px] leading-6 text-[#7e7e7e]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading eyebrow="Testimonials" title="What Our Clients" highlight="Say" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.name} className="rounded-[24px] bg-gradient-to-br from-[#f7f5f4] to-white p-6 transition-all hover:shadow-lg">
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={`${index}-${i}`} className="h-4 w-4 fill-[#f5912d] text-[#f5912d]" />
                  ))}
                </div>
                <p className="mb-6 text-[14px] leading-[22px] text-[#7e7e7e]">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="text-[16px] font-bold text-[#2b2b2b]">
                  {testimonial.name}
                </p>
                <p className="text-[13px] text-[#f56969]">
                  {testimonial.city}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f7f5f4] px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 text-center">
            <h2 className="text-[45px] font-bold leading-[48px] tracking-[-1.8px] text-[#2b2b2b]">
              We&apos;re here to <span className="font-light text-[#f56969]">help</span>
            </h2>
          </div>
          <div className="mx-auto max-w-[900px] space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="overflow-hidden rounded-[30px] transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between rounded-[30px] border border-[#d6e0ec] bg-[#b9c9de] px-6 py-5 text-left"
                >
                  <h3 className="pr-4 text-[16px] font-normal text-[#2b2b2b]">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[18px] font-medium text-[#2b2b2b]"
                  >
                    +
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === index ? "auto" : 0, opacity: openFaq === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-2 pt-2">
                    <p className="text-[14px] leading-[26px] text-[#2b2b2b]">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="mb-4 text-[16px] text-[#7e7e7e]">Still have questions?</p>
            <Link href="/#contact" className="inline-flex items-center gap-2 text-[16px] font-medium text-[#f56969] transition-all hover:gap-3">
              Contact our support team
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-6 py-20 lg:px-[120px]">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-[1440px] text-center">
          <h2 className="mb-6 text-[42px] font-bold leading-tight text-white lg:text-[48px]">
            Ready to Start Your <span className="font-light">Wellness Journey?</span>
          </h2>
          <p className="mx-auto mb-10 max-w-[600px] text-[18px] leading-[28px] text-white/90">
            Join thousands of people who have found support, healing, and guidance through our platform.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/#contact" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-[#f56969] shadow-lg">
              Book Your First Session
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/#contact" className="rounded-full border-2 border-white px-8 py-4 font-medium text-white transition-all hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  highlight,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
}) {
  return (
    <div className="mb-16 text-center">
      <p className="mb-4 text-base text-[#7e7e7e]">{eyebrow}</p>
      <h2 className="text-[45px] font-bold leading-[48px] tracking-[-1.8px] text-[#2b2b2b]">
        {title}{" "}
        <span className="bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] bg-clip-text text-transparent">
          {highlight}
        </span>
      </h2>
    </div>
  );
}

function TrustItem({
  icon: Icon,
  label,
}: {
  icon: typeof Shield;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-[#f56969]" />
      <span className="text-sm text-[#7e7e7e]">{label}</span>
    </div>
  );
}

function DetailItem({ label }: { label: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#f56969]" />
      <span className="text-[11px] text-[#7e7e7e]">{label}</span>
    </div>
  );
}

function JourneyIntakeScreen() {
  const fields = [
    "Date",
    "Full Name",
    "Birth Date",
    "Phone Number",
    "Email",
    "Tell Us",
  ];

  return (
    <div className="h-full bg-[#fbf8f8] px-7 pb-8 pt-16">
      <p className="mb-7 text-center text-[13px] font-medium text-[#d8a0d2]">
        The Hyphen Konnect
      </p>
      <div className="rounded-[28px] border border-white bg-[#f6f1f1] px-6 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <h3 className="mb-7 text-[14px] font-semibold text-[#ff6b6b]">
          Tell us what you&apos;re going through
        </h3>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field} className="grid grid-cols-[78px_1fr] items-center gap-3">
              <span className="text-[11px] text-[#2b2b2b]">{field}</span>
              <div
                className={`rounded-[4px] bg-white ${
                  field === "Tell Us" ? "h-14" : "h-7"
                }`}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mx-auto mt-8 block rounded-[10px] bg-[#ff6b6b] px-10 py-2.5 text-[12px] font-medium text-white"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function JourneyVideoScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-[#111]">
      <img
        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900"
        alt="Session preview"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/45" />
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-7 pt-14 text-white">
        <span className="text-xl">↗</span>
        <div className="text-center">
          <p className="text-[12px] font-medium">Shreya Aila</p>
          <p className="text-[10px] text-white/70">00:24</p>
        </div>
        <span className="text-xl">⌄</span>
      </div>
      <div className="absolute bottom-28 right-6 overflow-hidden rounded-[16px] border border-white/20 shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
          alt="Participant preview"
          className="h-[120px] w-[92px] object-cover"
        />
      </div>
      <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-6">
        <ControlButton label="Mic" dark={false} />
        <ControlButton label="End" dark />
        <ControlButton label="Cam" dark={false} />
      </div>
    </div>
  );
}

function JourneyDashboardScreen() {
  const upcoming = [
    { time: "9:00 AM", label: "Medical Professionals" },
    { time: "6:30 PM", label: "Wellness Check-in" },
  ];

  return (
    <div className="h-full bg-[#fbf8f8] px-7 pb-8 pt-16">
      <p className="mb-6 text-center text-[13px] font-medium text-[#d8a0d2]">
        The Hyphen Konnect
      </p>
      <div className="rounded-[28px] border border-white bg-[#f6f1f1] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="mb-6 flex items-center justify-between rounded-[16px] bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=240"
              alt="User avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-[12px] font-medium text-[#2b2b2b]">
              Swathi Reddy
            </span>
          </div>
          <span className="text-lg text-[#7e7e7e]">≡</span>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-3 text-[13px] font-semibold text-[#ff6b6b]">
              Appointments
            </p>
            <div className="space-y-3">
              <DashboardField label="Nov 6, 2025" />
              <DashboardField label="Services" />
              <DashboardField label="Professionals" />
            </div>
          </div>

          <div>
            <p className="mb-3 text-[12px] text-[#2b2b2b]">November 21, 2025</p>
            <div className="space-y-2">
              {upcoming.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-[8px] bg-white px-3 py-2 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-[11px] text-[#7e7e7e]">
                    <span>{item.time}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[13px] font-semibold text-[#ff6b6b]">Events</p>
            <DashboardField label="Dec 25, 2025" />
          </div>
        </div>

        <button
          type="button"
          className="mx-auto mt-8 block rounded-[10px] bg-[#ff6b6b] px-10 py-2.5 text-[12px] font-medium text-white"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

function DashboardField({ label }: { label: string }) {
  return (
    <div className="rounded-[8px] bg-white px-4 py-2.5 text-center text-[11px] text-[#c3c3c3] shadow-sm">
      {label}
    </div>
  );
}

function ControlButton({
  label,
  dark,
}: {
  label: string;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex h-14 w-14 items-center justify-center rounded-full text-[12px] font-medium ${
        dark ? "bg-[#ff2435] text-white" : "bg-white text-[#2b2b2b]"
      }`}
    >
      {label}
    </button>
  );
}
