"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  CheckCircle,
  ChevronDown,
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
      "https://images.unsplash.com/photo-1714976695024-55a90b113f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    icon: Stethoscope,
    title: "Medical Consultation",
    description: "Licensed medical experts available online when you need them.",
    image:
      "https://images.unsplash.com/photo-1615177393579-5fc7431152c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    icon: Scale,
    title: "Legal Guidance",
    description: "Qualified legal professionals for advice and next steps.",
    image:
      "https://images.unsplash.com/photo-1743017524261-f026c51acf7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    icon: Heart,
    title: "Wellness Programs",
    description: "Holistic programs that support mind, body, and routine.",
    image:
      "https://images.unsplash.com/photo-1773212902295-14c35ee22235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Clients" },
  { icon: CheckCircle, value: "50+", label: "Expert Professionals" },
  { icon: Clock, value: "24/7", label: "Support Available" },
  { icon: Shield, value: "100%", label: "Confidential" },
];

const journey = [
  { step: "1", title: "Tell us what you're going through", bg: "bg-[#bfd4ee]" },
  {
    step: "2",
    title: "Get matched with the right professionals",
    bg: "bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6]",
  },
  { step: "3", title: "Start your sessions online", bg: "bg-[#bfd4ee]" },
  {
    step: "4",
    title: "Stay supported through your dashboard",
    bg: "bg-[#bfd4ee]",
  },
];

const whyChooseUs = [
  { icon: Shield, title: "HIPAA Compliant & Secure" },
  { icon: Award, title: "Verified Professionals" },
  { icon: Clock, title: "Available 24/7" },
  { icon: TrendingUp, title: "95% Success Rate" },
  { icon: Phone, title: "Instant Support" },
  { icon: Lock, title: "100% Confidential" },
];

const testimonials = [
  "The Hyphen Konnect transformed my mental health journey.",
  "Getting legal guidance was never this convenient.",
  "The medical consultation feature is a game-changer.",
  "The wellness programs helped me build healthier habits.",
];

const faqs = [
  "How do I book my first session?",
  "Are sessions really confidential?",
  "What if I need to cancel or reschedule?",
  "Do you accept insurance?",
];

export function HomePageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
                <div key={item.step} className={`rounded-[24px] p-8 ${item.bg}`}>
                  <div className="flex items-center gap-6">
                    <div className="text-[64px] font-bold leading-none text-white">{item.step}</div>
                    <h3 className={`text-[18px] font-bold leading-6 ${index === 1 ? "text-white" : "text-[#2b2b2b]"}`}>
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative h-[680px] w-[340px] rounded-[48px] bg-[#1a1a1a] p-3 shadow-2xl">
                <div className="absolute top-6 left-1/2 z-10 h-[28px] w-[120px] -translate-x-1/2 rounded-full bg-[#1a1a1a]" />
                <div className="h-full w-full overflow-hidden rounded-[36px] bg-white">
                  <div className="p-8 pt-12">
                    <div className="mb-8 text-center">
                      <p className="mb-4 text-[14px] text-[#f56969]">The Hyphen Konnect</p>
                      <h3 className="text-[18px] font-bold text-[#2b2b2b]">Meet with professional</h3>
                    </div>
                    <div className="rounded-[20px] bg-white p-6 shadow-lg">
                      <div className="mb-4 text-center">
                        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d]/20 via-[#f56969]/20 to-[#e6b9e6]/20">
                          <Brain className="h-12 w-12 text-[#f56969]" />
                        </div>
                        <h4 className="mb-1 text-[16px] font-bold text-[#2b2b2b]">Swetha Rao Madiwalar</h4>
                        <div className="mb-3 flex items-center justify-center gap-2">
                          <span className="text-[12px] text-[#7e7e7e]">Delhi</span>
                          <span className="rounded-full bg-[#f56969] px-3 py-1 text-[10px] font-medium text-white">Top Rated</span>
                        </div>
                      </div>
                      <p className="mb-4 text-center text-[11px] leading-4 text-[#7e7e7e]">
                        A compassionate counselor profile designed to mirror the Figma mobile card.
                      </p>
                      <div className="mb-4 space-y-2">
                        <DetailItem label="7 Years Experience" />
                        <DetailItem label="Master Degree in Law" />
                      </div>
                      <button type="button" className="w-full rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] py-3 text-[12px] font-medium text-white">
                        Book Session
                      </button>
                    </div>
                  </div>
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
                  Platform-level trust, support, and care built into every interaction.
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
            {testimonials.map((quote, index) => (
              <div key={quote} className="rounded-[24px] bg-gradient-to-br from-[#f7f5f4] to-white p-6 transition-all hover:shadow-lg">
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={`${index}-${i}`} className="h-4 w-4 fill-[#f5912d] text-[#f5912d]" />
                  ))}
                </div>
                <p className="mb-6 text-[14px] leading-[22px] text-[#7e7e7e]">&ldquo;{quote}&rdquo;</p>
                <p className="text-[16px] font-bold text-[#2b2b2b]">Client Story</p>
                <p className="text-[13px] text-[#f56969]">Verified Member</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f7f5f4] px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked" highlight="Questions" />
          <div className="mx-auto max-w-[900px] space-y-4">
            {faqs.map((faq, index) => (
              <div key={faq} className="overflow-hidden rounded-[20px] bg-white shadow-sm transition-all hover:shadow-md">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between px-8 py-6 text-left"
                >
                  <h3 className="pr-4 text-[18px] font-bold text-[#2b2b2b]">{faq}</h3>
                  <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="h-6 w-6 text-[#f56969]" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === index ? "auto" : 0, opacity: openFaq === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6">
                    <p className="text-[16px] leading-[26px] text-[#7e7e7e]">
                      The answer content can be expanded here exactly as the Figma interaction expects.
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
