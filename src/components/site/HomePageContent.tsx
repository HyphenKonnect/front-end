"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  X,
} from "lucide-react";
import { ProfessionalsScrollSection } from "./ProfessionalsScrollSection";
import { Button } from "../ui/Button";

const services = [
  {
    icon: Brain,
    title: "Mental Wellness",
    description:
      "Professional therapy and counseling for your healing journey.",
    image:
      "https://images.unsplash.com/photo-1493836512294-502baa1986e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    icon: Stethoscope,
    title: "Medical Consultation",
    description:
      "Licensed medical experts available online when you need them.",
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

const supportOptions = [
  {
    label: "Mental / Emotional Health",
    description: "Therapy, counselling, trauma support, and emotional care.",
    destination: "/services/mental-wellness",
    actionLabel: "Go to Therapy Services",
  },
  {
    label: "Medical / Physical Health",
    description: "Online consultations for physical and medical concerns.",
    destination: "/services/medical-consultation",
    actionLabel: "Go to Medical Services",
  },
  {
    label: "Legal Help",
    description: "Legal guidance, rights support, and next-step advice.",
    destination: "/services/legal-guidance",
    actionLabel: "Go to Legal Services",
  },
  {
    label: "Wellness Services",
    description: "Holistic wellness support for mind, body, and routine.",
    destination: "/services/wellness-programs",
    actionLabel: "Go to Wellness Services",
  },
  {
    label: "I'm Not Sure",
    description: "We can help you decide where to begin.",
    destination: "/#contact",
    actionLabel: "Go to Contact Us",
  },
];

const urgencyOptions = [
  "Not urgent",
  "Somewhat urgent",
  "Very urgent",
  "Emergency",
] as const;

type SupportLabel = (typeof supportOptions)[number]["label"];
type UrgencyLabel = (typeof urgencyOptions)[number];

export function HomePageContent() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeJourneyStep, setActiveJourneyStep] = useState(1);
  const [isGuidedModalOpen, setIsGuidedModalOpen] = useState(false);
  const [guidedStep, setGuidedStep] = useState(1);
  const [selectedSupport, setSelectedSupport] = useState<SupportLabel | null>(
    null,
  );
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLabel | null>(
    null,
  );

  const selectedSupportOption = supportOptions.find(
    (option) => option.label === selectedSupport,
  );

  const resetGuidedFlow = () => {
    setIsGuidedModalOpen(false);
    setGuidedStep(1);
    setSelectedSupport(null);
    setSelectedUrgency(null);
  };

  const handleGuidedNext = () => {
    if (guidedStep === 1 && selectedSupport) {
      setGuidedStep(2);
      return;
    }

    if (guidedStep === 2 && selectedUrgency) {
      if (selectedUrgency === "Emergency") {
        setGuidedStep(3);
        return;
      }

      if (selectedSupportOption) {
        resetGuidedFlow();
        router.push(selectedSupportOption.destination);
      }
    }
  };

  const handleGuidedPrevious = () => {
    if (guidedStep > 1) {
      setGuidedStep((current) => current - 1);
    }
  };

  return (
    <div className="bg-[#f7f5f4] pt-20">
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#f7f5f4] to-white px-6 py-20 lg:px-[120px] lg:py-32">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#f56969]/5 to-[#e6b9e6]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-[#f5912d]/5 to-[#ffdbff]/5 blur-3xl" />
        <div className="relative z-10 mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
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
              Book online sessions with licensed professionals for mental
              health, medical consultation, legal guidance, and wellness
              support.
            </p>
            <div className="mb-12 flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={() => setIsGuidedModalOpen(true)}
                size="lg"
                className="min-w-[210px] px-9 py-4 text-[16px] font-semibold shadow-[0_18px_40px_rgba(245,105,105,0.25)]"
                icon={<ArrowRight className="h-5 w-5" />}
              >
                Begin Your Healing Journey
              </Button>
              <Button
                href="/services"
                variant="outline"
                size="lg"
                className="min-w-[210px] border-[#2b2b2b] bg-white/80 px-9 py-4 text-[16px] font-semibold backdrop-blur-sm hover:bg-[#2b2b2b] hover:text-white"
              >
                Explore Services
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 border-t border-[#e6b9e6]/30 pt-6">
              <TrustItem icon={Shield} label="HIPAA Compliant" />
              <TrustItem icon={CheckCircle} label="Licensed Professionals" />
              <TrustItem icon={Clock} label="24/7 Support" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[32px] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Professional care"
                width={1080}
                height={810}
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

      {isGuidedModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1f2334]/58 px-3 py-4 backdrop-blur-[2px] sm:px-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-[560px] overflow-hidden rounded-[20px] bg-white p-5 shadow-[0_28px_80px_rgba(20,33,61,0.24)] sm:max-w-[620px] sm:rounded-[24px] sm:p-6"
          >
              <button
                type="button"
                onClick={resetGuidedFlow}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-[#222222] text-white shadow-sm transition-colors hover:bg-[#111111] sm:right-4 sm:top-4 sm:h-10 sm:w-10"
                aria-label="Close support guide"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <div className="max-h-[78vh] overflow-y-auto pr-8 sm:pr-10">
              <div className="pr-2">
                <h3 className="max-w-[430px] text-[20px] font-bold leading-tight text-[#0f2147] sm:text-[30px]">
                  Let&apos;s find the right support for you
                </h3>
                <p className="mt-2 text-[13px] leading-5 text-[#8a93a6] sm:text-[15px]">
                  Answer a few questions so we can guide you better.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 sm:mt-6 sm:gap-4">
              {[1, 2, 3].map((step) => {
                const isComplete = step < guidedStep;
                const isActive = step === guidedStep;

                return (
                  <div
                    key={step}
                      className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
                    >
                      <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold sm:h-9 sm:w-9 sm:text-sm ${
                          isActive
                            ? "bg-gradient-to-r from-[#f56969] to-[#ff86b2] text-white"
                            : isComplete
                              ? "bg-[#b77cf1] text-white"
                              : "bg-[#e7ebf1] text-[#a8afbc]"
                        }`}
                      >
                        {step}
                      </div>
                        <span
                          className={`mt-2 text-center text-[11px] leading-4 sm:text-[13px] ${
                            isActive
                              ? "font-semibold text-[#f56969]"
                              : isComplete
                              ? "text-[#b77cf1]"
                              : "text-[#b7b7b7]"
                        }`}
                      >
                        {step === 3 ? "Finish" : `Page ${step}`}
                      </span>
                    </div>
                      {step < 3 ? (
                        <div
                          className={`h-[3px] flex-1 rounded-full ${
                            guidedStep > step
                              ? "bg-gradient-to-r from-[#f56969] to-[#c785f7]"
                              : "bg-[#e7ebf1]"
                          }`}
                        />
                    ) : null}
                  </div>
                );
              })}
            </div>

              {guidedStep === 1 ? (
                <div className="mt-6 sm:mt-8">
                  <h4 className="text-[17px] font-semibold text-[#0f2147] sm:text-[19px]">
                    What brings you here today?{" "}
                    <span className="text-[#f56969]">*</span>
                  </h4>
                  <div className="mt-4 space-y-3 sm:mt-5">
                  {supportOptions.map((option) => {
                    const isSelected = selectedSupport === option.label;

                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setSelectedSupport(option.label)}
                            className={`flex w-full items-center gap-3 rounded-[14px] border px-4 py-3.5 text-left transition-all sm:rounded-[16px] sm:px-5 sm:py-4 ${
                            isSelected
                              ? "border-[#f1b6c7] bg-[#fffafb] shadow-sm"
                              : "border-[#dde3ec] bg-white hover:border-[#f0cbd6]"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border ${
                              isSelected
                                ? "border-[#f56969] bg-white"
                                : "border-[#cfd6de] bg-white"
                            }`}
                          >
                            <span
                              className={`h-3 w-3 rounded-full ${
                                isSelected ? "bg-[#f56969]" : "bg-transparent"
                              }`}
                            />
                          </span>
                          <span className="block">
                              <span className="block text-[15px] font-medium text-[#0f2147] sm:text-[16px]">
                                {option.label}
                              </span>
                          </span>
                        </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

              {guidedStep === 2 ? (
                <div className="mt-6 sm:mt-8">
                  <h4 className="text-[17px] font-semibold text-[#0f2147] sm:text-[19px]">
                    How urgent is your concern?{" "}
                    <span className="text-[#f56969]">*</span>
                  </h4>
                  <div className="mt-4 space-y-3 sm:mt-5">
                  {urgencyOptions.map((option) => {
                    const isSelected = selectedUrgency === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSelectedUrgency(option)}
                            className={`flex w-full items-center gap-3 rounded-[14px] border px-4 py-3.5 text-left transition-all sm:rounded-[16px] sm:px-5 sm:py-4 ${
                            isSelected
                              ? "border-[#f1b6c7] bg-[#fffafb] shadow-sm"
                              : "border-[#dde3ec] bg-white hover:border-[#f0cbd6]"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border ${
                              isSelected
                                ? "border-[#f56969] bg-white"
                                : "border-[#cfd6de] bg-white"
                            }`}
                          >
                            <span
                              className={`h-3 w-3 rounded-full ${
                                isSelected ? "bg-[#f56969]" : "bg-transparent"
                              }`}
                            />
                          </span>
                            <span className="text-[15px] font-medium text-[#0f2147] sm:text-[16px]">
                              {option}
                            </span>
                        </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

              {guidedStep === 3 ? (
                <div className="mt-6 rounded-[20px] border border-[#ffd5db] bg-[#fff7f8] p-4 sm:mt-8 sm:rounded-[24px] sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f56969]">
                      Emergency Support
                    </p>
                        <h4 className="mt-2 text-[21px] font-bold leading-tight text-[#14213d] sm:text-[26px]">
                          Please seek immediate help now
                        </h4>
                        <p className="mt-3 max-w-[520px] text-[14px] leading-6 text-[#5d6678] sm:text-[15px] sm:leading-6">
                        If you or someone else may be in immediate danger, do not
                        wait for a booking. Contact emergency services or a crisis
                        line right away.
                    </p>
                  </div>
                    <div className="rounded-full bg-[#ffe7eb] px-4 py-2 text-xs font-semibold text-[#f56969] sm:text-sm">
                      Urgency: Emergency
                    </div>
                  </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-[18px] bg-white p-4 shadow-sm sm:rounded-[20px] sm:p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7e7e7e]">
                      India
                    </p>
                    <div className="mt-4 space-y-3 text-[16px] text-[#2b2b2b]">
                      <p>
                        <span className="font-semibold">Emergency:</span> 112
                      </p>
                      <p>
                        <span className="font-semibold">Ambulance:</span> 108
                      </p>
                      <p>
                        <span className="font-semibold">
                          Mental health support:
                        </span>{" "}
                        Tele-MANAS 14416
                      </p>
                    </div>
                  </div>
                    <div className="rounded-[18px] bg-white p-4 shadow-sm sm:rounded-[20px] sm:p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7e7e7e]">
                      International
                    </p>
                    <div className="mt-4 space-y-3 text-[16px] text-[#2b2b2b]">
                      <p>
                        <span className="font-semibold">Immediate danger:</span>{" "}
                        Call your local emergency number now
                      </p>
                      <p>
                        <span className="font-semibold">U.S. / Canada:</span>{" "}
                        Call or text 988
                      </p>
                      <p>
                        <span className="font-semibold">If in the U.S.:</span>{" "}
                        911 for emergency services
                      </p>
                    </div>
                  </div>
                </div>

                    <div className="mt-5 rounded-[18px] bg-white px-4 py-4 text-[13px] leading-5 text-[#5d6678] shadow-sm sm:px-5 sm:text-[14px]">
                    Once you are safe, our team can still help you find the right
                    therapist, medical professional, legal advisor, or wellness
                    expert.
                </div>
              </div>
            ) : null}

                <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    onClick={guidedStep === 1 ? resetGuidedFlow : handleGuidedPrevious}
                    variant="outline"
                    className="min-w-[120px] px-4 py-2 text-[14px] font-semibold sm:min-w-[140px] sm:px-5 sm:py-2.5 sm:text-[15px]"
                  >
                    {guidedStep === 1 ? "Close" : "Previous"}
                  </Button>

                {guidedStep < 3 ? (
                  <Button
                      onClick={handleGuidedNext}
                      disabled={
                        (guidedStep === 1 && !selectedSupport) ||
                        (guidedStep === 2 && !selectedUrgency)
                      }
                      className="min-w-[132px] px-4 py-2 text-[14px] font-semibold disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[155px] sm:px-5 sm:py-2.5 sm:text-[15px]"
                      icon={<ArrowRight className="h-5 w-5" />}
                    >
                      Next
                </Button>
              ) : (
                  <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        href="/#contact"
                          className="min-w-[150px] px-4 py-2 text-[14px] font-semibold sm:min-w-[176px] sm:px-5 sm:py-2.5 sm:text-[15px]"
                      >
                        Contact Us Instead
                      </Button>
                      <Button
                        onClick={resetGuidedFlow}
                        variant="outline"
                        className="min-w-[110px] px-4 py-2 text-[14px] font-semibold sm:min-w-[145px] sm:px-5 sm:py-2.5 sm:text-[15px]"
                      >
                        Done
                      </Button>
                  </div>
                )}
              </div>
              </div>
            </motion.div>
        </div>
      ) : null}

      <section className="bg-white px-6 py-16 lg:px-[120px]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10">
                <stat.icon className="h-8 w-8 text-[#f56969]" />
              </div>
              <p className="mb-2 text-4xl font-bold text-[#2b2b2b]">
                {stat.value}
              </p>
              <p className="text-sm text-[#7e7e7e]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="bg-[#f7f5f4] px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Our Services"
            title="Comprehensive Care for"
            highlight="Your Wellness"
          />
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="group overflow-hidden rounded-[24px] bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-[240px] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={1080}
                    height={720}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm">
                    <service.icon className="h-7 w-7 text-[#f56969]" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="mb-3 text-[24px] font-bold text-[#2b2b2b]">
                    {service.title}
                  </h3>
                  <p className="mb-6 text-[16px] leading-6 text-[#7e7e7e]">
                    {service.description}
                  </p>
                  <Link
                    href={`/services/${service.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-2 text-[15px] font-medium text-[#f56969] transition-all hover:gap-3"
                  >
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
          <SectionHeading
            eyebrow="Your Journey"
            title="How It"
            highlight="Works"
          />
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
                        <Link
                          href="/booking"
                          className="block w-full rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] py-3 text-center text-[12px] font-medium text-white"
                        >
                          Book Session
                        </Link>
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

      <section
        id="professionals"
        className="bg-[#f7f5f4] px-6 py-20 lg:px-[120px]"
      >
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Your Trust is"
            highlight="Our Priority"
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[24px] bg-white p-8 transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10">
                  <feature.icon className="h-7 w-7 text-[#f56969]" />
                </div>
                <h3 className="mb-3 text-[20px] font-bold text-[#2b2b2b]">
                  {feature.title}
                </h3>
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
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Clients"
            highlight="Say"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="rounded-[24px] bg-gradient-to-br from-[#f7f5f4] to-white p-6 transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={`${index}-${i}`}
                      className="h-4 w-4 fill-[#f5912d] text-[#f5912d]"
                    />
                  ))}
                </div>
                <p className="mb-6 text-[14px] leading-[22px] text-[#7e7e7e]">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="text-[16px] font-bold text-[#2b2b2b]">
                  {testimonial.name}
                </p>
                <p className="text-[13px] text-[#f56969]">{testimonial.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f7f5f4] px-6 py-20 lg:px-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 text-center">
            <h2 className="text-[45px] font-bold leading-[48px] tracking-[-1.8px] text-[#2b2b2b]">
              We&apos;re here to{" "}
              <span className="font-light text-[#f56969]">help</span>
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
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0,
                  }}
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
            <p className="mb-4 text-[16px] text-[#7e7e7e]">
              Still have questions?
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-[16px] font-medium text-[#f56969] transition-all hover:gap-3"
            >
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
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-[1440px] text-center">
          <h2 className="mb-6 text-[42px] font-bold leading-tight text-white lg:text-[48px]">
            Ready to Start Your{" "}
            <span className="font-light">Wellness Journey?</span>
          </h2>
          <p className="mx-auto mb-10 max-w-[600px] text-[18px] leading-[28px] text-white/90">
            Join thousands of people who have found support, healing, and
            guidance through our platform.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              href="/booking"
              size="lg"
              className="min-w-[230px] bg-white px-9 py-4 text-[16px] font-semibold text-[#f56969] shadow-[0_18px_35px_rgba(0,0,0,0.18)] hover:text-[#f56969]"
              icon={<ArrowRight className="h-5 w-5" />}
            >
              Book Your First Session
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="min-w-[190px] border-white px-9 py-4 text-[16px] font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              Contact Us
            </Button>
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
            <div
              key={field}
              className="grid grid-cols-[78px_1fr] items-center gap-3"
            >
              <span className="text-[11px] text-[#2b2b2b]">{field}</span>
              <div
                className={`rounded-[4px] bg-white ${
                  field === "Tell Us" ? "h-14" : "h-7"
                }`}
              />
            </div>
          ))}
        </div>
        <Link
          href="/#contact"
          className="mx-auto mt-8 block w-fit rounded-[10px] bg-[#ff6b6b] px-10 py-2.5 text-[12px] font-medium text-white"
        >
          Submit
        </Link>
      </div>
    </div>
  );
}

function JourneyVideoScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-[#111]">
      <Image
        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900"
        alt="Session preview"
        fill
        sizes="340px"
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
        <Image
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
          alt="Participant preview"
          width={184}
          height={240}
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
            <Image
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=240"
              alt="User avatar"
              width={80}
              height={80}
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
            <p className="mb-3 text-[13px] font-semibold text-[#ff6b6b]">
              Events
            </p>
            <DashboardField label="Dec 25, 2025" />
          </div>
        </div>

        <Link
          href="/booking"
          className="mx-auto mt-8 block w-fit rounded-[10px] bg-[#ff6b6b] px-10 py-2.5 text-[12px] font-medium text-white"
        >
          Book Now
        </Link>
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

function ControlButton({ label, dark }: { label: string; dark?: boolean }) {
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
